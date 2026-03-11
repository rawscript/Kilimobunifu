import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Map, BarChart3, Settings, LogOut, Bell } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Sidebar() {
  const { user, logout } = useAuth()

  const navItems = [
    { name: 'Overview', path: '/dashboard/overview', icon: LayoutDashboard },
    { name: 'Map View', path: '/dashboard/map', icon: Map },
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ]

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 glass-heavy rounded-none border-y-0 border-l-0 z-40 flex flex-col pt-6 pb-6 px-4">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 rounded-full bg-navy/5 p-1 flex items-center justify-center overflow-hidden">
          <img src="/favicon.svg" alt="Kilimo Bunifu Logo" className="w-full h-full object-cover rounded-full drop-shadow-sm" />
        </div>
        <div>
          <h2 className="text-navy font-bold text-lg leading-tight">Kilimo Bunifu</h2>
          <p className="text-xs text-slate-brand font-medium">Agronomist Platform</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
              ${isActive
                ? 'bg-sky-brand/10 text-sky-brand'
                : 'text-slate-brand hover:bg-white/50 hover:text-navy'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User & Actions */}
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-4 px-2">
           <button className="relative p-2 text-slate-brand hover:text-navy transition-colors rounded-xl hover:bg-white/50 w-full flex items-center gap-3">
             <div className="relative">
               <Bell className="w-5 h-5" />
               <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-critical border-2 border-white"></span>
             </div>
             <span className="font-semibold text-sm">Notifications</span>
           </button>
        </div>
        <div className="glass-card p-3 flex items-center gap-3 mb-2 bg-white/40">
           <div className="w-10 h-10 rounded-full bg-slate-300 overflow-hidden flex-shrink-0">
             <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=3498DB&color=fff`} alt="avatar" className="w-full h-full object-cover" />
           </div>
           <div className="overflow-hidden">
             <p className="font-semibold text-sm text-navy truncate">{user?.name || 'Guest'}</p>
             <p className="text-xs text-slate-brand truncate">{user?.role || 'Agronomist'}</p>
           </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-brand hover:bg-critical/10 hover:text-critical transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
