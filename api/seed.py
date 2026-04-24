"""
Seed script — populates Neon PostgreSQL with initial data.
Usage:
  DATABASE_URL=<neon_url> python -m api.seed
"""
import asyncio
import os
import asyncpg
from api.models import CREATE_TABLES_SQL

DATABASE_URL = os.environ.get("DATABASE_URL")

SPORTS = [
    ("nfl", "Football", "NFL"),
    ("mlb", "Baseball", "MLB"),
    ("nba", "Basketball", "NBA"),
    ("nhl", "Hockey", "NHL"),
]

PRODUCTS = [
    ("topps-chrome-nfl-2025", "Topps Chrome NFL 2025", "nfl", 2025, "Topps", 25.00, 150.00, 12),
    ("topps-chrome-mlb-2025", "Topps Chrome MLB 2025", "mlb", 2025, "Topps", 20.00, 120.00, 12),
    ("panini-prizm-nba-2025", "Panini Prizm NBA 2024-25", "nba", 2025, "Panini", 30.00, 180.00, 12),
]

TEAMS = [
    ("bears", "Chicago Bears", "CHI", "nfl", "Chicago"),
    ("chiefs", "Kansas City Chiefs", "KC", "nfl", "Kansas City"),
    ("vikings", "Minnesota Vikings", "MIN", "nfl", "Minneapolis"),
    ("texans", "Houston Texans", "HOU", "nfl", "Houston"),
    ("ravens", "Baltimore Ravens", "BAL", "nfl", "Baltimore"),
    ("eagles", "Philadelphia Eagles", "PHI", "nfl", "Philadelphia"),
    ("bengals", "Cincinnati Bengals", "CIN", "nfl", "Cincinnati"),
    ("bills", "Buffalo Bills", "BUF", "nfl", "Buffalo"),
    ("49ers", "San Francisco 49ers", "SF", "nfl", "San Francisco"),
    ("chargers", "Los Angeles Chargers", "LAC", "nfl", "Los Angeles"),
    ("lions", "Detroit Lions", "DET", "nfl", "Detroit"),
    ("cowboys", "Dallas Cowboys", "DAL", "nfl", "Dallas"),
    ("rams", "Los Angeles Rams", "LAR", "nfl", "Los Angeles"),
    ("dolphins", "Miami Dolphins", "MIA", "nfl", "Miami"),
    ("packers", "Green Bay Packers", "GB", "nfl", "Green Bay"),
    ("giants", "New York Giants", "NYG", "nfl", "New York"),
]

CARD_TYPES = [
    ("patch-auto", "Patch Auto", "Legendary", "1:480", 480, "/10", 500.00),
    ("auto-parallel", "Auto Parallel", "Ultra Rare", "1:120", 120, "/50", 200.00),
    ("auto", "Auto", "Rare", "1:24", 24, "∞", 100.00),
    ("numbered-parallel", "Numbered Parallel", "Ultra Rare", "1:120", 120, "/25", 80.00),
    ("parallel", "Parallel", "Rare", "1:24", 24, "/199", 20.00),
    ("refractor", "Refractor", "Uncommon", "1:4", 4, "∞", 8.00),
    ("insert", "Insert", "Uncommon", "1:8", 8, "∞", 5.00),
    ("base", "Base", "Common", "1:1", 1, "∞", 2.00),
]

PLAYERS = [
    ("caleb-williams", "Caleb Williams", "bears", "QB", True, True, "topps-chrome-nfl-2025", 10.0),
    ("cj-stroud", "CJ Stroud", "texans", "QB", True, False, "topps-chrome-nfl-2025", 7.0),
    ("patrick-mahomes", "Patrick Mahomes", "chiefs", "QB", True, False, "topps-chrome-nfl-2025", 6.5),
    ("lamar-jackson", "Lamar Jackson", "ravens", "QB", True, False, "topps-chrome-nfl-2025", 6.0),
    ("josh-allen", "Josh Allen", "bills", "QB", True, False, "topps-chrome-nfl-2025", 5.8),
    ("justin-jefferson", "Justin Jefferson", "vikings", "WR", True, False, "topps-chrome-nfl-2025", 5.5),
    ("joe-burrow", "Joe Burrow", "bengals", "QB", True, False, "topps-chrome-nfl-2025", 5.2),
    ("jalen-hurts", "Jalen Hurts", "eagles", "QB", True, False, "topps-chrome-nfl-2025", 5.0),
    ("brock-purdy", "Brock Purdy", "49ers", "QB", True, False, "topps-chrome-nfl-2025", 4.8),
    ("jj-mccarthy", "JJ McCarthy", "vikings", "QB", False, True, "topps-chrome-nfl-2025", 4.5),
    ("justin-herbert", "Justin Herbert", "chargers", "QB", True, False, "topps-chrome-nfl-2025", 4.2),
    ("ceedee-lamb", "CeeDee Lamb", "cowboys", "WR", True, False, "topps-chrome-nfl-2025", 4.0),
    ("tyreek-hill", "Tyreek Hill", "dolphins", "WR", True, False, "topps-chrome-nfl-2025", 3.8),
    ("puka-nacua", "Puka Nacua", "rams", "WR", False, True, "topps-chrome-nfl-2025", 3.5),
    ("rome-odunze", "Rome Odunze", "bears", "WR", False, True, "topps-chrome-nfl-2025", 3.8),
    ("jayden-daniels", "Jayden Daniels", "giants", "QB", False, True, "topps-chrome-nfl-2025", 3.5),
    ("marvin-harrison-jr", "Marvin Harrison Jr.", "chiefs", "WR", False, True, "topps-chrome-nfl-2025", 4.0),
    ("malik-nabers", "Malik Nabers", "giants", "WR", False, True, "topps-chrome-nfl-2025", 3.5),
    ("travis-kelce", "Travis Kelce", "chiefs", "TE", True, False, "topps-chrome-nfl-2025", 4.0),
    ("amon-ra-st-brown", "Amon-Ra St. Brown", "lions", "WR", True, False, "topps-chrome-nfl-2025", 3.0),
    ("jared-goff", "Jared Goff", "lions", "QB", True, False, "topps-chrome-nfl-2025", 2.8),
]

MARKET_SALES_SEED = [
    ("s1", "caleb-williams", "patch-auto", "2025-04-21", 2800.00, "topps-chrome-nfl-2025"),
    ("s2", "lamar-jackson", "auto", "2025-04-18", 1100.00, "topps-chrome-nfl-2025"),
    ("s3", "cj-stroud", "patch-auto", "2025-04-15", 750.00, "topps-chrome-nfl-2025"),
    ("s4", "patrick-mahomes", "auto", "2025-04-10", 520.00, "topps-chrome-nfl-2025"),
    ("s5", "josh-allen", "auto-parallel", "2025-04-05", 480.00, "topps-chrome-nfl-2025"),
    ("s6", "caleb-williams", "auto", "2025-04-02", 630.00, "topps-chrome-nfl-2025"),
    ("s7", "joe-burrow", "patch-auto", "2025-03-30", 810.00, "topps-chrome-nfl-2025"),
    ("s8", "ceedee-lamb", "refractor", "2025-03-25", 145.00, "topps-chrome-nfl-2025"),
    ("s9", "tyreek-hill", "insert", "2025-03-22", 175.00, "topps-chrome-nfl-2025"),
    ("s10", "cj-stroud", "auto", "2025-03-20", 600.00, "topps-chrome-nfl-2025"),
]


async def seed():
    if not DATABASE_URL:
        print("ERROR: DATABASE_URL not set")
        return

    print("Connecting to Neon PostgreSQL...")
    conn = await asyncpg.connect(DATABASE_URL)

    try:
        print("Creating tables...")
        await conn.execute(CREATE_TABLES_SQL)

        print("Seeding sports...")
        for s in SPORTS:
            await conn.execute(
                "INSERT INTO sports(id, name, abbreviation) VALUES($1,$2,$3) ON CONFLICT(id) DO NOTHING",
                *s
            )

        print("Seeding products...")
        for p in PRODUCTS:
            await conn.execute(
                "INSERT INTO products(id, name, sport_id, year, manufacturer, pack_price, box_price, packs_per_box) VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT(id) DO NOTHING",
                *p
            )

        print("Seeding teams...")
        for t in TEAMS:
            await conn.execute(
                "INSERT INTO teams(id, name, abbreviation, sport_id, city) VALUES($1,$2,$3,$4,$5) ON CONFLICT(id) DO NOTHING",
                *t
            )

        print("Seeding card types...")
        for ct in CARD_TYPES:
            await conn.execute(
                "INSERT INTO card_types(id, name, rarity, odds, odds_number, print_run, base_value) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(id) DO NOTHING",
                *ct
            )

        print("Seeding players & cards...")
        import random
        for player_data in PLAYERS:
            pid, name, team_id, position, is_star, is_rookie, product_id, multiplier = player_data
            await conn.execute(
                "INSERT INTO players(id, name, team_id, position, is_star, is_rookie, product_id) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(id) DO NOTHING",
                pid, name, team_id, position, is_star, is_rookie, product_id
            )
            # Generate cards
            for ct in CARD_TYPES:
                ct_id = ct[0]
                if ct_id in ("patch-auto", "auto-parallel", "numbered-parallel") and not is_star and not is_rookie:
                    continue
                base_val = float(ct[6])
                est_value = round(base_val * multiplier * (0.9 + random.random() * 0.2), 2)
                card_id = f"{pid}-{ct_id}"
                await conn.execute(
                    "INSERT INTO cards(id, player_id, card_type_id, estimated_value, product_id) VALUES($1,$2,$3,$4,$5) ON CONFLICT(id) DO NOTHING",
                    card_id, pid, ct_id, est_value, product_id
                )

        print("Seeding market sales...")
        for sale in MARKET_SALES_SEED:
            await conn.execute(
                "INSERT INTO market_sales(id, player_id, card_type_id, sale_date, sale_price, product_id) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(id) DO NOTHING",
                *sale
            )

        print("✅ Seed complete!")

    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(seed())
