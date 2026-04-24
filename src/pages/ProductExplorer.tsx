import { useState, useMemo } from 'react'
import { Star, Search } from 'lucide-react'
import { PLAYER_CARDS, NFL_TEAMS, PRODUCTS, CARD_TYPES } from '../data/mockData'
import type { Product, PlayerCard, RarityTier } from '../types'
import ProductSelector from '../components/ui/ProductSelector'

const RARITY_COLORS: Record<RarityTier, string> = {
  Legendary: 'badge-legendary',
  'Ultra Rare': 'badge-ultra-rare',
  Rare: 'badge-rare',
  Uncommon: 'badge-uncommon',
  Common: 'badge-common',
}

function RarityBadge({ rarity }: { rarity: RarityTier }) {
  return <span className={RARITY_COLORS[rarity]}>{rarity}</span>
}

export default function ProductExplorer() {
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCardType, setSelectedCardType] = useState('all')
  const [selectedTeam, setSelectedTeam] = useState('all')
  const [sortBy, setSortBy] = useState<'value' | 'rarity' | 'name'>('value')

  const cards = useMemo(() => {
    let filtered = PLAYER_CARDS.filter(c => c.productId === selectedProduct.id)

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(c =>
        c.playerName.toLowerCase().includes(q) ||
        c.teamName.toLowerCase().includes(q)
      )
    }
    if (selectedCardType !== 'all') {
      filtered = filtered.filter(c => c.cardTypeId === selectedCardType)
    }
    if (selectedTeam !== 'all') {
      filtered = filtered.filter(c => c.teamId === selectedTeam)
    }

    if (sortBy === 'value') filtered.sort((a, b) => b.estimatedValue - a.estimatedValue)
    else if (sortBy === 'name') filtered.sort((a, b) => a.playerName.localeCompare(b.playerName))
    else if (sortBy === 'rarity') {
      const rarityOrder: Record<RarityTier, number> = { Legendary: 0, 'Ultra Rare': 1, Rare: 2, Uncommon: 3, Common: 4 }
      filtered.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity])
    }

    return filtered
  }, [selectedProduct, searchQuery, selectedCardType, selectedTeam, sortBy])

  const teamsWithCards = useMemo(() => {
    const ids = new Set(PLAYER_CARDS.filter(c => c.productId === selectedProduct.id).map(c => c.teamId))
    return NFL_TEAMS.filter(t => ids.has(t.id))
  }, [selectedProduct])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Product Explorer</h1>
        <p className="text-gray-400 text-sm mt-1">{cards.length} cards · {teamsWithCards.length} teams</p>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <ProductSelector selectedProduct={selectedProduct} onProductChange={setSelectedProduct} />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search players..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-[#1c1c30] border border-[#252540] text-white text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-cyan-500 w-44"
            />
          </div>

          <select
            value={selectedCardType}
            onChange={e => setSelectedCardType(e.target.value)}
            className="bg-[#1c1c30] border border-[#252540] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Types</option>
            {CARD_TYPES.map(ct => (
              <option key={ct.id} value={ct.id}>{ct.name}</option>
            ))}
          </select>

          <select
            value={selectedTeam}
            onChange={e => setSelectedTeam(e.target.value)}
            className="bg-[#1c1c30] border border-[#252540] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Teams</option>
            {teamsWithCards.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'value' | 'rarity' | 'name')}
            className="bg-[#1c1c30] border border-[#252540] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="value">Highest Value</option>
            <option value="rarity">Rarity</option>
            <option value="name">Player Name</option>
          </select>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
        {cards.map(card => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>

      {cards.length === 0 && (
        <div className="card p-12 text-center">
          <div className="text-gray-500 text-sm">No cards match your filters.</div>
        </div>
      )}
    </div>
  )
}

function CardItem({ card }: { card: PlayerCard }) {
  const isHighValue = card.estimatedValue >= 100

  return (
    <div className="card-hover p-3 cursor-pointer group">
      {/* Card visual placeholder */}
      <div className="w-full aspect-[3/4] rounded-lg mb-3 flex items-center justify-center relative overflow-hidden"
        style={{
          background: isHighValue
            ? 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(139,92,246,0.15) 100%)'
            : 'linear-gradient(135deg, rgba(37,37,64,0.5) 0%, rgba(30,30,56,0.5) 100%)',
          border: isHighValue ? '1px solid rgba(6,182,212,0.2)' : '1px solid rgba(37,37,64,0.5)',
        }}
      >
        <div className="text-center px-2">
          <div className="text-2xl mb-1">🃏</div>
          <div className="text-white text-xs font-semibold leading-tight">{card.playerName}</div>
          <div className="text-gray-500 text-[10px] mt-0.5">{card.teamName.split(' ').pop()}</div>
        </div>
        {card.printRun !== '∞' && (
          <div className="absolute top-1.5 right-1.5 text-[9px] font-bold text-white bg-black/60 px-1 py-0.5 rounded">
            {card.printRun}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-white text-xs font-semibold truncate">{card.playerName}</span>
        </div>
        <div className="text-gray-500 text-[10px] truncate">{card.teamName}</div>
        <div className="text-[10px] text-gray-400">{card.cardTypeName}</div>
        <div className="flex items-center justify-between mt-1">
          <RarityBadge rarity={card.rarity} />
          <span className="text-cyan-400 text-xs font-bold">${card.estimatedValue.toLocaleString()}</span>
        </div>
        <div className="text-[10px] text-gray-500">Odds: {card.odds}</div>
      </div>
    </div>
  )
}
