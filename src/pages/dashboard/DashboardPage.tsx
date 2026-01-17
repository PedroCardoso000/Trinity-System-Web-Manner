import { Users, CheckSquare, Calendar, Award } from 'lucide-react'

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
          <StatCard title="Alunos ativos" value={0} icon={Users} />
          <StatCard title="Presenças do Mês" value={0} icon={CheckSquare} />
          <StatCard title="Aulas de hoje" value={0} icon={Calendar} />
          <StatCard title="Aniversariantes do mês" value={0} icon={Award} />
        </div>

        <div className="rounded-2xl border border-red-800 bg-neutral-900 p-6">
          <h2 className="text-lg font-semibold mb-2">Atividade recente</h2>
          <p className="text-sm text-neutral-400">
            Aqui futuramente entram check-ins recentes, aniversariantes,
            graduações ou relatórios.
          </p>
        </div>
      </main>
    </div>
  )
}
