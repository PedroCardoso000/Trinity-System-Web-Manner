import { useState } from 'react'
import { Building2, Check, X, Plus } from 'lucide-react'

/* =======================
   TIPOS (espelhando backend)
======================= */

type Branch = {
  id: number
  name: string
}

type Aula = {
  id: number
  nome: string
  dataHora: string
  branchId: number
}

type Aluno = {
  id: number
  nome: string
  faixa: string
  branchId: number
}

type Attendance = {
  id: number
  alunoId: number
  aulaId: number
  status: 'PRESENTE' | 'AUSENTE'
}

/* =======================
   MOCK DATA
======================= */

const BRANCHES: Branch[] = [
  { id: 1, name: 'Trinity Centro' },
  { id: 2, name: 'Trinity Zona Norte' },
]

const AULAS: Aula[] = [
  { id: 1, nome: 'No-Gi 19h', dataHora: '2026-01-18T19:00', branchId: 1 },
  { id: 2, nome: 'Gi 20h', dataHora: '2026-01-18T20:00', branchId: 1 },
  { id: 3, nome: 'Kids 18h', dataHora: '2026-01-18T18:00', branchId: 2 },
]

const ALUNOS: Aluno[] = [
  { id: 1, nome: 'João Silva', faixa: 'Azul', branchId: 1 },
  { id: 2, nome: 'Pedro Santos', faixa: 'Branca', branchId: 1 },
  { id: 3, nome: 'Lucas Costa', faixa: 'Roxa', branchId: 2 },
]

/* =======================
   COMPONENTE
======================= */

export default function CheckInPage() {
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null)
  const [selectedAula, setSelectedAula] = useState<number | null>(null)
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [studentToAdd, setStudentToAdd] = useState<number | null>(null)

  const aulasFiltradas = AULAS.filter(a => a.branchId === selectedBranch)
  const alunosDaFilial = ALUNOS.filter(a => a.branchId === selectedBranch)
  const presencasDaAula = attendances.filter(a => a.aulaId === selectedAula)

  function registrarCheckIn(alunoId: number) {
    setAttendances(prev => {
      const existente = prev.find(
        a => a.alunoId === alunoId && a.aulaId === selectedAula
      )

      if (existente) {
        // Atualiza status
        return prev.map(a =>
          a.alunoId === alunoId && a.aulaId === selectedAula
            ? { ...a, status: 'PRESENTE' }
            : a
        )
      }

      // Cria novo se não existir
      return [
        ...prev,
        {
          id: Date.now(),
          alunoId,
          aulaId: selectedAula!,
          status: 'PRESENTE',
        },
      ]
    })
  }


  function ausentarCheckIn(alunoId: number) {
    setAttendances(prev =>
      prev.map(a =>
        a.alunoId === alunoId && a.aulaId === selectedAula
          ? { ...a, status: 'AUSENTE' }
          : a
      )
    )
  }


  function adicionarAlunoNaAula() {
    if (!studentToAdd) return

    setAttendances(prev => {
      const jaExiste = prev.find(
        a => a.alunoId === studentToAdd && a.aulaId === selectedAula
      )

      if (jaExiste) return prev // não duplica

      return [
        ...prev,
        {
          id: Date.now(),
          alunoId: studentToAdd,
          aulaId: selectedAula!,
          status: 'PRESENTE',
        },
      ]
    })

    setStudentToAdd(null)
  }

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8 space-y-10">

      <header>
        <h1 className="text-2xl font-semibold">Check-in Geral</h1>
        <p className="text-sm text-neutral-400">
          Gerencie aulas e presenças por filial
        </p>
      </header>

      {/* ================= FILIAIS ================= */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Filiais</h2>

        <div className="flex gap-4 flex-wrap">
          {BRANCHES.map(branch => (
            <button
              key={branch.id}
              onClick={() => {
                setSelectedBranch(branch.id)
                setSelectedAula(null)
              }}
              className={`rounded-xl border px-5 py-3 transition
                ${selectedBranch === branch.id
                  ? 'border-red-600 bg-red-700/20'
                  : 'border-neutral-700 bg-neutral-900'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {branch.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ================= AULAS ================= */}
      {selectedBranch && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Aulas da Filial</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {aulasFiltradas.map(aula => (
              <div
                key={aula.id}
                onClick={() => setSelectedAula(aula.id)}
                className={`cursor-pointer rounded-2xl border p-5 transition
                  ${selectedAula === aula.id
                    ? 'border-red-600 bg-red-700/10'
                    : 'border-neutral-700 bg-neutral-900'
                  }
                `}
              >
                <p className="font-semibold">{aula.nome}</p>
                <p className="text-sm text-neutral-400">
                  {new Date(aula.dataHora).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= LISTA DE PRESENÇA ================= */}
      {selectedAula && (
        <div className="space-y-6">

          <h2 className="text-lg font-semibold">
            Lista de Presença
          </h2>

          {/* INSERIR ALUNO */}
          <div className="flex gap-3">
            <select
              className="bg-neutral-900 border border-neutral-700 rounded-lg p-2"
              value={studentToAdd || ''}
              onChange={e => setStudentToAdd(Number(e.target.value))}
            >
              <option value="">Selecionar aluno</option>
              {alunosDaFilial.map(aluno => (
                <option key={aluno.id} value={aluno.id}>
                  {aluno.nome}
                </option>
              ))}
            </select>

            <button
              onClick={adicionarAlunoNaAula}
              className="flex items-center gap-2 bg-red-700 px-4 py-2 rounded-lg hover:bg-red-600"
            >
              <Plus className="h-4 w-4" />
              Inserir aluno
            </button>
          </div>

          {/* TABELA */}
          <div className="rounded-2xl border border-neutral-700 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-neutral-900">
                <tr>
                  <th className="p-4">Aluno</th>
                  <th className="p-4">Faixa</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Ações</th>
                </tr>
              </thead>

              <tbody>
                {presencasDaAula.map(att => {
                  const aluno = ALUNOS.find(a => a.id === att.alunoId)
                  if (!aluno) return null

                  return (
                    <tr key={att.id} className="border-t border-neutral-800">
                      <td className="p-4">{aluno.nome}</td>
                      <td className="p-4">{aluno.faixa}</td>
                      <td className="p-4">
                        {att.status === 'PRESENTE' ? (
                          <span className="text-red-400">Presente</span>
                        ) : (
                          <span className="text-neutral-400">Ausente</span>
                        )}
                      </td>
                      <td className="p-4 flex gap-3">
                        <button
                          onClick={() => registrarCheckIn(aluno.id)}
                          className="bg-red-700 px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-red-600"
                        >
                          <Check className="h-4 w-4" />
                          Check-in
                        </button>

                        <button
                          onClick={() => ausentarCheckIn(aluno.id)}
                          className="border border-neutral-700 px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-neutral-800"
                        >
                          <X className="h-4 w-4" />
                          Ausentar
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
