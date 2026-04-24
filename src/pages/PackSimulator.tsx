import { useState, useCallback } from 'react'
import { Layers, Play, RotateCcw, TrendingUp, Package, DollarSign, Zap } from 'lucide-react'
import { PLAYERS, CARD_TYPES, PRODUCTS } from '../data/mockData'
import type { RarityTier } from '../types'

interface Pull {
  playerName: string
  teamName: string
  cardTypeName: string
  rarity: RarityTier
  value: number
  isHit: boolean
}

interface SimResult {
  pulls: Pull[]
  totalValue: number
  totalSpent: number
  roi: number
  hits: Pull[]
  bestPull: Pull | null
}

const RARITY_COLORS: Record<RarityTier, string> = {
  Legendary: 'text-purple-400 bg-purple-900/30 border-purple-700/40',
  'Ultra Rare': 'text-cyan-400 bg-cyan-900/30 border-cyan-700/40',
  Rare: 'text-blue-400 bg-blue-900/30 border-blue-700/40',
  Uncommon: 'text-emerald-400 bg-emerald-900/30 border-emerald-700/40',
  Common: 'text-gray-400 bg-gray-800/50 border-gray-700/30',
}

function simulatePull(): Pull {
  const rand = Math.random() * 100

  let cardType: typeof CARD_TYPES[0]
  if (rand < 0.21) cardType = CARD_TYPES[0]       // Patch Auto 1:480 ≈ 0.21%
  else if (rand < 1.04) cardType = CARD_TYPES[1]  // Auto Parallel 1:120 ≈ 0.83%
  else if (rand < 5.21) cardType = CARD_TYPES[2]  // Auto 1:24 ≈ 4.17%
  else if (rand < 6.04) cardType = CARD_TYPES[3]  // Numbered Parallel 1:120 ≈ 0.83%
  else if (rand < 10.21) cardType = CARD_TYPES[4]  // Parallel 1:24 ≈ 4.17%
  else if (rand < 35.21) cardType = CARD_TYPES[5]  // Refractor 1:4 ≈ 25%
  else if (rand < 47.71) cardType = CARD_TYPES[6]  // Insert 1:8 ≈ 12.5%
  else cardType = CARD_TYPES[7]                     // Base ~52.5%

  // Random player
  const player = PLAYERS[Math.floor(Math.random() * PLAYERS.length)]
  const playerMultiplier = player.isStar ? (1.5 + Math.random() * 2) : (0.5 + Math.random())
  const value = Math.round(cardType.baseValue * playerMultiplier * (0.8 + Math.random() * 0.4) * 10) / 10

  const isHit = ['auto', 'auto-parallel', 'patch-auto'].includes(cardType.id)

  return {
    playerName: player.name,
    teamName: player.teamName,
    cardTypeName: cardType.name,
    rarity: cardType.rarity,
    value,
    isHit,
  }
}

export default function PackSimulator() {
  const [packCount, setPackCount] = useState(12)
  const [selectedProductId, setSelectedProductId] = useState('topps-chrome-nfl-2025')
  const [result, setResult] = useState<SimResult | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)

  const product = PRODUCTS.find(p => p.id === selectedProductId) ?? PRODUCTS[0]
  const boxCount = Math.floor(packCount / product.packsPerBox)
  const totalCost = packCount * product.packPrice

  const runSimulation = useCallback(() => {
    setIsSimulating(true)
    setTimeout(() => {
      const pulls: Pull[] = []
      for (let i = 0; i < packCount; i++) {
        // Each pack has ~10 cards
        const cardsPerPack = 10
        for (let j = 0; j < cardsPerPack; j++) {
          pulls.push(simulatePull())
        }
      }

      const totalValue = pulls.reduce((s, p) => s + p.value, 0)
      const hits = pulls.filter(p => p.isHit)
      const bestPull = pulls.reduce((max, p) => p.value > max.value ? p : max, pulls[0]) ?? null
      const roi = ((totalValue - totalCost) / totalCost) * 100

      setResult({ pulls, totalValue, totalSpent: totalCost, roi, hits, bestPull })
      setIsSimulating(false)
    }, 600)
  }, [packCount, totalCost])

  const reset = () => setResult(null)

  // Summary stats
  const hitRate = result ? (result.hits.length / (packCount)) : 0
  const uniquePlayers = result ? new Set(result.pulls.map(p => p.playerName)).size : 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Pack Simulator</h1>
        <p className="text-gray-400 text-sm mt-1">Simulate pack breaks and probability modeling</p>
      </div>

      {/* Config Panel */}
      <div className="card p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <label className="text-gray-400 text-xs font-medium mb-2 block">Product</label>
            <select
              value={selectedProductId}
              onChange={e => setSelectedProductId(e.target.value)}
              className="w-full bg-[#11111f] border border-[#252540] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {PRODUCTS.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-xs font-medium mb-2 block">Number of Packs</label>
            <input
              type="number"
              min={1}
              max={240}
              value={packCount}
              onChange={e => setPackCount(Math.max(1, Math.min(240, parseInt(e.target.value) || 1)))}
              className="w-full bg-[#11111f] border border-[#252540] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-col justify-end">
            <div className="text-gray-400 text-xs mb-1.5 space-y-0.5">
              <div>≈ {boxCount > 0 ? `${boxCount} box${boxCount > 1 ? 'es' : ''}` : 'less than 1 box'}</div>
              <div>Cost: <span className="text-white font-semibold">${totalCost.toLocaleString()}</span></div>
            </div>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-white font-semibold text-sm transition-all"
              style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)' }}
            >
              {isSimulating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Simulating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" fill="white" />
                  Simulate
                </>
              )}
            </button>
            {result && (
              <button onClick={reset} className="p-2 rounded-lg bg-[#1c1c30] border border-[#252540] text-gray-400 hover:text-white transition-colors">
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pack Odds Reference */}
      <div className="card p-5">
        <h3 className="text-white font-semibold mb-3">Pack Odds — {product.name}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CARD_TYPES.map(ct => (
            <div key={ct.id} className="bg-[#11111f] rounded-lg p-3">
              <div className="text-white text-xs font-medium">{ct.name}</div>
              <div className="text-gray-500 text-xs mt-0.5">{ct.odds} packs</div>
              <div className={`text-xs font-semibold mt-1 ${
                ct.rarity === 'Legendary' ? 'text-purple-400' :
                ct.rarity === 'Ultra Rare' ? 'text-cyan-400' :
                ct.rarity === 'Rare' ? 'text-blue-400' :
                ct.rarity === 'Uncommon' ? 'text-emerald-400' : 'text-gray-400'
              }`}>{ct.rarity}</div>
              {ct.printRun !== '∞' && (
                <div className="text-gray-600 text-[10px] mt-0.5">{ct.printRun}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultStat
              icon={<DollarSign className="w-4 h-4" />}
              label="Total Pull Value"
              value={`$${Math.round(result.totalValue).toLocaleString()}`}
              sub={`Spent $${result.totalSpent.toLocaleString()}`}
              color={result.totalValue >= result.totalSpent ? 'text-emerald-400' : 'text-red-400'}
            />
            <ResultStat
              icon={<TrendingUp className="w-4 h-4" />}
              label="ROI"
              value={`${result.roi >= 0 ? '+' : ''}${Math.round(result.roi)}%`}
              sub={result.roi >= 0 ? 'Profitable break' : 'Below cost'}
              color={result.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}
            />
            <ResultStat
              icon={<Zap className="w-4 h-4" />}
              label="Hits Pulled"
              value={result.hits.length.toString()}
              sub={`${hitRate.toFixed(1)} per pack`}
              color="text-purple-400"
            />
            <ResultStat
              icon={<Package className="w-4 h-4" />}
              label="Unique Players"
              value={uniquePlayers.toString()}
              sub={`${result.pulls.length} total cards`}
              color="text-cyan-400"
            />
          </div>

          {/* Best Pull */}
          {result.bestPull && (
            <div className="card p-5 border border-yellow-700/30"
              style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.05) 0%, rgba(139,92,246,0.05) 100%)' }}>
              <div className="text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-2">🏆 Best Pull</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white text-lg font-bold">{result.bestPull.playerName}</div>
                  <div className="text-gray-400 text-sm">{result.bestPull.teamName} · {result.bestPull.cardTypeName}</div>
                </div>
                <div className="text-right">
                  <div className="text-yellow-400 text-2xl font-bold">${result.bestPull.value.toLocaleString()}</div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${RARITY_COLORS[result.bestPull.rarity]}`}>
                    {result.bestPull.rarity}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Hits List */}
          {result.hits.length > 0 && (
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-[#1e1e38]">
                <h3 className="text-white font-semibold">Hits ({result.hits.length})</h3>
              </div>
              <div className="divide-y divide-[#1a1a2e]">
                {result.hits.map((hit, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <span className="text-white text-sm font-medium">{hit.playerName}</span>
                      <span className="text-gray-500 text-sm"> · {hit.teamName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${RARITY_COLORS[hit.rarity]}`}>
                        {hit.cardTypeName}
                      </span>
                      <span className="text-cyan-400 font-bold text-sm">${hit.value.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Pulls (collapsed preview) */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1e1e38]">
              <h3 className="text-white font-semibold">Notable Pulls (top 20 by value)</h3>
            </div>
            <div className="divide-y divide-[#1a1a2e]">
              {[...result.pulls]
                .sort((a, b) => b.value - a.value)
                .slice(0, 20)
                .map((pull, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-gray-600 text-xs w-5 shrink-0">#{i + 1}</span>
                      <div className="min-w-0">
                        <span className="text-white text-sm">{pull.playerName}</span>
                        <span className="text-gray-500 text-xs ml-2">{pull.cardTypeName}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        pull.rarity === 'Legendary' ? 'bg-purple-900/40 text-purple-300' :
                        pull.rarity === 'Ultra Rare' ? 'bg-cyan-900/40 text-cyan-300' :
                        pull.rarity === 'Rare' ? 'bg-blue-900/40 text-blue-300' :
                        pull.rarity === 'Uncommon' ? 'bg-emerald-900/40 text-emerald-300' :
                        'bg-gray-800 text-gray-400'
                      }`}>
                        {pull.rarity}
                      </span>
                      <span className={`text-sm font-semibold ${pull.value >= 50 ? 'text-cyan-400' : 'text-gray-400'}`}>
                        ${pull.value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

      {/* Empty state */}
      {!result && !isSimulating && (
        <div className="card p-12 text-center">
          <Layers className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <div className="text-gray-400 font-medium mb-1">Ready to simulate</div>
          <div className="text-gray-600 text-sm">Configure your break above and click Simulate to see results</div>
        </div>
      )}
    </div>
  )
}

function ResultStat({ icon, label, value, sub, color }: {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
  color: string
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-gray-500 mb-2">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-gray-500 text-xs mt-0.5">{sub}</div>
    </div>
  )
}
