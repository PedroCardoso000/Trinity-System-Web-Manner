import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Building2,
  CheckSquare,
  Award,
  BarChart3,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="flex h-screen w-72 flex-col bg-gradient-to-b from-black to-neutral-950 border-r border-red-900/60">
      <div className="px-6 py-6 border-b border-red-900/60 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white font-bold">
          T
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Trinity</p>
          <p className="text-xs text-neutral-300">Jiu-Jitsu Academy</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        <Item to="/" icon={LayoutDashboard} label="Dashboard" />
        <Item to="/branches" icon={Building2} label="Filiais" />
        <Item to="/students" icon={Users} label="Alunos" />
        <Item to="/checkin" icon={CheckSquare} label="Check-in" />
        <Item to="/graduations" icon={Award} label="Graduações" />
        <Item to="/reports" icon={BarChart3} label="Relatórios" />
      </nav>

      <div className="px-4 py-4 border-t border-red-900/60">
        <div className="flex items-center gap-3 rounded-xl bg-black/60 px-3 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white font-semibold">
            {user?.name?.[0] ?? 'U'}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white truncate">
              {user?.name ?? 'Usuário'}
            </p>
            <p className="text-xs text-neutral-400">
              {user?.role === 'ADMIN' ? 'Administrador' : 'Professor'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-700 px-3 py-2 text-xs font-medium text-neutral-200 hover:bg-red-700 hover:text-white transition"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}

function Item({
  to,
  icon: Icon,
  label,
}: {
  to: string
  icon: React.ElementType
  label: string
}) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `
        flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition
        ${
          isActive
            ? 'bg-red-600 text-white'
            : 'text-white/80 hover:bg-white/10'
        }
      `
      }
    >
      <Icon className="h-5 w-5" />
      {label}
    </NavLink>
  )
}
