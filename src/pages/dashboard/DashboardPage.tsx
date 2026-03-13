import { Users, CheckSquare, Calendar, Award } from 'lucide-react'
import { useEffect, useState } from 'react'
import apiCore from '../../api/apiCore'
import Loading from '../../components/Loading'

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string
  value: number | string
  icon: React.ElementType
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-red-800 bg-neutral-900 p-6 shadow-lg transition hover:shadow-xl">
      {/* detalhe visual */}
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-red-700/10" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
        </div>
        <div className="rounded-xl bg-red-700/20 p-3">
          <Icon className="h-6 w-6 text-red-500" />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    activeStudents: 0,
    monthlyPresences: 0,
    lessonsToday: 0,
    monthlyBirthdays: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboard() {
      const academicId = localStorage.getItem('academic')

      if (!academicId) {
        setError('Academia não identificada.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const [activeRes, presencesRes, lessonsRes, birthdaysRes] =
          await Promise.all([
            apiCore.get(`/dashboard/${academicId}/active-alunos`),
            apiCore.get(`/dashboard/${academicId}/monthly-attendances`),
            apiCore.get(`/dashboard/${academicId}/classes-today`),
            apiCore.get(`/dashboard/${academicId}/monthly-birthdays`),
          ])

        const normalizeMetric = (data: unknown) => {
          if (typeof data === 'number') return data
          if (data && typeof data === 'object' && 'value' in data) {
            const value = (data as { value?: unknown }).value
            if (typeof value === 'number') return value
            if (typeof value === 'string') {
              const parsed = Number(value)
              if (!Number.isNaN(parsed)) return parsed
            }
          }
          return 0
        }

        setStats({
          activeStudents: normalizeMetric(activeRes.data),
          monthlyPresences: normalizeMetric(presencesRes.data),
          lessonsToday: normalizeMetric(lessonsRes.data),
          monthlyBirthdays: normalizeMetric(birthdaysRes.data),
        })
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err)
        setError('Erro ao conectar com o servidor.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Visão geral da Trinity Jiu-Jitsu
          </p>
        </div>
      </header>

      <main className="space-y-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {loading === true ? (
            // Put this in center to aling screen 
            <div className="col-span-full flex justify-center items-center py-20">
              <Loading />
            </div>
          ) : (
            <>
              <StatCard title="Alunos ativos" value={stats.activeStudents} icon={Users} />
              <StatCard title="Presenças do Mês" value={stats.monthlyPresences} icon={CheckSquare} />
              <StatCard title="Aulas de hoje" value={stats.lessonsToday} icon={Calendar} />
              <StatCard title="Aniversariantes do mês" value={stats.monthlyBirthdays} icon={Award} />
            </>
          )}
        </div>

        <div className="rounded-2xl border border-red-800 bg-neutral-900 p-6">
          <h2 className="text-lg font-semibold mb-2">Atividade recente</h2>
          <p className="text-sm text-neutral-400">
            Aqui futuramente entram check-ins recentes, aniversariantes,
            graduações ou relatórios.
          </p>
          {loading && (
            <p className="mt-3 text-sm text-neutral-400">Carregando...</p>
          )}
          {error && (
            <p className="mt-3 text-sm text-red-400">{error}</p>
          )}
        </div>
      </main>
    </div>
  )
}
