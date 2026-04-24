import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts'
import { DollarSign, CreditCard, Star, Shield, ArrowUpRight, Layers, Users, TrendingUp, List, ArrowRight } from 'lucide-react'
import {
  getDashboardStats, TEAM_ANALYTICS, VALUE_BY_CARD_TYPE, PLAYER_ANALYTICS,
  PRODUCTS,
} from '../data/mockData'
import type { Product } from '../types'
import ProductSelector from '../components/ui/ProductSelector'

const CHART_COLORS = ['#06b6d4', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6']
const PIE_COLORS = ['#8b5cf6', '#06b6d4', '#3b82f6', '#10b981', '#f59e0b']

const CustomBarTooltip = ({ active, payload, label }: any) => {
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

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1c1c30] border border-[#252540] rounded-lg px-3 py-2 text-sm">
        <p className="text-white font-medium">{payload[0].name}</p>
        <p className="text-cyan-400">${payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0])
  const stats = getDashboardStats()
  const topTeams = TEAM_ANALYTICS.slice(0, 10)
  const topPlayers = PLAYER_ANALYTICS.slice(0, 3)

  const barData = topTeams.map((t, i) => ({
    name: t.teamName.split(' ').pop() ?? t.teamName,
    value: t.totalEV,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-400 text-sm">{selectedProduct.name} — Real-time card intelligence</span>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-900/30 border border-emerald-800/50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              +$1.2k
            </span>
          </div>
        </div>
        <ProductSelector selectedProduct={selectedProduct} onProductChange={setSelectedProduct} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<DollarSign className="w-4 h-4" />}
          label="Total Checklist Value"
          value={`$${stats.totalChecklistValue.toLocaleString()}`}
          iconColor="text-cyan-400"
          iconBg="bg-cyan-900/30"
        />
        <StatCard
          icon={<CreditCard className="w-4 h-4" />}
          label="Cards Tracked"
          value={stats.cardsTracked.toString()}
          iconColor="text-purple-400"
          iconBg="bg-purple-900/30"
        />
        <StatCard
          icon={<Star className="w-4 h-4" />}
          label="Star Players"
          value={stats.starPlayers.toString()}
          trend="+3"
          iconColor="text-yellow-400"
          iconBg="bg-yellow-900/30"
        />
        <StatCard
          icon={<Shield className="w-4 h-4" />}
          label="Teams Covered"
          value={stats.teamsCovered.toString()}
          iconColor="text-blue-400"
          iconBg="bg-blue-900/30"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* EV by Team bar chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold">Expected Value by Team</h3>
              <p className="text-gray-500 text-xs mt-0.5">Top 10 teams by total checklist value</p>
            </div>
            <Link to="/teams" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]}
                    opacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Value by card type donut */}
        <div className="card p-5">
          <div className="mb-4">
            <h3 className="text-white font-semibold">Value by Card Type</h3>
            <p className="text-gray-500 text-xs mt-0.5">Distribution of estimated value</p>
          </div>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={VALUE_BY_CARD_TYPE}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {VALUE_BY_CARD_TYPE.map((entry, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 w-full mt-2">
              {VALUE_BY_CARD_TYPE.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-gray-400">{item.name}</span>
                  </div>
                  <span className="text-gray-300 font-medium">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Highest Value Cards */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Highest Value Cards</h3>
            <Link to="/players" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              All Players <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {topPlayers.map((player, i) => {
              const topCard = player.cards.reduce((max, c) => c.estimatedValue > max.estimatedValue ? c : max, player.cards[0])
              return (
                <div key={player.playerId} className="flex items-center gap-3 py-2 border-b border-[#1e1e38] last:border-0">
                  <div className="w-7 h-7 rounded-full bg-[#252540] flex items-center justify-center text-gray-400 text-xs font-bold shrink-0">
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{player.playerName}</div>
                    <div className="text-gray-500 text-xs">{player.teamName} · {topCard?.cardTypeName}</div>
                  </div>
                  <div className="text-cyan-400 font-semibold text-sm">
                    ${topCard?.estimatedValue.toLocaleString()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-5">
          <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <QuickAction
              to="/simulator"
              icon={<Layers className="w-5 h-5" />}
              title="Pack Simulator"
              desc="Simulate box breaks"
              color="from-purple-500/20 to-purple-900/20"
              borderColor="border-purple-700/30"
              iconColor="text-purple-400"
            />
            <QuickAction
              to="/teams"
              icon={<Users className="w-5 h-5" />}
              title="Team Targeting"
              desc="Find best teams"
              color="from-cyan-500/20 to-cyan-900/20"
              borderColor="border-cyan-700/30"
              iconColor="text-cyan-400"
            />
            <QuickAction
              to="/market"
              icon={<TrendingUp className="w-5 h-5" />}
              title="Market Trends"
              desc="Track price moves"
              color="from-emerald-500/20 to-emerald-900/20"
              borderColor="border-emerald-700/30"
              iconColor="text-emerald-400"
            />
            <QuickAction
              to="/products"
              icon={<List className="w-5 h-5" />}
              title="Full Checklist"
              desc="Browse all cards"
              color="from-amber-500/20 to-amber-900/20"
              borderColor="border-amber-700/30"
              iconColor="text-amber-400"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, trend, iconColor, iconBg }: {
  icon: React.ReactNode
  label: string
  value: string
  trend?: string
  iconColor: string
  iconBg: string
}) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          <span className={iconColor}>{icon}</span>
        </div>
        {trend && (
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-900/30 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />{trend}
          </span>
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-gray-500 text-xs mt-0.5">{label}</div>
      </div>
    </div>
  )
}

function QuickAction({ to, icon, title, desc, color, borderColor, iconColor }: {
  to: string
  icon: React.ReactNode
  title: string
  desc: string
  color: string
  borderColor: string
  iconColor: string
}) {
  return (
    <Link
      to={to}
      className={`flex flex-col gap-2 p-3.5 rounded-xl border bg-gradient-to-br ${color} ${borderColor} hover:opacity-90 transition-all cursor-pointer`}
    >
      <span className={iconColor}>{icon}</span>
      <div>
        <div className="text-white text-sm font-semibold">{title}</div>
        <div className="text-gray-400 text-xs">{desc}</div>
      </div>
    </Link>
  )
}
