import { useState, useMemo } from 'react'
import { Search, ChevronDown, ChevronRight, Star } from 'lucide-react'
import { PLAYER_ANALYTICS, NFL_TEAMS } from '../data/mockData'
import type { PlayerAnalytics, RarityTier } from '../types'

const RARITY_COLORS: Record<RarityTier, string> = {
  Legendary: 'text-purple-400',
  'Ultra Rare': 'text-cyan-400',
  Rare: 'text-blue-400',
  Uncommon: 'text-emerald-400',
  Common: 'text-gray-400',
}

export default function PlayerBreakdown() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTeam, setSelectedTeam] = useState('all')
  const [sortBy, setSortBy] = useState<'totalEV' | 'topCard' | 'cardCount'>('totalEV')
  const [expandedPlayers, setExpandedPlayers] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    let players = [...PLAYER_ANALYTICS]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      players = players.filter(p =>
        p.playerName.toLowerCase().includes(q) ||
        p.teamName.toLowerCase().includes(q)
      )
    }
    if (selectedTeam !== 'all') {
      players = players.filter(p => p.teamId === selectedTeam)
    }
    if (sortBy === 'totalEV') players.sort((a, b) => b.totalEV - a.totalEV)
    else if (sortBy === 'topCard') players.sort((a, b) => b.topCardValue - a.topCardValue)
    else if (sortBy === 'cardCount') players.sort((a, b) => b.cards.length - a.cards.length)
    return players
  }, [searchQuery, selectedTeam, sortBy])

  const teamsWithPlayers = useMemo(() => {
    const ids = new Set(PLAYER_ANALYTICS.map(p => p.teamId))
    return NFL_TEAMS.filter(t => ids.has(t.id))
  }, [])

  function toggleExpand(playerId: string) {
    setExpandedPlayers(prev => {
      const next = new Set(prev)
      if (next.has(playerId)) next.delete(playerId)
      else next.add(playerId)
      return next
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Player Breakdown</h1>
        <p className="text-gray-400 text-sm mt-1">{filtered.length} players across all teams</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#161628] border border-[#252540] text-white text-sm rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={selectedTeam}
          onChange={e => setSelectedTeam(e.target.value)}
          className="bg-[#161628] border border-[#252540] text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="all">All Teams</option>
          {teamsWithPlayers.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="bg-[#161628] border border-[#252540] text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="totalEV">Total Value</option>
          <option value="topCard">Top Card</option>
          <option value="cardCount">Card Count</option>
        </select>
      </div>

      {/* Player List */}
      <div className="card overflow-hidden">
        {filtered.map((player, index) => {
          const isExpanded = expandedPlayers.has(player.playerId)
          const sortedCards = [...player.cards].sort((a, b) => b.estimatedValue - a.estimatedValue)

          return (
            <div key={player.playerId} className="border-b border-[#1a1a2e] last:border-0">
              {/* Player Row */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-[#1a1a2e] transition-colors"
                onClick={() => toggleExpand(player.playerId)}
              >
                {/* Rank */}
                <div className="w-8 text-center text-gray-500 text-sm font-medium shrink-0">
                  #{index + 1}
                </div>

                {/* Player Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-semibold text-sm">{player.playerName}</span>
                    {player.isStar && (
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 shrink-0" />
                    )}
                    {player.isRookie && (
                      <span className="badge-rc shrink-0">RC</span>
                    )}
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5">{player.teamName}</div>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-gray-500 text-xs">Cards</div>
                    <div className="text-white text-sm font-medium">{player.cards.length}</div>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <div className="text-gray-500 text-xs">Top Card</div>
                    <div className="text-cyan-400 text-sm font-semibold">${player.topCardValue.toLocaleString()}</div>
                  </div>
                  <div className="text-right min-w-[90px]">
                    <div className="text-gray-500 text-xs">Total EV</div>
                    <div className="text-white text-sm font-bold">${player.totalEV.toLocaleString()}</div>
                  </div>
                </div>

                {/* Expand Icon */}
                <div className="shrink-0 text-gray-500">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </div>

              {/* Expanded Card Details */}
              {isExpanded && (
                <div className="px-5 pb-4 bg-[#0f0f1e]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#1e1e38]">
                          <th className="py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Card Type</th>
                          <th className="py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rarity</th>
                          <th className="py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Odds</th>
                          <th className="py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Print Run</th>
                          <th className="py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1a1a2e]">
                        {sortedCards.map(card => (
                          <tr key={card.id} className="hover:bg-[#161628]">
                            <td className="py-2.5 text-white font-medium">{card.cardTypeName}</td>
                            <td className="py-2.5">
                              <span className={`text-xs font-semibold ${RARITY_COLORS[card.rarity]}`}>{card.rarity}</span>
                            </td>
                            <td className="py-2.5 text-gray-400">{card.odds}</td>
                            <td className="py-2.5 text-gray-400">{card.printRun}</td>
                            <td className="py-2.5 text-right text-cyan-400 font-semibold">
                              ${card.estimatedValue.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <div className="text-gray-500 text-sm">No players match your search.</div>
        </div>
      )}
    </div>
  )
}
