const BUDGET_RANGES = {
  under_20k: [0, 20000],
  "20k_30k": [20000, 30000],
  "30k_40k": [30000, 40000],
  "40k_60k": [40000, 60000],
  "60k_80k": [60000, 80000],
  "80k_plus": [80000, 9999999],
};

const GPU_TIERS = {
  integrated:    ["Intel Iris Xe", "Intel UHD", "AMD Radeon", "Apple M"],
  rtx_3050:      ["RTX 3050"],
  rtx_4050:      ["RTX 4050"],
  rtx_4060:      ["RTX 4060"],
  rtx_4070_plus: ["RTX 4070", "RTX 4080", "RTX 4090", "RTX 3080", "RTX 3070", "RTX 3080 Ti", "RTX 3070 Ti"],
  no_preference: [],
};

function gpuMatches(laptopGpu, pref) {
  if (pref === "no_preference") return true;
  const tiers = GPU_TIERS[pref] || [];
  return tiers.some((t) => laptopGpu.toLowerCase().includes(t.toLowerCase()));
}

function scoreLaptop(laptop, answers) {
  // Max points per section sum to 100:
  // Usage=25, Budget=20, Priority=15, Screen=10, GPU=10, CPU=5, Battery=5, Weight=5, Features=5
  let score = 0;
  const pros = [];
  const cons = [];

  const usage       = answers.usage        || "general";
  const budgetKey   = answers.budget       || "40k_60k";
  const priority    = answers.priority     || "balanced";
  const screenPref  = parseFloat(answers.screen_size) || 15.6;
  const gpuPref     = answers.gpu_preference || "no_preference";
  const cpuBrand    = answers.cpu_brand    || "no_preference";
  const batteryPref = answers.battery      || "medium";
  const weightPref  = answers.weight       || "normal";
  const features    = answers.features     || [];

  const tags = JSON.parse(laptop.usage_tags);

  // Usage match — 0 / 12 / 25
  const usageMap = {
    gaming: "gaming", programming: "programming",
    video_editing: "video_editing", graphic_design: "graphic_design",
    ai_ml: "ai_ml", office: "office", student: "student", general: null,
  };
  const targetTag = usageMap[usage] !== undefined ? usageMap[usage] : null;
  if (targetTag === null) {
    score += 12;
    pros.push("Versatile all-rounder");
  } else if (tags.includes(targetTag)) {
    score += 25;
    pros.push(`Great for ${usage.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`);
  } else {
    score += 2;
    cons.push(`Not optimized for ${usage.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`);
  }

  // Budget — 0 / 10 / 14 / 20
  const [lo, hi] = BUDGET_RANGES[budgetKey] || [0, 9999999];
  const price = laptop.price;
  if (price >= lo && price <= hi) {
    score += 20;
    pros.push(`Within budget at ${price.toLocaleString()} EGP`);
  } else if (price < lo) {
    score += 14;
    pros.push(`Under budget at ${price.toLocaleString()} EGP`);
  } else {
    const overPct = ((price - hi) / hi) * 100;
    if (overPct < 15) {
      score += 7;
      cons.push(`Slightly over budget (${price.toLocaleString()} EGP)`);
    } else {
      cons.push(`Over budget at ${price.toLocaleString()} EGP`);
    }
  }

  // Priority — scaled 0–15 from the relevant score
  if (priority === "high_performance") {
    const pts = Math.round((laptop.performance_score / 100) * 15);
    score += pts;
    if (laptop.performance_score >= 85) pros.push("High performance");
    else if (laptop.performance_score < 60) cons.push("Limited performance");
  } else if (priority === "battery_life") {
    const pts = Math.round((laptop.battery_score / 100) * 15);
    score += pts;
    if (laptop.battery_score >= 80) pros.push("Excellent battery life");
    else if (laptop.battery_score < 55) cons.push("Poor battery life");
  } else if (priority === "portability") {
    const pts = Math.round((laptop.portability_score / 100) * 15);
    score += pts;
    if (laptop.portability_score >= 85) pros.push("Very portable & lightweight");
    else if (laptop.portability_score < 55) cons.push("Heavy / bulky");
  } else {
    const balanced = (laptop.performance_score + laptop.battery_score + laptop.portability_score) / 3;
    score += Math.round((balanced / 100) * 15);
    if (balanced >= 75) pros.push("Well-balanced laptop");
  }

  // Screen size — 0 / 3 / 7 / 10
  const diff = Math.abs(laptop.screen_size - screenPref);
  if (diff === 0) {
    score += 10;
    pros.push(`${laptop.screen_size}" — perfect screen match`);
  } else if (diff <= 0.5) {
    score += 7;
  } else if (diff <= 1.5) {
    score += 3;
  } else {
    cons.push(`Screen size ${laptop.screen_size}" differs from preference`);
  }

  // GPU — 0 / 10
  if (gpuMatches(laptop.gpu, gpuPref)) {
    score += 10;
  } else {
    cons.push("GPU doesn't match preference");
  }

  // CPU brand — 0 / 2 / 5
  const cpu = laptop.cpu.toLowerCase();
  if (cpuBrand === "no_preference") {
    score += 2;
  } else if (cpuBrand === "intel" && cpu.includes("intel")) {
    score += 5;
    pros.push("Intel CPU");
  } else if (cpuBrand === "amd" && cpu.includes("amd")) {
    score += 5;
    pros.push("AMD CPU");
  } else if (cpuBrand === "apple" && cpu.includes("apple")) {
    score += 5;
    pros.push("Apple Silicon");
  } else {
    cons.push("CPU brand doesn't match preference");
  }

  // Battery — 0 / 2 / 5
  const battHours = laptop.battery_hours;
  if (batteryPref === "long" && battHours >= 12) {
    score += 5;
    pros.push(`${battHours}h battery life`);
  } else if (batteryPref === "medium" && battHours >= 7 && battHours < 12) {
    score += 5;
  } else if (batteryPref === "short" && battHours < 7) {
    score += 5;
  } else if (batteryPref === "long" && battHours < 8) {
    score += 1;
    cons.push(`Only ${battHours}h battery`);
  } else {
    score += 2;
  }

  // Weight — 0 / 2 / 5
  const wt = laptop.weight_kg;
  if (weightPref === "lightweight" && wt <= 1.5) {
    score += 5;
    pros.push(`Lightweight at ${wt}kg`);
  } else if (weightPref === "normal" && wt > 1.5 && wt <= 2.5) {
    score += 5;
  } else if (weightPref === "heavy_powerful" && wt > 2.5) {
    score += 5;
  } else if (weightPref === "lightweight" && wt > 2.0) {
    score += 1;
    cons.push(`Heavy at ${wt}kg`);
  } else {
    score += 2;
  }

  // Features — 0–5
  const featureMap = {
    rgb:              ["has_rgb",            "RGB keyboard"],
    touchscreen:      ["has_touchscreen",    "Touchscreen"],
    oled:             ["has_oled",           "OLED display"],
    upgradeable_ram:  ["upgradeable_ram",    "Upgradeable RAM"],
    wifi6:            ["wifi6",              "Wi-Fi 6"],
    thunderbolt:      ["thunderbolt",        "Thunderbolt port"],
  };
  let matchedFeatures = 0;
  for (const feat of features) {
    const mapping = featureMap[feat];
    if (mapping) {
      const [col, label] = mapping;
      if (laptop[col]) {
        matchedFeatures++;
        pros.push(label);
      }
    }
  }
  if (features.length > 0) {
    score += Math.min(5, Math.round((matchedFeatures / features.length) * 5));
  } else {
    score += 3;
  }

  const matchScore = Math.max(0, Math.min(100, score));
  const reason = buildReason(laptop, usage, priority, tags);

  return {
    match_score: matchScore,
    pros: [...new Set(pros)].slice(0, 5),
    cons: [...new Set(cons)].slice(0, 3),
    reason,
  };
}

function buildReason(laptop, usage, priority, tags) {
  const name = `${laptop.brand} ${laptop.model}`;
  const useLabel = usage.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const base = tags.includes(usage)
    ? `The ${name} is purpose-built for ${useLabel} workloads`
    : `The ${name} is a capable all-rounder`;

  let detail;
  if (priority === "high_performance") {
    detail = ` with a performance score of ${laptop.performance_score}/100.`;
  } else if (priority === "battery_life") {
    detail = ` offering up to ${laptop.battery_hours} hours of battery life.`;
  } else if (priority === "portability") {
    detail = ` weighing just ${laptop.weight_kg}kg — ideal for on-the-go use.`;
  } else {
    detail = " balancing performance, battery, and portability.";
  }

  return base + detail;
}

function recommend(laptops, answers) {
  const scored = laptops.map((lap) => {
    const result = scoreLaptop(lap, answers);
    return { ...lap, usage_tags: JSON.parse(lap.usage_tags), ...result };
  });

  scored.sort((a, b) => b.match_score - a.match_score);
  return scored.slice(0, 5);
}

module.exports = { recommend };
