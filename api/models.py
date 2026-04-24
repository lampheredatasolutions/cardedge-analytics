"""
SQLAlchemy models / raw DDL for Neon PostgreSQL.
Run api/seed.py after applying this schema.
"""

CREATE_TABLES_SQL = """
-- Sports
CREATE TABLE IF NOT EXISTS sports (
    id          VARCHAR(20)  PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL,
    abbreviation VARCHAR(5)  NOT NULL
);

-- Products
CREATE TABLE IF NOT EXISTS products (
    id              VARCHAR(100) PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    sport_id        VARCHAR(20)  NOT NULL REFERENCES sports(id),
    year            INTEGER      NOT NULL,
    manufacturer    VARCHAR(100),
    pack_price      NUMERIC(10,2),
    box_price       NUMERIC(10,2),
    packs_per_box   INTEGER,
    description     TEXT,
    created_at      TIMESTAMPTZ  DEFAULT NOW()
);

-- Teams
CREATE TABLE IF NOT EXISTS teams (
    id              VARCHAR(50)  PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    abbreviation    VARCHAR(5)   NOT NULL,
    sport_id        VARCHAR(20)  NOT NULL REFERENCES sports(id),
    city            VARCHAR(100),
    primary_color   VARCHAR(10)
);

-- Card Types
CREATE TABLE IF NOT EXISTS card_types (
    id              VARCHAR(50)  PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    rarity          VARCHAR(20)  NOT NULL CHECK (rarity IN ('Common','Uncommon','Rare','Ultra Rare','Legendary')),
    odds            VARCHAR(20),
    odds_number     INTEGER,
    print_run       VARCHAR(20),
    base_value      NUMERIC(10,2)
);

-- Players
CREATE TABLE IF NOT EXISTS players (
    id              VARCHAR(100) PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    team_id         VARCHAR(50)  REFERENCES teams(id),
    position        VARCHAR(10),
    is_star         BOOLEAN      DEFAULT FALSE,
    is_rookie       BOOLEAN      DEFAULT FALSE,
    product_id      VARCHAR(100) REFERENCES products(id),
    created_at      TIMESTAMPTZ  DEFAULT NOW()
);

-- Cards
CREATE TABLE IF NOT EXISTS cards (
    id              VARCHAR(200) PRIMARY KEY,
    player_id       VARCHAR(100) REFERENCES players(id),
    card_type_id    VARCHAR(50)  REFERENCES card_types(id),
    estimated_value NUMERIC(10,2),
    product_id      VARCHAR(100) REFERENCES products(id),
    created_at      TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cards_player_id ON cards(player_id);
CREATE INDEX IF NOT EXISTS idx_cards_product_id ON cards(product_id);
CREATE INDEX IF NOT EXISTS idx_players_team_id ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_players_product_id ON players(product_id);

-- Market Sales
CREATE TABLE IF NOT EXISTS market_sales (
    id              VARCHAR(50)  PRIMARY KEY,
    player_id       VARCHAR(100) REFERENCES players(id),
    card_type_id    VARCHAR(50)  REFERENCES card_types(id),
    sale_date       DATE         NOT NULL,
    sale_price      NUMERIC(10,2) NOT NULL,
    product_id      VARCHAR(100) REFERENCES products(id),
    source          VARCHAR(50)  DEFAULT 'manual',
    created_at      TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_market_sales_product_id ON market_sales(product_id);
CREATE INDEX IF NOT EXISTS idx_market_sales_sale_date ON market_sales(sale_date);

-- Simulated Pulls (optional analytics)
CREATE TABLE IF NOT EXISTS simulated_pulls (
    id              SERIAL       PRIMARY KEY,
    session_id      UUID         DEFAULT gen_random_uuid(),
    player_id       VARCHAR(100) REFERENCES players(id),
    card_type_id    VARCHAR(50)  REFERENCES card_types(id),
    product_id      VARCHAR(100) REFERENCES products(id),
    simulated_value NUMERIC(10,2),
    pack_count      INTEGER,
    created_at      TIMESTAMPTZ  DEFAULT NOW()
);
"""

if __name__ == "__main__":
    print(CREATE_TABLES_SQL)
