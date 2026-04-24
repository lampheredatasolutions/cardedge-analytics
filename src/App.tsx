import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import ProductExplorer from './pages/ProductExplorer'
import TeamAnalytics from './pages/TeamAnalytics'
import PlayerBreakdown from './pages/PlayerBreakdown'
import PackSimulator from './pages/PackSimulator'
import MarketTrends from './pages/MarketTrends'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductExplorer />} />
          <Route path="teams" element={<TeamAnalytics />} />
          <Route path="players" element={<PlayerBreakdown />} />
          <Route path="simulator" element={<PackSimulator />} />
          <Route path="market" element={<MarketTrends />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
