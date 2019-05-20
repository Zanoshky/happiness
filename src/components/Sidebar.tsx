import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Home, History, Activity, Menu, X } from 'lucide-react'
import clsx from 'clsx'
import { useState, useEffect } from 'react'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors',
    isActive
      ? 'bg-white/10 text-white font-medium'
      : 'text-gray-400 hover:text-white hover:bg-white/5'
  )

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-400" />
          <span className="font-bold text-base tracking-tight">Happiness</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-400 hover:text-white p-1"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Backdrop */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/60"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed md:static z-30 top-0 left-0 h-full bg-gray-900 border-r border-gray-800 flex flex-col transition-transform duration-200 ease-in-out',
          'w-56 shrink-0',
          // Mobile: slide in/out
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="px-5 py-5 flex items-center gap-2">
          <Activity className="w-6 h-6 text-green-400" />
          <span className="font-bold text-lg tracking-tight">Happiness</span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <NavLink to="/" end className={navLinkClass}>
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </NavLink>

          <div className="pt-4 pb-1 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Homebases
          </div>

          <NavLink to="/homebase/1" end className={navLinkClass}>
            <Home className="w-4 h-4" />
            Prototype — Live
          </NavLink>
          <NavLink to="/homebase/1/history" className={navLinkClass}>
            <History className="w-4 h-4" />
            Prototype — History
          </NavLink>
        </nav>

        <div className="px-5 py-4 text-xs text-gray-600">v2.0.0</div>
      </aside>
    </>
  )
}
