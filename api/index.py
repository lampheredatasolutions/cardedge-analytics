"""
CardEdge Analytics - FastAPI Backend
Deployable as Vercel serverless functions
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import os

app = FastAPI(
    title="CardEdge Analytics API",
    version="0.1.0",
    description="Sports card analytics backend",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# In-memory data store (seed data - replace with DB queries when Neon is live)
# ---------------------------------------------------------------------------

SPORTS = [
    {"id": "nfl", "name": "Football", "abbreviation": "NFL"},
    {"id": "mlb", "name": "Baseball", "abbreviation": "MLB"},
    {"id": "nba", "name": "Basketball", "abbreviation": "NBA"},
    {"id": "nhl", "name": "Hockey", "abbreviation": "NHL"},
]

PRODUCTS = [
    {"id": "topps-chrome-nfl-2025", "name": "Topps Chrome NFL 2025", "sport": "nfl", "year": 2025, "manufacturer": "Topps", "packPrice": 25, "boxPrice": 150, "packsPerBox": 12},
    {"id": "topps-chrome-mlb-2025", "name": "Topps Chrome MLB 2025", "sport": "mlb", "year": 2025, "manufacturer": "Topps", "packPrice": 20, "boxPrice": 120, "packsPerBox": 12},
    {"id": "panini-prizm-nba-2025", "name": "Panini Prizm NBA 2024-25", "sport": "nba", "year": 2025, "manufacturer": "Panini", "packPrice": 30, "boxPrice": 180, "packsPerBox": 12},
]

CARD_TYPES = [
    {"id": "patch-auto", "name": "Patch Auto", "rarity": "Legendary", "odds": "1:480", "oddsNumber": 480, "printRun": "/10", "baseValue": 500},
    {"id": "auto-parallel", "name": "Auto Parallel", "rarity": "Ultra Rare", "odds": "1:120", "oddsNumber": 120, "printRun": "/50", "baseValue": 200},
    {"id": "auto", "name": "Auto", "rarity": "Rare", "odds": "1:24", "oddsNumber": 24, "printRun": "∞", "baseValue": 100},
    {"id": "numbered-parallel", "name": "Numbered Parallel", "rarity": "Ultra Rare", "odds": "1:120", "oddsNumber": 120, "printRun": "/25", "baseValue": 80},
    {"id": "parallel", "name": "Parallel", "rarity": "Rare", "odds": "1:24", "oddsNumber": 24, "printRun": "/199", "baseValue": 20},
    {"id": "refractor", "name": "Refractor", "rarity": "Uncommon", "odds": "1:4", "oddsNumber": 4, "printRun": "∞", "baseValue": 8},
    {"id": "insert", "name": "Insert", "rarity": "Uncommon", "odds": "1:8", "oddsNumber": 8, "printRun": "∞", "baseValue": 5},
    {"id": "base", "name": "Base", "rarity": "Common", "odds": "1:1", "oddsNumber": 1, "printRun": "∞", "baseValue": 2},
]


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "0.1.0"}


# ---------------------------------------------------------------------------
# Sports & Products
# ---------------------------------------------------------------------------

@app.get("/api/sports")
async def get_sports():
    return SPORTS


@app.get("/api/products")
async def get_products(sport: Optional[str] = Query(None), year: Optional[int] = Query(None)):
    results = PRODUCTS
    if sport:
        results = [p for p in results if p["sport"] == sport]
    if year:
        results = [p for p in results if p["year"] == year]
    return results


@app.get("/api/products/{product_id}")
async def get_product(product_id: str):
    product = next((p for p in PRODUCTS if p["id"] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# ---------------------------------------------------------------------------
# Card Types
# ---------------------------------------------------------------------------

@app.get("/api/card-types")
async def get_card_types():
    return CARD_TYPES


# ---------------------------------------------------------------------------
# Teams (returns from DB when available, falls back to seed data)
# ---------------------------------------------------------------------------

@app.get("/api/teams")
async def get_teams(sport: str = Query("nfl"), product_id: Optional[str] = Query(None)):
    """Return team analytics for a given sport/product."""
    try:
        from api.database import get_team_analytics
        data = await get_team_analytics(product_id or "topps-chrome-nfl-2025")
        return data
    except Exception:
        # Fallback seed data
        return _seed_team_analytics()


# ---------------------------------------------------------------------------
# Players
# ---------------------------------------------------------------------------

@app.get("/api/players")
async def get_players(
    product_id: str = Query("topps-chrome-nfl-2025"),
    team_id: Optional[str] = Query(None),
    sort_by: str = Query("totalEV"),
):
    try:
        from api.database import get_player_analytics
        data = await get_player_analytics(product_id, team_id)
        return data
    except Exception:
        return _seed_player_analytics(team_id)


@app.get("/api/players/{player_id}/cards")
async def get_player_cards(player_id: str, product_id: str = Query("topps-chrome-nfl-2025")):
    try:
        from api.database import get_cards_for_player
        data = await get_cards_for_player(player_id, product_id)
        return data
    except Exception:
        return []


# ---------------------------------------------------------------------------
# Market
# ---------------------------------------------------------------------------

@app.get("/api/market/sales")
async def get_market_sales(
    product_id: str = Query("topps-chrome-nfl-2025"),
    card_type: Optional[str] = Query(None),
    limit: int = Query(50),
):
    try:
        from api.database import get_market_sales
        data = await get_market_sales(product_id, card_type, limit)
        return data
    except Exception:
        return _seed_market_sales()


@app.get("/api/market/trends")
async def get_market_trends(product_id: str = Query("topps-chrome-nfl-2025")):
    return _seed_market_trends()


# ---------------------------------------------------------------------------
# Simulation
# ---------------------------------------------------------------------------

@app.post("/api/simulate")
async def simulate_break(body: dict):
    """Run a pack break simulation."""
    import random

    pack_count = int(body.get("packCount", 12))
    product_id = body.get("productId", "topps-chrome-nfl-2025")
    pack_count = max(1, min(pack_count, 240))

    seed_players = _get_seed_players()
    player_multipliers = {p["id"]: p.get("multiplier", 2.0) for p in seed_players}

    pulls = []
    for _ in range(pack_count):
        for _ in range(10):  # ~10 cards per pack
            pull = _simulate_single_pull(seed_players, CARD_TYPES)
            pulls.append(pull)

    total_value = sum(p["value"] for p in pulls)
    product = next((p for p in PRODUCTS if p["id"] == product_id), PRODUCTS[0])
    total_spent = pack_count * product["packPrice"]
    hits = [p for p in pulls if p.get("isHit")]
    roi = ((total_value - total_spent) / total_spent * 100) if total_spent > 0 else 0
    best_pull = max(pulls, key=lambda p: p["value"]) if pulls else None

    return {
        "packCount": pack_count,
        "totalValue": round(total_value, 2),
        "totalSpent": total_spent,
        "roi": round(roi, 2),
        "hitsCount": len(hits),
        "hits": hits,
        "bestPull": best_pull,
        "notablePulls": sorted(pulls, key=lambda p: -p["value"])[:20],
    }


# ---------------------------------------------------------------------------
# Dashboard stats
# ---------------------------------------------------------------------------

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(product_id: str = Query("topps-chrome-nfl-2025")):
    return {
        "totalChecklistValue": 39048,
        "cardsTracked": 142,
        "starPlayers": 19,
        "teamsCovered": 16,
        "productName": "Topps Chrome NFL 2025",
    }


# ---------------------------------------------------------------------------
# Seed data helpers (used when DB not available)
# ---------------------------------------------------------------------------

def _get_seed_players():
    return [
        {"id": "caleb-williams", "name": "Caleb Williams", "teamId": "bears", "teamName": "Chicago Bears", "isStar": True, "isRookie": True, "multiplier": 10.0},
        {"id": "cj-stroud", "name": "CJ Stroud", "teamId": "texans", "teamName": "Houston Texans", "isStar": True, "isRookie": False, "multiplier": 7.0},
        {"id": "patrick-mahomes", "name": "Patrick Mahomes", "teamId": "chiefs", "teamName": "Kansas City Chiefs", "isStar": True, "isRookie": False, "multiplier": 6.5},
        {"id": "lamar-jackson", "name": "Lamar Jackson", "teamId": "ravens", "teamName": "Baltimore Ravens", "isStar": True, "isRookie": False, "multiplier": 6.0},
        {"id": "josh-allen", "name": "Josh Allen", "teamId": "bills", "teamName": "Buffalo Bills", "isStar": True, "isRookie": False, "multiplier": 5.8},
        {"id": "justin-jefferson", "name": "Justin Jefferson", "teamId": "vikings", "teamName": "Minnesota Vikings", "isStar": True, "isRookie": False, "multiplier": 5.5},
        {"id": "joe-burrow", "name": "Joe Burrow", "teamId": "bengals", "teamName": "Cincinnati Bengals", "isStar": True, "isRookie": False, "multiplier": 5.2},
        {"id": "jalen-hurts", "name": "Jalen Hurts", "teamId": "eagles", "teamName": "Philadelphia Eagles", "isStar": True, "isRookie": False, "multiplier": 5.0},
        {"id": "brock-purdy", "name": "Brock Purdy", "teamId": "49ers", "teamName": "San Francisco 49ers", "isStar": True, "isRookie": False, "multiplier": 4.8},
        {"id": "jj-mccarthy", "name": "JJ McCarthy", "teamId": "vikings", "teamName": "Minnesota Vikings", "isStar": False, "isRookie": True, "multiplier": 4.5},
    ]


def _simulate_single_pull(players, card_types):
    import random
    rand = random.random() * 100
    if rand < 0.21: ct = card_types[0]
    elif rand < 1.04: ct = card_types[1]
    elif rand < 5.21: ct = card_types[2]
    elif rand < 6.04: ct = card_types[3]
    elif rand < 10.21: ct = card_types[4]
    elif rand < 35.21: ct = card_types[5]
    elif rand < 47.71: ct = card_types[6]
    else: ct = card_types[7]

    player = random.choice(players)
    multiplier = player.get("multiplier", 2.0)
    value = round(ct["baseValue"] * multiplier * (0.8 + random.random() * 0.4), 2)
    is_hit = ct["id"] in ("auto", "auto-parallel", "patch-auto")
    return {
        "playerName": player["name"],
        "teamName": player["teamName"],
        "cardTypeName": ct["name"],
        "rarity": ct["rarity"],
        "value": value,
        "isHit": is_hit,
    }


def _seed_team_analytics():
    return [
        {"teamId": "bears", "teamName": "Chicago Bears", "totalEV": 4277, "cardCount": 12, "starCount": 8, "rookieCount": 12, "autoCount": 4, "hitEV": 3920, "sleeperScore": 775},
        {"teamId": "chiefs", "teamName": "Kansas City Chiefs", "totalEV": 3680, "cardCount": 10, "starCount": 7, "rookieCount": 3, "autoCount": 4, "hitEV": 3200, "sleeperScore": 620},
        {"teamId": "vikings", "teamName": "Minnesota Vikings", "totalEV": 3224, "cardCount": 9, "starCount": 4, "rookieCount": 5, "autoCount": 5, "hitEV": 3200, "sleeperScore": 906},
        {"teamId": "texans", "teamName": "Houston Texans", "totalEV": 2950, "cardCount": 8, "starCount": 5, "rookieCount": 2, "autoCount": 3, "hitEV": 2800, "sleeperScore": 510},
        {"teamId": "ravens", "teamName": "Baltimore Ravens", "totalEV": 2700, "cardCount": 7, "starCount": 5, "rookieCount": 1, "autoCount": 3, "hitEV": 2500, "sleeperScore": 450},
        {"teamId": "eagles", "teamName": "Philadelphia Eagles", "totalEV": 2600, "cardCount": 8, "starCount": 5, "rookieCount": 2, "autoCount": 3, "hitEV": 2400, "sleeperScore": 480},
        {"teamId": "bengals", "teamName": "Cincinnati Bengals", "totalEV": 2500, "cardCount": 7, "starCount": 4, "rookieCount": 2, "autoCount": 3, "hitEV": 2300, "sleeperScore": 460},
        {"teamId": "bills", "teamName": "Buffalo Bills", "totalEV": 2387, "cardCount": 5, "starCount": 4, "rookieCount": 0, "autoCount": 3, "hitEV": 2290, "sleeperScore": 461},
        {"teamId": "49ers", "teamName": "San Francisco 49ers", "totalEV": 2100, "cardCount": 6, "starCount": 4, "rookieCount": 1, "autoCount": 3, "hitEV": 1900, "sleeperScore": 410},
        {"teamId": "chargers", "teamName": "Los Angeles Chargers", "totalEV": 1648, "cardCount": 8, "starCount": 4, "rookieCount": 4, "autoCount": 4, "hitEV": 1630, "sleeperScore": 492},
        {"teamId": "lions", "teamName": "Detroit Lions", "totalEV": 1400, "cardCount": 5, "starCount": 3, "rookieCount": 1, "autoCount": 2, "hitEV": 1300, "sleeperScore": 320},
        {"teamId": "cowboys", "teamName": "Dallas Cowboys", "totalEV": 1250, "cardCount": 5, "starCount": 3, "rookieCount": 1, "autoCount": 2, "hitEV": 1150, "sleeperScore": 290},
    ]


def _seed_player_analytics(team_id=None):
    players = [
        {"playerId": "caleb-williams", "playerName": "Caleb Williams", "teamId": "bears", "teamName": "Chicago Bears", "isStar": True, "isRookie": True, "topCardValue": 2500, "totalEV": 4123, "cardCount": 8},
        {"playerId": "cj-stroud", "playerName": "CJ Stroud", "teamId": "texans", "teamName": "Houston Texans", "isStar": True, "isRookie": False, "topCardValue": 1800, "totalEV": 2866.5, "cardCount": 5},
        {"playerId": "patrick-mahomes", "playerName": "Patrick Mahomes", "teamId": "chiefs", "teamName": "Kansas City Chiefs", "isStar": True, "isRookie": False, "topCardValue": 1500, "totalEV": 2687.5, "cardCount": 8},
        {"playerId": "lamar-jackson", "playerName": "Lamar Jackson", "teamId": "ravens", "teamName": "Baltimore Ravens", "isStar": True, "isRookie": False, "topCardValue": 1600, "totalEV": 2514.25, "cardCount": 5},
        {"playerId": "josh-allen", "playerName": "Josh Allen", "teamId": "bills", "teamName": "Buffalo Bills", "isStar": True, "isRookie": False, "topCardValue": 1400, "totalEV": 2263.25, "cardCount": 5},
        {"playerId": "justin-jefferson", "playerName": "Justin Jefferson", "teamId": "vikings", "teamName": "Minnesota Vikings", "isStar": True, "isRookie": False, "topCardValue": 1500, "totalEV": 1814.25, "cardCount": 4},
        {"playerId": "joe-burrow", "playerName": "Joe Burrow", "teamId": "bengals", "teamName": "Cincinnati Bengals", "isStar": True, "isRookie": False, "topCardValue": 1350, "totalEV": 1643, "cardCount": 4},
        {"playerId": "jalen-hurts", "playerName": "Jalen Hurts", "teamId": "eagles", "teamName": "Philadelphia Eagles", "isStar": True, "isRookie": False, "topCardValue": 1200, "totalEV": 1612, "cardCount": 5},
        {"playerId": "brock-purdy", "playerName": "Brock Purdy", "teamId": "49ers", "teamName": "San Francisco 49ers", "isStar": True, "isRookie": False, "topCardValue": 1300, "totalEV": 1592, "cardCount": 4},
        {"playerId": "jj-mccarthy", "playerName": "JJ McCarthy", "teamId": "vikings", "teamName": "Minnesota Vikings", "isStar": False, "isRookie": True, "topCardValue": 900, "totalEV": 1409.5, "cardCount": 5},
        {"playerId": "justin-herbert", "playerName": "Justin Herbert", "teamId": "chargers", "teamName": "Los Angeles Chargers", "isStar": True, "isRookie": False, "topCardValue": 1100, "totalEV": 1350.75, "cardCount": 4},
    ]
    if team_id:
        players = [p for p in players if p["teamId"] == team_id]
    return players


def _seed_market_sales():
    return [
        {"id": "s1", "date": "2025-04-21", "playerName": "Caleb Williams", "cardType": "Patch Auto", "rarity": "Legendary", "salePrice": 2800, "productId": "topps-chrome-nfl-2025"},
        {"id": "s2", "date": "2025-04-18", "playerName": "Lamar Jackson", "cardType": "Auto", "rarity": "Rare", "salePrice": 1100, "productId": "topps-chrome-nfl-2025"},
        {"id": "s3", "date": "2025-04-15", "playerName": "CJ Stroud", "cardType": "Patch Auto", "rarity": "Legendary", "salePrice": 750, "productId": "topps-chrome-nfl-2025"},
        {"id": "s4", "date": "2025-04-10", "playerName": "Patrick Mahomes", "cardType": "Auto", "rarity": "Rare", "salePrice": 520, "productId": "topps-chrome-nfl-2025"},
        {"id": "s5", "date": "2025-04-05", "playerName": "Josh Allen", "cardType": "Auto Parallel", "rarity": "Ultra Rare", "salePrice": 480, "productId": "topps-chrome-nfl-2025"},
    ]


def _seed_market_trends():
    return {
        "rising": [
            {"playerId": "caleb-williams", "playerName": "Caleb Williams", "teamName": "Chicago Bears", "avgSalePrice": 770.7, "salesCount": 5, "trend": "rising", "percentChange": 12.3},
            {"playerId": "cj-stroud", "playerName": "CJ Stroud", "teamName": "Houston Texans", "avgSalePrice": 675.69, "salesCount": 4, "trend": "rising", "percentChange": 8.1},
            {"playerId": "lamar-jackson", "playerName": "Lamar Jackson", "teamName": "Baltimore Ravens", "avgSalePrice": 1045, "salesCount": 2, "trend": "rising", "percentChange": 15.2},
        ],
        "declining": [
            {"playerId": "joe-burrow", "playerName": "Joe Burrow", "teamName": "Cincinnati Bengals", "avgSalePrice": 745, "salesCount": 2, "trend": "declining", "percentChange": -8.4},
            {"playerId": "ceedee-lamb", "playerName": "CeeDee Lamb", "teamName": "Dallas Cowboys", "avgSalePrice": 119.25, "salesCount": 2, "trend": "declining", "percentChange": -12.1},
        ],
    }
