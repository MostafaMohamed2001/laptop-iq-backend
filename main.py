from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import json

from database import get_db, init_db
from recommender import recommend

app = FastAPI(title="Laptop Selector API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()


def row_to_dict(row):
    d = dict(row)
    d["usage_tags"] = json.loads(d["usage_tags"])
    return d


@app.get("/laptops")
def list_laptops(
    brand: Optional[str] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    min_ram: Optional[int] = None,
    usage: Optional[str] = None,
):
    conn = get_db()
    cur = conn.cursor()
    query = "SELECT * FROM laptops WHERE 1=1"
    params = []

    if brand:
        query += " AND brand = ?"
        params.append(brand)
    if min_price is not None:
        query += " AND price >= ?"
        params.append(min_price)
    if max_price is not None:
        query += " AND price <= ?"
        params.append(max_price)
    if min_ram is not None:
        query += " AND ram >= ?"
        params.append(min_ram)
    if usage:
        query += " AND usage_tags LIKE ?"
        params.append(f'%"{usage}"%')

    cur.execute(query, params)
    rows = cur.fetchall()
    conn.close()
    return [row_to_dict(r) for r in rows]


@app.get("/laptops/{laptop_id}")
def get_laptop(laptop_id: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM laptops WHERE id = ?", (laptop_id,))
    row = cur.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Laptop not found")
    return row_to_dict(row)


class RecommendRequest(BaseModel):
    usage: str = "general"
    budget: str = "40k_60k"
    priority: str = "balanced"
    screen_size: float = 15.6
    gpu_preference: str = "no_preference"
    cpu_brand: str = "no_preference"
    battery: str = "medium"
    weight: str = "normal"
    features: List[str] = []


@app.post("/recommend")
def get_recommendations(req: RecommendRequest):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM laptops")
    rows = cur.fetchall()
    conn.close()
    results = recommend(rows, req.dict())
    return results
