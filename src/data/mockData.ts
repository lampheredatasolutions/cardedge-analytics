import type { Sport, Product, Team, CardType, Player, PlayerCard, TeamAnalytics, PlayerAnalytics, MarketSale, MarketTrend } from '../types';

export const SPORTS: Sport[] = [
  { id: 'nfl', name: 'Football', abbreviation: 'NFL' },
  { id: 'mlb', name: 'Baseball', abbreviation: 'MLB' },
  { id: 'nba', name: 'Basketball', abbreviation: 'NBA' },
  { id: 'nhl', name: 'Hockey', abbreviation: 'NHL' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'topps-chrome-nfl-2025',
    name: 'Topps Chrome NFL 2025',
    sport: 'nfl',
    year: 2025,
    manufacturer: 'Topps',
    packPrice: 25,
    boxPrice: 150,
    packsPerBox: 12,
    description: 'The flagship NFL Chrome product featuring rookies, veterans, and rare parallels.',
  },
  {
    id: 'topps-chrome-mlb-2025',
    name: 'Topps Chrome MLB 2025',
    sport: 'mlb',
    year: 2025,
    manufacturer: 'Topps',
    packPrice: 20,
    boxPrice: 120,
    packsPerBox: 12,
    description: 'Chrome Baseball featuring top prospects and veterans.',
  },
  {
    id: 'panini-prizm-nba-2025',
    name: 'Panini Prizm NBA 2024-25',
    sport: 'nba',
    year: 2025,
    manufacturer: 'Panini',
    packPrice: 30,
    boxPrice: 180,
    packsPerBox: 12,
    description: 'The premier NBA card product with iconic Prizm technology.',
  },
  {
    id: 'topps-chrome-nfl-2024',
    name: 'Topps Chrome NFL 2024',
    sport: 'nfl',
    year: 2024,
    manufacturer: 'Topps',
    packPrice: 22,
    boxPrice: 130,
    packsPerBox: 12,
  },
];

export const NFL_TEAMS: Team[] = [
  { id: 'bears', name: 'Chicago Bears', abbreviation: 'CHI', sport: 'nfl', city: 'Chicago', primaryColor: '#0B162A' },
  { id: 'chiefs', name: 'Kansas City Chiefs', abbreviation: 'KC', sport: 'nfl', city: 'Kansas City', primaryColor: '#E31837' },
  { id: 'vikings', name: 'Minnesota Vikings', abbreviation: 'MIN', sport: 'nfl', city: 'Minneapolis', primaryColor: '#4F2683' },
  { id: 'texans', name: 'Houston Texans', abbreviation: 'HOU', sport: 'nfl', city: 'Houston', primaryColor: '#03202F' },
  { id: 'ravens', name: 'Baltimore Ravens', abbreviation: 'BAL', sport: 'nfl', city: 'Baltimore', primaryColor: '#241773' },
  { id: 'eagles', name: 'Philadelphia Eagles', abbreviation: 'PHI', sport: 'nfl', city: 'Philadelphia', primaryColor: '#004C54' },
  { id: 'bengals', name: 'Cincinnati Bengals', abbreviation: 'CIN', sport: 'nfl', city: 'Cincinnati', primaryColor: '#FB4F14' },
  { id: 'bills', name: 'Buffalo Bills', abbreviation: 'BUF', sport: 'nfl', city: 'Buffalo', primaryColor: '#00338D' },
  { id: '49ers', name: 'San Francisco 49ers', abbreviation: 'SF', sport: 'nfl', city: 'San Francisco', primaryColor: '#AA0000' },
  { id: 'chargers', name: 'Los Angeles Chargers', abbreviation: 'LAC', sport: 'nfl', city: 'Los Angeles', primaryColor: '#002A5E' },
  { id: 'lions', name: 'Detroit Lions', abbreviation: 'DET', sport: 'nfl', city: 'Detroit', primaryColor: '#0076B6' },
  { id: 'cowboys', name: 'Dallas Cowboys', abbreviation: 'DAL', sport: 'nfl', city: 'Dallas', primaryColor: '#003594' },
  { id: 'rams', name: 'Los Angeles Rams', abbreviation: 'LAR', sport: 'nfl', city: 'Los Angeles', primaryColor: '#003594' },
  { id: 'dolphins', name: 'Miami Dolphins', abbreviation: 'MIA', sport: 'nfl', city: 'Miami', primaryColor: '#008E97' },
  { id: 'packers', name: 'Green Bay Packers', abbreviation: 'GB', sport: 'nfl', city: 'Green Bay', primaryColor: '#203731' },
  { id: 'giants', name: 'New York Giants', abbreviation: 'NYG', sport: 'nfl', city: 'New York', primaryColor: '#0B2265' },
];

export const CARD_TYPES: CardType[] = [
  { id: 'patch-auto', name: 'Patch Auto', rarity: 'Legendary', odds: '1:480', oddsNumber: 480, printRun: '/10', baseValue: 500 },
  { id: 'auto-parallel', name: 'Auto Parallel', rarity: 'Ultra Rare', odds: '1:120', oddsNumber: 120, printRun: '/50', baseValue: 200 },
  { id: 'auto', name: 'Auto', rarity: 'Rare', odds: '1:24', oddsNumber: 24, printRun: '∞', baseValue: 100 },
  { id: 'numbered-parallel', name: 'Numbered Parallel', rarity: 'Ultra Rare', odds: '1:120', oddsNumber: 120, printRun: '/25', baseValue: 80 },
  { id: 'parallel', name: 'Parallel', rarity: 'Rare', odds: '1:24', oddsNumber: 24, printRun: '/199', baseValue: 20 },
  { id: 'refractor', name: 'Refractor', rarity: 'Uncommon', odds: '1:4', oddsNumber: 4, printRun: '∞', baseValue: 8 },
  { id: 'insert', name: 'Insert', rarity: 'Uncommon', odds: '1:8', oddsNumber: 8, printRun: '∞', baseValue: 5 },
  { id: 'base', name: 'Base', rarity: 'Common', odds: '1:1', oddsNumber: 1, printRun: '∞', baseValue: 2 },
];

// Player multipliers relative to base values
const playerMultipliers: Record<string, number> = {
  'caleb-williams': 10.0,
  'cj-stroud': 7.0,
  'patrick-mahomes': 6.5,
  'lamar-jackson': 6.0,
  'josh-allen': 5.8,
  'justin-jefferson': 5.5,
  'joe-burrow': 5.2,
  'jalen-hurts': 5.0,
  'brock-purdy': 4.8,
  'jj-mccarthy': 4.5,
  'justin-herbert': 4.2,
  'ceedee-lamb': 4.0,
  'tyreek-hill': 3.8,
  'puka-nacua': 3.5,
  'bo-nix': 3.2,
  'jayden-daniels': 3.5,
  'will-levis': 2.8,
  'sam-howell': 2.5,
  'jordan-addison': 2.8,
  'najee-harris': 2.0,
  'davante-adams': 3.0,
  'stefon-diggs': 2.5,
  'amon-ra-st-brown': 3.0,
  'jared-goff': 2.8,
  'dak-prescott': 3.2,
  'tua-tagovailoa': 3.0,
  'jordan-love': 3.0,
  'daniel-jones': 1.5,
  'deebo-samuel': 2.5,
  'george-kittle': 3.0,
  'travis-kelce': 4.0,
  'davion-thomas': 2.0,
  'javon-baker': 2.2,
  'rome-odunze': 3.8,
  'malik-nabers': 3.5,
  'marvin-harrison-jr': 4.0,
  'brian-thomas-jr': 3.2,
};

export const PLAYERS: Player[] = [
  { id: 'caleb-williams', name: 'Caleb Williams', teamId: 'bears', teamName: 'Chicago Bears', position: 'QB', isStar: true, isRookie: true, productId: 'topps-chrome-nfl-2025' },
  { id: 'cj-stroud', name: 'CJ Stroud', teamId: 'texans', teamName: 'Houston Texans', position: 'QB', isStar: true, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'patrick-mahomes', name: 'Patrick Mahomes', teamId: 'chiefs', teamName: 'Kansas City Chiefs', position: 'QB', isStar: true, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'lamar-jackson', name: 'Lamar Jackson', teamId: 'ravens', teamName: 'Baltimore Ravens', position: 'QB', isStar: true, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'josh-allen', name: 'Josh Allen', teamId: 'bills', teamName: 'Buffalo Bills', position: 'QB', isStar: true, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'justin-jefferson', name: 'Justin Jefferson', teamId: 'vikings', teamName: 'Minnesota Vikings', position: 'WR', isStar: true, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'joe-burrow', name: 'Joe Burrow', teamId: 'bengals', teamName: 'Cincinnati Bengals', position: 'QB', isStar: true, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'jalen-hurts', name: 'Jalen Hurts', teamId: 'eagles', teamName: 'Philadelphia Eagles', position: 'QB', isStar: true, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'brock-purdy', name: 'Brock Purdy', teamId: '49ers', teamName: 'San Francisco 49ers', position: 'QB', isStar: true, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'jj-mccarthy', name: 'JJ McCarthy', teamId: 'vikings', teamName: 'Minnesota Vikings', position: 'QB', isStar: false, isRookie: true, productId: 'topps-chrome-nfl-2025' },
  { id: 'justin-herbert', name: 'Justin Herbert', teamId: 'chargers', teamName: 'Los Angeles Chargers', position: 'QB', isStar: true, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'ceedee-lamb', name: 'CeeDee Lamb', teamId: 'cowboys', teamName: 'Dallas Cowboys', position: 'WR', isStar: true, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'tyreek-hill', name: 'Tyreek Hill', teamId: 'dolphins', teamName: 'Miami Dolphins', position: 'WR', isStar: true, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'puka-nacua', name: 'Puka Nacua', teamId: 'rams', teamName: 'Los Angeles Rams', position: 'WR', isStar: false, isRookie: true, productId: 'topps-chrome-nfl-2025' },
  { id: 'bo-nix', name: 'Bo Nix', teamId: 'bears', teamName: 'Chicago Bears', position: 'QB', isStar: false, isRookie: true, productId: 'topps-chrome-nfl-2025' },
  { id: 'rome-odunze', name: 'Rome Odunze', teamId: 'bears', teamName: 'Chicago Bears', position: 'WR', isStar: false, isRookie: true, productId: 'topps-chrome-nfl-2025' },
  { id: 'jayden-daniels', name: 'Jayden Daniels', teamId: 'giants', teamName: 'New York Giants', position: 'QB', isStar: false, isRookie: true, productId: 'topps-chrome-nfl-2025' },
  { id: 'marvin-harrison-jr', name: 'Marvin Harrison Jr.', teamId: 'chiefs', teamName: 'Kansas City Chiefs', position: 'WR', isStar: false, isRookie: true, productId: 'topps-chrome-nfl-2025' },
  { id: 'malik-nabers', name: 'Malik Nabers', teamId: 'giants', teamName: 'New York Giants', position: 'WR', isStar: false, isRookie: true, productId: 'topps-chrome-nfl-2025' },
  { id: 'brian-thomas-jr', name: 'Brian Thomas Jr.', teamId: 'chargers', teamName: 'Los Angeles Chargers', position: 'WR', isStar: false, isRookie: true, productId: 'topps-chrome-nfl-2025' },
  { id: 'travis-kelce', name: 'Travis Kelce', teamId: 'chiefs', teamName: 'Kansas City Chiefs', position: 'TE', isStar: true, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'davante-adams', name: 'Davante Adams', teamId: 'packers', teamName: 'Green Bay Packers', position: 'WR', isStar: true, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'jordan-addison', name: 'Jordan Addison', teamId: 'vikings', teamName: 'Minnesota Vikings', position: 'WR', isStar: false, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'amon-ra-st-brown', name: "Amon-Ra St. Brown", teamId: 'lions', teamName: 'Detroit Lions', position: 'WR', isStar: true, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'jared-goff', name: 'Jared Goff', teamId: 'lions', teamName: 'Detroit Lions', position: 'QB', isStar: true, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'dak-prescott', name: 'Dak Prescott', teamId: 'cowboys', teamName: 'Dallas Cowboys', position: 'QB', isStar: true, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'tua-tagovailoa', name: 'Tua Tagovailoa', teamId: 'dolphins', teamName: 'Miami Dolphins', position: 'QB', isStar: true, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'jordan-love', name: 'Jordan Love', teamId: 'packers', teamName: 'Green Bay Packers', position: 'QB', isStar: true, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'george-kittle', name: 'George Kittle', teamId: '49ers', teamName: 'San Francisco 49ers', position: 'TE', isStar: true, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'deebo-samuel', name: 'Deebo Samuel', teamId: '49ers', teamName: 'San Francisco 49ers', position: 'WR', isStar: true, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'stefon-diggs', name: 'Stefon Diggs', teamId: 'bills', teamName: 'Buffalo Bills', position: 'WR', isStar: true, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'will-levis', name: 'Will Levis', teamId: 'titans', teamName: 'Tennessee Titans', position: 'QB', isStar: false, isRookie: true, productId: 'topps-chrome-nfl-2025' },
  { id: 'najee-harris', name: 'Najee Harris', teamId: 'bears', teamName: 'Chicago Bears', position: 'RB', isStar: false, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'javon-baker', name: 'Javon Baker', teamId: 'chiefs', teamName: 'Kansas City Chiefs', position: 'WR', isStar: false, isRookie: true, productId: 'topps-chrome-nfl-2025' },
  { id: 'daniel-jones', name: 'Daniel Jones', teamId: 'giants', teamName: 'New York Giants', position: 'QB', isStar: false, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'sam-howell', name: 'Sam Howell', teamId: 'chargers', teamName: 'Los Angeles Chargers', position: 'QB', isStar: false, isRookie: false, productId: 'topps-chrome-nfl-2025' },
  { id: 'dak-prescott-2', name: 'CeeDee Lamb RC', teamId: 'cowboys', teamName: 'Dallas Cowboys', position: 'WR', isStar: false, isRookie: true, productId: 'topps-chrome-nfl-2025' },
];

// Generate player cards based on players and card types
function generatePlayerCards(): PlayerCard[] {
  const cards: PlayerCard[] = [];

  PLAYERS.forEach((player) => {
    const multiplier = playerMultipliers[player.id] ?? 2.0;

    CARD_TYPES.forEach((cardType) => {
      // Not all players get all card types — limit patch autos and numbered to stars/rookies
      if (cardType.id === 'patch-auto' && !player.isStar && !player.isRookie) return;
      if (cardType.id === 'auto-parallel' && !player.isStar && !player.isRookie) return;
      if (cardType.id === 'numbered-parallel' && !player.isStar && !player.isRookie) return;

      const estimatedValue = Math.round(cardType.baseValue * multiplier * (0.9 + Math.random() * 0.2) * 10) / 10;

      cards.push({
        id: `${player.id}-${cardType.id}`,
        playerId: player.id,
        playerName: player.name,
        teamId: player.teamId,
        teamName: player.teamName,
        cardTypeId: cardType.id,
        cardTypeName: cardType.name,
        rarity: cardType.rarity,
        odds: cardType.odds,
        oddsNumber: cardType.oddsNumber,
        printRun: cardType.printRun,
        estimatedValue,
        productId: 'topps-chrome-nfl-2025',
      });
    });
  });

  return cards;
}

export const PLAYER_CARDS: PlayerCard[] = generatePlayerCards();

// Build player analytics from cards
function buildPlayerAnalytics(): PlayerAnalytics[] {
  const analyticsMap = new Map<string, PlayerAnalytics>();

  PLAYERS.forEach((player) => {
    const playerCards = PLAYER_CARDS.filter(c => c.playerId === player.id);
    const totalEV = playerCards.reduce((sum, c) => sum + (c.estimatedValue / c.oddsNumber), 0) * 24; // normalize per 24 packs
    const topCard = playerCards.reduce((max, c) => c.estimatedValue > max.estimatedValue ? c : max, playerCards[0]);

    analyticsMap.set(player.id, {
      playerId: player.id,
      playerName: player.name,
      teamId: player.teamId,
      teamName: player.teamName,
      isStar: player.isStar,
      isRookie: player.isRookie,
      cards: playerCards,
      topCardValue: topCard?.estimatedValue ?? 0,
      totalEV: Math.round(totalEV * 100) / 100,
    });
  });

  return Array.from(analyticsMap.values()).sort((a, b) => b.totalEV - a.totalEV);
}

export const PLAYER_ANALYTICS: PlayerAnalytics[] = buildPlayerAnalytics();

// Build team analytics
function buildTeamAnalytics(): TeamAnalytics[] {
  const teamMap = new Map<string, TeamAnalytics>();

  NFL_TEAMS.forEach((team) => {
    const teamPlayers = PLAYERS.filter(p => p.teamId === team.id);
    const teamCards = PLAYER_CARDS.filter(c => c.teamId === team.id);
    const stars = teamPlayers.filter(p => p.isStar).length;
    const rookies = teamPlayers.filter(p => p.isRookie).length;
    const autos = teamCards.filter(c => c.cardTypeId === 'auto' || c.cardTypeId === 'auto-parallel' || c.cardTypeId === 'patch-auto').length;

    const totalEV = teamCards.reduce((sum, c) => sum + (c.estimatedValue / c.oddsNumber), 0) * 24;
    const hitCards = teamCards.filter(c => ['auto', 'auto-parallel', 'patch-auto', 'numbered-parallel'].includes(c.cardTypeId));
    const hitEV = hitCards.reduce((sum, c) => sum + (c.estimatedValue / c.oddsNumber), 0) * 24;

    // Sleeper score: high rookies + moderate star, undervalued
    const sleeperScore = Math.round((rookies * 200) + (totalEV * 0.1) - (stars * 50));

    teamMap.set(team.id, {
      teamId: team.id,
      teamName: team.name,
      totalEV: Math.round(totalEV),
      cardCount: teamCards.length,
      starCount: stars,
      rookieCount: rookies,
      autoCount: autos,
      hitEV: Math.round(hitEV),
      sleeperScore: Math.max(0, sleeperScore),
      players: teamPlayers.map(p => p.name),
    });
  });

  return Array.from(teamMap.values())
    .filter(t => t.cardCount > 0)
    .sort((a, b) => b.totalEV - a.totalEV);
}

export const TEAM_ANALYTICS: TeamAnalytics[] = buildTeamAnalytics();

// Market sales data
const marketDates: string[] = [];
for (let i = 35; i >= 3; i--) {
  const d = new Date('2025-04-21');
  d.setDate(d.getDate() - i);
  marketDates.push(d.toISOString().split('T')[0]);
}

const topPlayersSales = [
  { playerId: 'caleb-williams', name: 'Caleb Williams', basePrice: 770 },
  { playerId: 'cj-stroud', name: 'CJ Stroud', basePrice: 675 },
  { playerId: 'patrick-mahomes', name: 'Patrick Mahomes', basePrice: 477 },
  { playerId: 'lamar-jackson', name: 'Lamar Jackson', basePrice: 1045 },
  { playerId: 'josh-allen', name: 'Josh Allen', basePrice: 380 },
  { playerId: 'joe-burrow', name: 'Joe Burrow', basePrice: 745 },
  { playerId: 'ceedee-lamb', name: 'CeeDee Lamb', basePrice: 119 },
  { playerId: 'tyreek-hill', name: 'Tyreek Hill', basePrice: 169 },
];

export const MARKET_SALES: MarketSale[] = [];
let saleId = 1;

topPlayersSales.forEach(({ playerId, name, basePrice }) => {
  const count = 2 + Math.floor(Math.random() * 4);
  for (let i = 0; i < count; i++) {
    const dateIdx = Math.floor(Math.random() * marketDates.length);
    const variance = 0.7 + Math.random() * 0.6;
    MARKET_SALES.push({
      id: `sale-${saleId++}`,
      date: marketDates[dateIdx],
      playerName: name,
      cardType: Math.random() > 0.5 ? 'Auto' : 'Patch Auto',
      rarity: Math.random() > 0.5 ? 'Rare' : 'Legendary',
      salePrice: Math.round(basePrice * variance),
      productId: 'topps-chrome-nfl-2025',
    });
  }
});

MARKET_SALES.sort((a, b) => a.date.localeCompare(b.date));

// Price chart data (daily averages)
export const PRICE_CHART_DATA = marketDates.map(date => {
  const daySales = MARKET_SALES.filter(s => s.date === date);
  const avg = daySales.length > 0
    ? Math.round(daySales.reduce((s, sale) => s + sale.salePrice, 0) / daySales.length)
    : null;
  return { date, avgPrice: avg };
}).filter(d => d.avgPrice !== null);

export const MARKET_TRENDS: MarketTrend[] = [
  { playerId: 'caleb-williams', playerName: 'Caleb Williams', teamName: 'Chicago Bears', avgSalePrice: 770.7, salesCount: 5, trend: 'rising', percentChange: 12.3 },
  { playerId: 'cj-stroud', playerName: 'CJ Stroud', teamName: 'Houston Texans', avgSalePrice: 675.69, salesCount: 4, trend: 'rising', percentChange: 8.1 },
  { playerId: 'patrick-mahomes', playerName: 'Patrick Mahomes', teamName: 'Kansas City Chiefs', avgSalePrice: 477.35, salesCount: 5, trend: 'rising', percentChange: 5.5 },
  { playerId: 'lamar-jackson', playerName: 'Lamar Jackson', teamName: 'Baltimore Ravens', avgSalePrice: 1045, salesCount: 2, trend: 'rising', percentChange: 15.2 },
  { playerId: 'joe-burrow', playerName: 'Joe Burrow', teamName: 'Cincinnati Bengals', avgSalePrice: 745, salesCount: 2, trend: 'declining', percentChange: -8.4 },
  { playerId: 'ceedee-lamb', playerName: 'CeeDee Lamb', teamName: 'Dallas Cowboys', avgSalePrice: 119.25, salesCount: 2, trend: 'declining', percentChange: -12.1 },
  { playerId: 'tyreek-hill', playerName: 'Tyreek Hill', teamName: 'Miami Dolphins', avgSalePrice: 169, salesCount: 1, trend: 'declining', percentChange: -6.7 },
];

// Value by card type (for donut chart)
export const VALUE_BY_CARD_TYPE = [
  { name: 'Patch Auto', value: 14950, color: '#8b5cf6' },
  { name: 'Auto Parallel', value: 4618, color: '#06b6d4' },
  { name: 'Auto', value: 8745, color: '#3b82f6' },
  { name: 'Numbered Parallel', value: 883, color: '#10b981' },
  { name: 'Parallel', value: 95, color: '#f59e0b' },
];

export const PRODUCT_SELECTOR_OPTIONS = {
  sports: SPORTS,
  products: PRODUCTS,
};

export function getProductById(id: string) {
  return PRODUCTS.find(p => p.id === id);
}

export function getTeamById(id: string) {
  return NFL_TEAMS.find(t => t.id === id);
}

export function getCardsByPlayer(playerId: string) {
  return PLAYER_CARDS.filter(c => c.playerId === playerId);
}

export function getCardsByTeam(teamId: string) {
  return PLAYER_CARDS.filter(c => c.teamId === teamId);
}

export function getPlayersByProduct(productId: string) {
  return PLAYERS.filter(p => p.productId === productId);
}

export function getDashboardStats() {
  const totalValue = PLAYER_CARDS.reduce((sum, c) => sum + c.estimatedValue, 0);
  const stars = PLAYERS.filter(p => p.isStar).length;
  const teams = new Set(PLAYERS.map(p => p.teamId)).size;
  return {
    totalChecklistValue: Math.round(totalValue),
    cardsTracked: PLAYER_CARDS.length,
    starPlayers: stars,
    teamsCovered: teams,
  };
}
