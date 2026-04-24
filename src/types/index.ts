export interface Sport {
  id: string;
  name: string;
  abbreviation: string;
}

export interface Product {
  id: string;
  name: string;
  sport: string;
  year: number;
  manufacturer: string;
  packPrice: number;
  boxPrice: number;
  packsPerBox: number;
  description?: string;
}

export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  sport: string;
  city: string;
  primaryColor: string;
}

export type RarityTier = 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare' | 'Legendary';

export interface CardType {
  id: string;
  name: string;
  rarity: RarityTier;
  odds: string;
  oddsNumber: number; // 1 in X
  printRun: string; // '/10', '/50', '∞'
  baseValue: number;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  position: string;
  isStar: boolean;
  isRookie: boolean;
  productId: string;
}

export interface PlayerCard {
  id: string;
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  cardTypeId: string;
  cardTypeName: string;
  rarity: RarityTier;
  odds: string;
  oddsNumber: number;
  printRun: string;
  estimatedValue: number;
  productId: string;
}

export interface TeamAnalytics {
  teamId: string;
  teamName: string;
  totalEV: number;
  cardCount: number;
  starCount: number;
  rookieCount: number;
  autoCount: number;
  hitEV: number;
  sleeperScore: number;
  players: string[];
}

export interface PlayerAnalytics {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  isStar: boolean;
  isRookie: boolean;
  cards: PlayerCard[];
  topCardValue: number;
  totalEV: number;
}

export interface SimulationResult {
  packNumber: number;
  pulls: {
    cardType: string;
    playerName: string;
    rarity: RarityTier;
    value: number;
  }[];
  packValue: number;
}

export interface MarketSale {
  id: string;
  date: string;
  playerName: string;
  cardType: string;
  rarity: RarityTier;
  salePrice: number;
  productId: string;
}

export interface MarketTrend {
  playerId: string;
  playerName: string;
  teamName: string;
  avgSalePrice: number;
  salesCount: number;
  trend: 'rising' | 'declining' | 'stable';
  percentChange: number;
}

export interface DashboardStats {
  totalChecklistValue: number;
  cardsTracked: number;
  starPlayers: number;
  teamsCovered: number;
}
