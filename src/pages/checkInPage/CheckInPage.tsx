import {
  Building2,
  AlertCircle,
} from 'lucide-react'

export default function CheckInPage() {
  const students = [
    {
      id: 1,
      name: 'João Silva',
      belt: 'Faixa Azul',
      branch: 'Trinity Centro',
      status: 'available',
    },
    {
      id: 2,
      name: 'Pedro Santos',
      belt: 'Faixa Branca',
      branch: 'Trinity Zona Norte',
      status: 'checked',
    },
    {
      id: 3,
      name: 'Lucas Costa',
      belt: 'Faixa Roxa',
      branch: 'Trinity Centro',
      status: 'no-class',
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8 space-y-10">
      {/* HEADER */}
      <header>
        <h1 className="text-2xl font-semibold">Check-in</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Registro de presença dos alunos
        </p>
      </header>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden rounded-2xl border border-red-800 bg-neutral-900 p-6">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-red-700/10" />
          <p className="text-sm text-neutral-400">Check-ins hoje</p>
          <p className="mt-2 text-3xl font-semibold">12</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-red-800 bg-neutral-900 p-6">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-red-700/10" />
          <p className="text-sm text-neutral-400">Data</p>
          <p className="mt-2 text-xl font-semibold">18 de Janeiro</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-red-800 bg-neutral-900 p-6">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-red-700/10" />
          <p className="text-sm text-neutral-400">Horário</p>
          <p className="mt-2 text-xl font-semibold">19:30</p>
        </div>
      </div>

      {/* LISTA DE ALUNOS */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Alunos disponíveis</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map(student => (
            <div
              key={student.id}
              className="relative overflow-hidden rounded-2xl border border-red-800 bg-neutral-900 p-6 transition hover:shadow-xl"
            >
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-red-700/10" />

              <div className="space-y-2">
                <p className="text-lg font-semibold">{student.name}</p>

                <p className="text-sm text-neutral-400">
                  {student.belt}
                </p>

                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <Building2 className="h-4 w-4" />
                  {student.branch}
                </div>

                {/* STATUS */}
                {student.status === 'checked' && (
                  <span className="inline-block mt-3 rounded-full bg-green-700/20 px-3 py-1 text-xs text-green-400">
                    ✓ Presente
                  </span>
                )}

                {student.status === 'available' && (
                  <button className="mt-4 w-full rounded-lg border border-red-700 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-700 hover:text-white transition">
                    Registrar Check-in
                  </button>
                )}

                {student.status === 'no-class' && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-yellow-500">
                    <AlertCircle className="h-4 w-4" />
                    Sem aula hoje
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
