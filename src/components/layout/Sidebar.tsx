import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Compass,
  Users,
  User,
  Layers,
  TrendingUp,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/products', label: 'Product Explorer', icon: Compass },
  { path: '/teams', label: 'Team Analytics', icon: Users },
  { path: '/players', label: 'Player Breakdown', icon: User },
  { path: '/simulator', label: 'Pack Simulator', icon: Layers },
  { path: '/market', label: 'Market Trends', icon: TrendingUp },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <aside
      className={`flex flex-col bg-[#0f0f1e] border-r border-[#1e1e38] transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-56'
      } shrink-0 relative`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-[#1e1e38] ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)' }}>
          <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-white font-bold text-sm leading-tight">CardEdge</div>
            <div className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase">Analytics</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path
          return (
            <NavLink
              key={path}
              to={path}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1c1c32]'
              } ${collapsed ? 'justify-center' : ''}`}
              style={isActive ? { background: 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(139,92,246,0.2) 100%)', borderLeft: '2px solid #06b6d4' } : {}}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300'}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-[#1e1e38] p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-[#1c1c32] transition-all text-xs font-medium ${collapsed ? 'justify-center' : ''}`}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
