"""
Neon PostgreSQL database connection and query helpers.
Set DATABASE_URL environment variable to your Neon connection string.

Example:
  DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
"""
import os
from typing import Optional
import asyncpg

DATABASE_URL = os.environ.get("DATABASE_URL")

_pool: Optional[asyncpg.Pool] = None


async def get_pool() -> asyncpg.Pool:
    global _pool
    if _pool is None:
        if not DATABASE_URL:
            raise RuntimeError("DATABASE_URL environment variable not set")
        _pool = await asyncpg.create_pool(DATABASE_URL, min_size=1, max_size=5)
    return _pool


async def get_team_analytics(product_id: str) -> list[dict]:
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT
                t.id AS "teamId",
                t.name AS "teamName",
                COALESCE(SUM(c.estimated_value), 0)::int AS "totalEV",
                COUNT(c.id)::int AS "cardCount",
                COUNT(CASE WHEN p.is_star THEN 1 END)::int AS "starCount",
                COUNT(CASE WHEN p.is_rookie THEN 1 END)::int AS "rookieCount",
                COUNT(CASE WHEN ct.id IN ('auto','auto-parallel','patch-auto') THEN 1 END)::int AS "autoCount",
                COALESCE(SUM(CASE WHEN ct.id IN ('auto','auto-parallel','patch-auto','numbered-parallel') THEN c.estimated_value ELSE 0 END), 0)::int AS "hitEV",
                0 AS "sleeperScore"
            FROM teams t
            LEFT JOIN players p ON p.team_id = t.id AND p.product_id = $1
            LEFT JOIN cards c ON c.player_id = p.id
            LEFT JOIN card_types ct ON ct.id = c.card_type_id
            GROUP BY t.id, t.name
            HAVING COUNT(c.id) > 0
            ORDER BY "totalEV" DESC
            """,
            product_id,
        )
        return [dict(row) for row in rows]


async def get_player_analytics(product_id: str, team_id: Optional[str] = None) -> list[dict]:
    pool = await get_pool()
    async with pool.acquire() as conn:
        query = """
            SELECT
                p.id AS "playerId",
                p.name AS "playerName",
                p.team_id AS "teamId",
                t.name AS "teamName",
                p.is_star AS "isStar",
                p.is_rookie AS "isRookie",
                MAX(c.estimated_value) AS "topCardValue",
                COALESCE(SUM(c.estimated_value), 0) AS "totalEV",
                COUNT(c.id)::int AS "cardCount"
            FROM players p
            JOIN teams t ON t.id = p.team_id
            LEFT JOIN cards c ON c.player_id = p.id
            WHERE p.product_id = $1
        """
        params = [product_id]
        if team_id:
            query += " AND p.team_id = $2"
            params.append(team_id)
        query += " GROUP BY p.id, p.name, p.team_id, t.name, p.is_star, p.is_rookie ORDER BY \"totalEV\" DESC"
        rows = await conn.fetch(query, *params)
        return [dict(row) for row in rows]


async def get_cards_for_player(player_id: str, product_id: str) -> list[dict]:
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT
                c.id,
                c.player_id AS "playerId",
                p.name AS "playerName",
                p.team_id AS "teamId",
                t.name AS "teamName",
                ct.id AS "cardTypeId",
                ct.name AS "cardTypeName",
                ct.rarity,
                ct.odds,
                ct.odds_number AS "oddsNumber",
                ct.print_run AS "printRun",
                c.estimated_value AS "estimatedValue"
            FROM cards c
            JOIN players p ON p.id = c.player_id
            JOIN teams t ON t.id = p.team_id
            JOIN card_types ct ON ct.id = c.card_type_id
            WHERE c.player_id = $1 AND p.product_id = $2
            ORDER BY c.estimated_value DESC
            """,
            player_id, product_id,
        )
        return [dict(row) for row in rows]


async def get_market_sales(product_id: str, card_type: Optional[str], limit: int) -> list[dict]:
    pool = await get_pool()
    async with pool.acquire() as conn:
        query = """
            SELECT
                ms.id,
                ms.sale_date AS "date",
                p.name AS "playerName",
                ct.name AS "cardType",
                ct.rarity,
                ms.sale_price AS "salePrice",
                ms.product_id AS "productId"
            FROM market_sales ms
            JOIN players p ON p.id = ms.player_id
            JOIN card_types ct ON ct.id = ms.card_type_id
            WHERE ms.product_id = $1
        """
        params: list = [product_id]
        if card_type:
            query += " AND ct.name = $2"
            params.append(card_type)
        query += " ORDER BY ms.sale_date DESC LIMIT $" + str(len(params) + 1)
        params.append(limit)
        rows = await conn.fetch(query, *params)
        return [dict(row) for row in rows]
