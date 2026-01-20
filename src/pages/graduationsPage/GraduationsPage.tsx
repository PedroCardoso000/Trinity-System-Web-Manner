import {
  Clock,
  Building2,
} from 'lucide-react'

export default function GraduationsPage() {
  const students = [
    {
      id: 1,
      name: 'João Silva',
      belt: 'Faixa Azul',
      nextBelt: 'Faixa Roxa',
      branch: 'Trinity Centro',
      status: 'eligible',
      months: 26,
    },
    {
      id: 2,
      name: 'Pedro Santos',
      belt: 'Faixa Branca',
      nextBelt: 'Faixa Azul',
      branch: 'Trinity Zona Norte',
      status: 'soon',
      months: 10,
    },
    {
      id: 3,
      name: 'Lucas Costa',
      belt: 'Faixa Preta',
      branch: 'Trinity Centro',
      status: 'max',
      months: 60,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8 space-y-10">
      {/* HEADER */}
      <header>
        <h1 className="text-2xl font-semibold">Graduações</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Acompanhamento da evolução dos alunos
        </p>
      </header>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-red-800 bg-neutral-900 p-6">
          <p className="text-sm text-neutral-400">Prontos para graduar</p>
          <p className="mt-2 text-3xl font-semibold">3</p>
        </div>

        <div className="rounded-2xl border border-red-800 bg-neutral-900 p-6">
          <p className="text-sm text-neutral-400">Próximos (até 3 meses)</p>
          <p className="mt-2 text-3xl font-semibold">5</p>
        </div>

        <div className="rounded-2xl border border-red-800 bg-neutral-900 p-6">
          <p className="text-sm text-neutral-400">Total de graduações</p>
          <p className="mt-2 text-3xl font-semibold">128</p>
        </div>
      </div>

      {/* LISTA DE ALUNOS */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Alunos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {students.map(student => (
            <div
              key={student.id}
              className="rounded-2xl border border-red-800 bg-neutral-900 p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-semibold">{student.name}</p>
                  <p className="text-sm text-neutral-400">
                    {student.belt}
                    {student.nextBelt && (
                      <>
                        <span className="mx-2 text-neutral-600">→</span>
                        {student.nextBelt}
                      </>
                    )}
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-sm text-neutral-400">
                    <Building2 className="h-4 w-4" />
                    {student.branch}
                  </div>
                </div>

                {student.status === 'eligible' && (
                  <span className="rounded-full bg-green-700/20 px-3 py-1 text-xs text-green-400">
                    Pronto
                  </span>
                )}

                {student.status === 'soon' && (
                  <span className="rounded-full bg-yellow-700/20 px-3 py-1 text-xs text-yellow-400">
                    Em breve
                  </span>
                )}

                {student.status === 'max' && (
                  <span className="rounded-full bg-neutral-700/30 px-3 py-1 text-xs text-neutral-300">
                    Faixa preta
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-neutral-400">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {student.months} meses de treino
                </div>

                {student.status === 'eligible' && (
                  <button className="rounded-lg border border-red-700 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-700 hover:text-white transition">
                    Graduar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GRADUAÇÕES RECENTES */}
      <div className="rounded-2xl border border-red-800 bg-neutral-900 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Graduações recentes</h2>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <p className="font-medium">Carlos Mendes</p>
              <p className="text-neutral-400">Faixa Azul → Faixa Roxa</p>
            </div>
            <div className="text-neutral-400">12/01/2026</div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Rafael Lima</p>
              <p className="text-neutral-400">Faixa Branca → Faixa Azul</p>
            </div>
            <div className="text-neutral-400">05/01/2026</div>
          </div>
        </div>
      </div>
    </div>
  )
}
