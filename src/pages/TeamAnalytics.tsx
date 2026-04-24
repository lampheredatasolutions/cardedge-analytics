import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { Target, TrendingUp, Star, Zap, ChevronRight } from 'lucide-react'
import { TEAM_ANALYTICS, NFL_TEAMS } from '../data/mockData'
import type { TeamAnalytics } from '../types'

const GRADIENT_COLORS = [
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a855f7', '#c026d3', '#db2777', '#e11d48', '#f43f5e',
  '#fb7185', '#fda4af',
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1c1c30] border border-[#252540] rounded-lg px-3 py-2 text-sm">
        <p className="text-gray-400 mb-1">{label}</p>
        <p className="text-cyan-400 font-semibold">${payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export default function TeamAnalyticsPage() {
  const [sortBy, setSortBy] = useState<'totalEV' | 'hitEV' | 'starCount' | 'sleeperScore'>('totalEV')
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)

  const sorted = [...TEAM_ANALYTICS].sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number))
  const bestTeam = sorted[0]
  const highestHitEV = [...TEAM_ANALYTICS].sort((a, b) => b.hitEV - a.hitEV)[0]
  const mostStars = [...TEAM_ANALYTICS].sort((a, b) => b.starCount - a.starCount)[0]
  const bestSleeper = [...TEAM_ANALYTICS].sort((a, b) => b.sleeperScore - a.sleeperScore)[0]

  const barData = sorted.slice(0, 12).map(t => ({
    name: t.teamName.split(' ').pop() ?? t.teamName,
    fullName: t.teamName,
    value: sortBy === 'totalEV' ? t.totalEV :
      sortBy === 'hitEV' ? t.hitEV :
      sortBy === 'starCount' ? t.starCount * 1000 :
      t.sleeperScore,
  }))

  const selectedTeam = selectedTeamId ? TEAM_ANALYTICS.find(t => t.teamId === selectedTeamId) : null
  const teamInfo = selectedTeamId ? NFL_TEAMS.find(t => t.id === selectedTeamId) : null

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Targeting Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Identify the best teams to chase based on value, hits, and upside</p>
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="bg-[#1c1c30] border border-[#252540] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="totalEV">Total Value</option>
          <option value="hitEV">Hit EV</option>
          <option value="starCount">Star Count</option>
          <option value="sleeperScore">Sleeper Score</option>
        </select>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <HighlightCard icon={<Target className="w-5 h-5" />} label="Best Team" value={bestTeam?.teamName.split(' ').pop() ?? ''} sub={`$${bestTeam?.totalEV.toLocaleString()} total EV`} color="text-cyan-400" bg="bg-cyan-900/20" border="border-cyan-800/30" />
        <HighlightCard icon={<TrendingUp className="w-5 h-5" />} label="Highest Hit EV" value={`$${highestHitEV?.hitEV.toLocaleString()}`} sub={highestHitEV?.teamName ?? ''} color="text-purple-400" bg="bg-purple-900/20" border="border-purple-800/30" />
        <HighlightCard icon={<Star className="w-5 h-5" />} label="Most Stars" value={mostStars?.teamName.split(' ').pop() ?? ''} sub={`${mostStars?.starCount} star players`} color="text-yellow-400" bg="bg-yellow-900/20" border="border-yellow-800/30" />
        <HighlightCard icon={<Zap className="w-5 h-5" />} label="Best Sleeper" value={bestSleeper?.teamName.split(' ').pop() ?? ''} sub="High upside, low profile" color="text-emerald-400" bg="bg-emerald-900/20" border="border-emerald-800/30" />
      </div>

      {/* Chart + Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Horizontal Bar Chart */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="text-white font-semibold mb-4">Team Rankings — {
            sortBy === 'totalEV' ? 'total value' :
            sortBy === 'hitEV' ? 'hit EV' :
            sortBy === 'starCount' ? 'star count' : 'sleeper score'
          }</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={barData}
              layout="vertical"
              margin={{ top: 0, right: 20, bottom: 0, left: 60 }}
            >
              <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => sortBy === 'totalEV' || sortBy === 'hitEV' ? `$${(v / 1000).toFixed(0)}k` : v.toString()} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {barData.map((_, index) => (
                  <Cell key={index} fill={`url(#teamGrad${index})`} opacity={0.85} />
                ))}
              </Bar>
              <defs>
                {barData.map((_, index) => (
                  <linearGradient key={index} id={`teamGrad${index}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                ))}
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Team Profile Panel */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Team Profile</h3>
            <select
              value={selectedTeamId ?? ''}
              onChange={e => setSelectedTeamId(e.target.value || null)}
              className="bg-[#1c1c30] border border-[#252540] text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="">Select team</option>
              {TEAM_ANALYTICS.map(t => (
                <option key={t.teamId} value={t.teamId}>{t.teamName}</option>
              ))}
            </select>
          </div>

          {selectedTeam ? (
            <div className="space-y-4">
              <div>
                <div className="text-xl font-bold text-white">{selectedTeam.teamName}</div>
                <div className="text-gray-400 text-sm">{teamInfo?.city}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <MiniStat label="Total EV" value={`$${selectedTeam.totalEV.toLocaleString()}`} color="text-cyan-400" />
                <MiniStat label="Hit EV" value={`$${selectedTeam.hitEV.toLocaleString()}`} color="text-purple-400" />
                <MiniStat label="Cards" value={selectedTeam.cardCount.toString()} color="text-blue-400" />
                <MiniStat label="Stars" value={selectedTeam.starCount.toString()} color="text-yellow-400" />
                <MiniStat label="Rookies" value={selectedTeam.rookieCount.toString()} color="text-orange-400" />
                <MiniStat label="Autos" value={selectedTeam.autoCount.toString()} color="text-emerald-400" />
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-2">Key Players</div>
                <div className="space-y-1">
                  {selectedTeam.players.slice(0, 5).map(name => (
                    <div key={name} className="flex items-center gap-2 text-sm text-gray-300">
                      <ChevronRight className="w-3 h-3 text-gray-600" />
                      {name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-[#252540]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Sleeper Score</span>
                  <span className="text-emerald-400 font-semibold">{selectedTeam.sleeperScore}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
              Select a team to view profile
            </div>
          )}
        </div>
      </div>

      {/* All Teams Table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1e1e38]">
          <h3 className="text-white font-semibold">All Teams Ranked</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e38]">
                {['#', 'Team', 'Total EV', 'Cards', 'Stars', 'Rookies', 'Autos', 'Hit EV', 'Sleeper'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a2e]">
              {sorted.map((team, i) => (
                <tr
                  key={team.teamId}
                  className="hover:bg-[#1a1a2e] cursor-pointer transition-colors"
                  onClick={() => setSelectedTeamId(team.teamId)}
                >
                  <td className="px-4 py-3 text-gray-500 text-sm font-medium">{i + 1}</td>
                  <td className="px-4 py-3">
                    <span className="text-white text-sm font-semibold">{team.teamName}</span>
                  </td>
                  <td className="px-4 py-3 text-cyan-400 font-semibold text-sm">${team.totalEV.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-300 text-sm">{team.cardCount}</td>
                  <td className="px-4 py-3 text-gray-300 text-sm">{team.starCount}</td>
                  <td className="px-4 py-3">
                    {team.rookieCount > 0 ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-900/40 text-orange-300 text-xs font-bold border border-orange-700/40">
                        {team.rookieCount}
                      </span>
                    ) : <span className="text-gray-500 text-sm">0</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-sm">{team.autoCount}</td>
                  <td className="px-4 py-3 text-purple-400 font-semibold text-sm">${team.hitEV.toLocaleString()}</td>
                  <td className="px-4 py-3 text-emerald-400 font-semibold text-sm">{team.sleeperScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function HighlightCard({ icon, label, value, sub, color, bg, border }: {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
  color: string
  bg: string
  border: string
}) {
  return (
    <div className={`card p-4 border ${border} bg-gradient-to-br ${bg}`}>
      <div className={`${color} mb-2`}>{icon}</div>
      <div className="text-gray-400 text-xs mb-1">{label}</div>
      <div className="text-white text-xl font-bold">{value}</div>
      <div className="text-gray-500 text-xs mt-0.5">{sub}</div>
    </div>
  )
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-[#11111f] rounded-lg p-2.5">
      <div className="text-gray-500 text-[10px] mb-1">{label}</div>
      <div className={`${color} font-bold text-sm`}>{value}</div>
    </div>
  )
}
