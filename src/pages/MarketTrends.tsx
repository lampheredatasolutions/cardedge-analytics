import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { DollarSign, BarChart2, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { MARKET_SALES, MARKET_TRENDS, PRICE_CHART_DATA } from '../data/mockData'
import type { RarityTier } from '../types'

const CARD_TYPE_FILTERS = ['All Card Types', 'Auto', 'Patch Auto', 'Numbered Parallel', 'Refractor', 'Base']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length && payload[0].value != null) {
    return (
      <div className="bg-[#1c1c30] border border-[#252540] rounded-lg px-3 py-2 text-sm">
        <p className="text-gray-400 mb-1">{label}</p>
        <p className="text-cyan-400 font-semibold">${payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export default function MarketTrends() {
  const [selectedCardType, setSelectedCardType] = useState('All Card Types')

  const totalSalesVolume = MARKET_SALES.reduce((s, sale) => s + sale.salePrice, 0)
  const avgSale = MARKET_SALES.length > 0 ? totalSalesVolume / MARKET_SALES.length : 0
  const highestSale = Math.max(...MARKET_SALES.map(s => s.salePrice))

  const filteredChartData = useMemo(() => {
    if (selectedCardType === 'All Card Types') return PRICE_CHART_DATA
    const filtered = MARKET_SALES.filter(s => s.cardType === selectedCardType)
    const dateMap = new Map<string, { sum: number; count: number }>()
    filtered.forEach(sale => {
      const existing = dateMap.get(sale.date) ?? { sum: 0, count: 0 }
      dateMap.set(sale.date, { sum: existing.sum + sale.salePrice, count: existing.count + 1 })
    })
    return PRICE_CHART_DATA.map(d => ({
      date: d.date,
      avgPrice: dateMap.has(d.date) ? Math.round(dateMap.get(d.date)!.sum / dateMap.get(d.date)!.count) : null,
    }))
  }, [selectedCardType])

  const rising = MARKET_TRENDS.filter(t => t.trend === 'rising').sort((a, b) => b.percentChange - a.percentChange)
  const declining = MARKET_TRENDS.filter(t => t.trend === 'declining').sort((a, b) => a.percentChange - b.percentChange)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Market Trends</h1>
          <p className="text-gray-400 text-sm mt-1">Track sales data, price movements, and identify opportunities</p>
        </div>
        <select
          value={selectedCardType}
          onChange={e => setSelectedCardType(e.target.value)}
          className="bg-[#1c1c30] border border-[#252540] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          {CARD_TYPE_FILTERS.map(ct => (
            <option key={ct}>{ct}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MarketStat icon={<DollarSign className="w-4 h-4" />} label="Total Sales Volume" value={`$${totalSalesVolume.toLocaleString()}`} color="text-cyan-400" bg="bg-cyan-900/20" />
        <MarketStat icon={<BarChart2 className="w-4 h-4" />} label="Average Sale" value={`$${avgSale.toFixed(2)}`} color="text-purple-400" bg="bg-purple-900/20" />
        <MarketStat icon={<TrendingUp className="w-4 h-4" />} label="Highest Sale" value={`$${highestSale.toLocaleString()}.00`} color="text-emerald-400" bg="bg-emerald-900/20" />
        <MarketStat icon={<BarChart2 className="w-4 h-4" />} label="Total Sales" value={MARKET_SALES.length.toString()} color="text-blue-400" bg="bg-blue-900/20" />
      </div>

      {/* Price Chart */}
      <div className="card p-5">
        <h3 className="text-white font-semibold mb-4">Average Sale Price Over Time</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={filteredChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e38" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#6b7280', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={d => {
                const date = new Date(d + 'T00:00:00')
                return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
              }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `$${v}`}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="avgPrice"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#06b6d4' }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Rising / Declining */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rising */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1e1e38] flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            <h3 className="text-white font-semibold">Rising Players</h3>
          </div>
          <div className="divide-y divide-[#1a1a2e]">
            {rising.map((trend, i) => (
              <div key={trend.playerId} className="flex items-center gap-3 px-5 py-3.5">
                <div className="w-6 text-center text-gray-600 text-xs font-medium">#{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium">{trend.playerName}</div>
                  <div className="text-gray-500 text-xs">{trend.salesCount} recent sales</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-semibold text-sm">${trend.avgSalePrice.toFixed(2)}</div>
                  <div className="text-emerald-400 text-xs flex items-center justify-end gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                    {trend.percentChange.toFixed(1)}%
                  </div>
                  <div className="text-gray-500 text-xs">avg sale</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Declining */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1e1e38] flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <h3 className="text-white font-semibold">Declining / Overvalued</h3>
          </div>
          <div className="divide-y divide-[#1a1a2e]">
            {declining.map((trend, i) => (
              <div key={trend.playerId} className="flex items-center gap-3 px-5 py-3.5">
                <div className="w-6 text-center text-gray-600 text-xs font-medium">#{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium">{trend.playerName}</div>
                  <div className="text-gray-500 text-xs">{trend.salesCount} recent sales</div>
                </div>
                <div className="text-right">
                  <div className="text-red-400 font-semibold text-sm">${trend.avgSalePrice.toFixed(2)}</div>
                  <div className="text-red-400 text-xs flex items-center justify-end gap-0.5">
                    <ArrowDownRight className="w-3 h-3" />
                    {Math.abs(trend.percentChange).toFixed(1)}%
                  </div>
                  <div className="text-gray-500 text-xs">avg sale</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1e1e38]">
          <h3 className="text-white font-semibold">Recent Sales</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e38]">
                {['Date', 'Player', 'Card Type', 'Rarity', 'Sale Price'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a2e]">
              {[...MARKET_SALES].reverse().slice(0, 20).map(sale => (
                <tr key={sale.id} className="hover:bg-[#1a1a2e] transition-colors">
                  <td className="px-5 py-3 text-gray-400 text-sm">{sale.date}</td>
                  <td className="px-5 py-3 text-white text-sm font-medium">{sale.playerName}</td>
                  <td className="px-5 py-3 text-gray-400 text-sm">{sale.cardType}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold ${
                      sale.rarity === 'Legendary' ? 'text-purple-400' :
                      sale.rarity === 'Ultra Rare' ? 'text-cyan-400' :
                      sale.rarity === 'Rare' ? 'text-blue-400' :
                      sale.rarity === 'Uncommon' ? 'text-emerald-400' : 'text-gray-400'
                    }`}>{sale.rarity}</span>
                  </td>
                  <td className="px-5 py-3 text-cyan-400 font-semibold text-sm">${sale.salePrice.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function MarketStat({ icon, label, value, color, bg }: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
  bg: string
}) {
  return (
    <div className={`card p-4 ${bg}`}>
      <div className={`${color} mb-2`}>{icon}</div>
      <div className="text-white text-xl font-bold">{value}</div>
      <div className="text-gray-500 text-xs mt-0.5">{label}</div>
    </div>
  )
}
