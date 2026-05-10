import json

BUDGET_RANGES = {
    "under_20k":  (0, 20000),
    "20k_30k":    (20000, 30000),
    "30k_40k":    (30000, 40000),
    "40k_60k":    (40000, 60000),
    "60k_80k":    (60000, 80000),
    "80k_plus":   (80000, 9999999),
}

GPU_TIERS = {
    "integrated":    ["Intel Iris Xe", "Intel UHD", "AMD Radeon", "Apple M"],
    "rtx_3050":      ["RTX 3050"],
    "rtx_4050":      ["RTX 4050"],
    "rtx_4060":      ["RTX 4060"],
    "rtx_4070_plus": ["RTX 4070", "RTX 4080", "RTX 4090", "RTX 3080", "RTX 3070", "RTX 3080 Ti", "RTX 3070 Ti"],
    "no_preference": [],
}

def gpu_matches(laptop_gpu: str, pref: str) -> bool:
    if pref == "no_preference":
        return True
    tiers = GPU_TIERS.get(pref, [])
    return any(t.lower() in laptop_gpu.lower() for t in tiers)


def score_laptop(laptop: dict, answers: dict) -> dict:
    # Max points per section sum to 100:
    # Usage=25, Budget=20, Priority=15, Screen=10, GPU=10, CPU=5, Battery=5, Weight=5, Features=5
    score = 0
    pros = []
    cons = []

    usage      = answers.get("usage", "general")
    budget_key = answers.get("budget", "40k_60k")
    priority   = answers.get("priority", "balanced")
    screen_pref = answers.get("screen_size", 15.6)
    gpu_pref   = answers.get("gpu_preference", "no_preference")
    cpu_brand  = answers.get("cpu_brand", "no_preference")
    battery_pref = answers.get("battery", "medium")
    weight_pref  = answers.get("weight", "normal")
    features   = answers.get("features", [])

    tags = json.loads(laptop["usage_tags"])

    # Usage match — 0 / 12 / 25
    usage_map = {
        "gaming": "gaming", "programming": "programming",
        "video_editing": "video_editing", "graphic_design": "graphic_design",
        "ai_ml": "ai_ml", "office": "office", "student": "student", "general": None,
    }
    target_tag = usage_map.get(usage)
    if target_tag is None:
        score += 12
        pros.append("Versatile all-rounder")
    elif target_tag in tags:
        score += 25
        pros.append(f"Great for {usage.replace('_', ' ').title()}")
    else:
        score += 2
        cons.append(f"Not optimized for {usage.replace('_', ' ').title()}")

    # Budget — 0 / 10 / 14 / 20
    lo, hi = BUDGET_RANGES.get(budget_key, (0, 9999999))
    price = laptop["price"]
    if lo <= price <= hi:
        score += 20
        pros.append(f"Within budget at {price:,} EGP")
    elif price < lo:
        score += 14
        pros.append(f"Under budget at {price:,} EGP")
    else:
        over_pct = (price - hi) / hi * 100
        if over_pct < 15:
            score += 7
            cons.append(f"Slightly over budget ({price:,} EGP)")
        else:
            cons.append(f"Over budget at {price:,} EGP")

    # Priority — scaled 0–15 from the relevant score
    if priority == "high_performance":
        pts = round(laptop["performance_score"] / 100 * 15)
        score += pts
        if laptop["performance_score"] >= 85:
            pros.append("High performance")
        elif laptop["performance_score"] < 60:
            cons.append("Limited performance")
    elif priority == "battery_life":
        pts = round(laptop["battery_score"] / 100 * 15)
        score += pts
        if laptop["battery_score"] >= 80:
            pros.append("Excellent battery life")
        elif laptop["battery_score"] < 55:
            cons.append("Poor battery life")
    elif priority == "portability":
        pts = round(laptop["portability_score"] / 100 * 15)
        score += pts
        if laptop["portability_score"] >= 85:
            pros.append("Very portable & lightweight")
        elif laptop["portability_score"] < 55:
            cons.append("Heavy / bulky")
    else:
        balanced = (laptop["performance_score"] + laptop["battery_score"] + laptop["portability_score"]) / 3
        pts = round(balanced / 100 * 15)
        score += pts
        if balanced >= 75:
            pros.append("Well-balanced laptop")

    # Screen size — 0 / 3 / 7 / 10
    try:
        sp = float(screen_pref)
    except Exception:
        sp = 15.6
    diff = abs(laptop["screen_size"] - sp)
    if diff == 0:
        score += 10
        pros.append(f"{laptop['screen_size']}\" — perfect screen match")
    elif diff <= 0.5:
        score += 7
    elif diff <= 1.5:
        score += 3
    else:
        cons.append(f"Screen size {laptop['screen_size']}\" differs from preference")

    # GPU — 0 / 10
    if gpu_matches(laptop["gpu"], gpu_pref):
        score += 10
    else:
        cons.append("GPU doesn't match preference")

    # CPU brand — 0 / 2 / 5
    cpu = laptop["cpu"].lower()
    if cpu_brand == "no_preference":
        score += 2
    elif cpu_brand == "intel" and "intel" in cpu:
        score += 5
        pros.append("Intel CPU")
    elif cpu_brand == "amd" and "amd" in cpu:
        score += 5
        pros.append("AMD CPU")
    elif cpu_brand == "apple" and "apple" in cpu:
        score += 5
        pros.append("Apple Silicon")
    else:
        cons.append("CPU brand doesn't match preference")

    # Battery — 0 / 2 / 5
    batt_hours = laptop["battery_hours"]
    if battery_pref == "long" and batt_hours >= 12:
        score += 5
        pros.append(f"{batt_hours}h battery life")
    elif battery_pref == "medium" and 7 <= batt_hours < 12:
        score += 5
    elif battery_pref == "short" and batt_hours < 7:
        score += 5
    elif battery_pref == "long" and batt_hours < 8:
        score += 1
        cons.append(f"Only {batt_hours}h battery")
    else:
        score += 2

    # Weight — 0 / 2 / 5
    wt = laptop["weight_kg"]
    if weight_pref == "lightweight" and wt <= 1.5:
        score += 5
        pros.append(f"Lightweight at {wt}kg")
    elif weight_pref == "normal" and 1.5 < wt <= 2.5:
        score += 5
    elif weight_pref == "heavy_powerful" and wt > 2.5:
        score += 5
    elif weight_pref == "lightweight" and wt > 2.0:
        score += 1
        cons.append(f"Heavy at {wt}kg")
    else:
        score += 2

    # Features — 0–5
    feature_map = {
        "rgb":            ("has_rgb",            "RGB keyboard"),
        "touchscreen":    ("has_touchscreen",     "Touchscreen"),
        "oled":           ("has_oled",            "OLED display"),
        "upgradeable_ram":("upgradeable_ram",     "Upgradeable RAM"),
        "wifi6":          ("wifi6",               "Wi-Fi 6"),
        "thunderbolt":    ("thunderbolt",         "Thunderbolt port"),
    }
    matched_features = 0
    for feat in features:
        col, label = feature_map.get(feat, (None, None))
        if col and laptop.get(col):
            matched_features += 1
            pros.append(label)
    if features:
        score += min(5, round(matched_features / len(features) * 5))
    else:
        score += 3

    match_score = max(0, min(100, score))
    reason = _build_reason(laptop, usage, priority, tags)

    return {
        "match_score": match_score,
        "pros": list(dict.fromkeys(pros))[:5],
        "cons": list(dict.fromkeys(cons))[:3],
        "reason": reason,
    }


def _build_reason(laptop, usage, priority, tags):
    name = f"{laptop['brand']} {laptop['model']}"
    use_label = usage.replace("_", " ").title()

    if usage in tags:
        base = f"The {name} is purpose-built for {use_label} workloads"
    else:
        base = f"The {name} is a capable all-rounder"

    if priority == "high_performance":
        detail = f" with a performance score of {laptop['performance_score']}/100."
    elif priority == "battery_life":
        detail = f" offering up to {laptop['battery_hours']} hours of battery life."
    elif priority == "portability":
        detail = f" weighing just {laptop['weight_kg']}kg — ideal for on-the-go use."
    else:
        detail = " balancing performance, battery, and portability."

    return base + detail


def recommend(laptops: list, answers: dict) -> list:
    scored = []
    for lap in laptops:
        lap_dict = dict(lap)
        result = score_laptop(lap_dict, answers)
        scored.append({**lap_dict, **result})

    scored.sort(key=lambda x: x["match_score"], reverse=True)
    return scored[:5]
