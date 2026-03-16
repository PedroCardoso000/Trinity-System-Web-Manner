import { useEffect, useState } from "react"
import { Building2 } from "lucide-react"
import apiCore from "../../api/apiCore"
import Loading from "../../components/Loading"

const belts = ["BRANCA", "AZUL", "ROXA", "MARROM", "PRETA"]

type Aluno = {
  id: number
  nome: string
  belt: string
  quantityDegree: number
  branchId: number
  academicId: number
  branchName: string
  ativo: boolean
}

type GraduationHistory = {
  id: number
  dataGraduacao: string
  faixa: string
  quantidadeGraus: number
  observacao: string
  alunoNome: string
  branchNome: string
  academicNome: string
}

export default function GraduationsPage() {
  const [students, setStudents] = useState<Aluno[]>([])
  const [history, setHistory] = useState<GraduationHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [editingStudent, setEditingStudent] = useState<Aluno | null>(null)
  const [editBelt, setEditBelt] = useState<string>("")
  const [editDegree, setEditDegree] = useState<number>(0)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const academicId = localStorage.getItem("academic")
        if (!academicId) return

        const [studentsResponse, historyResponse] = await Promise.all([
          apiCore.get(`/alunos/academia/${Number(academicId)}`),
          apiCore.get(`/alunos/graduation-history/all/${Number(academicId)}`),
        ])

        setStudents(studentsResponse.data)
        console.log(studentsResponse.data);
        
        setHistory(historyResponse.data)
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  function openEdit(student: Aluno) {
    setEditingStudent(student)
    setEditBelt(student.belt)
    setEditDegree(student.quantityDegree)
  }

  async function saveEdit() {
    if (!editingStudent) return

    try {
      await apiCore.patch("/alunos/faixa-aluno", {
        id: editingStudent.id,
        faixa: editBelt,
        quantidadeGraus: editDegree,
      })

      setStudents(prev =>
        prev.map(s =>
          s.id === editingStudent.id
            ? { ...s, faixa: editBelt, quantidadeGraus: editDegree }
            : s
        )
      )

      setEditingStudent(null)

      const historyResponse = await apiCore.get(
        "/alunos/graduation-history/all"
      )
      setHistory(historyResponse.data)
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error)
    }
  }

  function getMaxDegrees(belt: string) {
    if (belt === "PRETA") return 6
    return 4
  }

  async function graduate(student: Aluno) {
    const currentIndex = belts.indexOf(student.belt)
    if (currentIndex === belts.length - 1) return

    const newBelt = belts[currentIndex + 1]

    try {
      await apiCore.patch("/alunos/faixa-aluno", {
        id: student.id,
        faixa: newBelt,
        quantidadeGraus: 0,
      })

      setStudents(prev =>
        prev.map(s =>
          s.id === student.id
            ? { ...s, belt: newBelt, quantidadeGraus: 0 }
            : s
        )
      )

      const historyResponse = await apiCore.get(
        "/alunos/graduation-history/all"
      )
      setHistory(historyResponse.data)
    } catch (error) {
      console.error("Erro ao graduar:", error)
    }
  }

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold text-white">Graduações</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Acompanhamento da evolução dos alunos
        </p>
      </header>

      {/* LISTA DE ALUNOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-20">
            <Loading text="Carregando alunos e histórico..." />
          </div>
        ) : students.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-neutral-500 italic">
              Nenhum aluno encontrado.
            </p>
          </div>
        ) : (
          students.map(student => (
            <div
              key={student.id}
              className="rounded-2xl border border-red-800 bg-neutral-900 p-6 space-y-4"
            >
              <div>
                <p className="text-lg font-semibold">{student.nome}</p>

                <div className="mt-4 flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center rounded-full border border-red-700 px-3 py-1 text-xs font-medium text-red-300">
                    {student.belt}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-neutral-700 px-3 py-1 text-xs font-medium text-neutral-300">
                    Grau - {student.quantityDegree}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-neutral-400">
                  <Building2 className="h-4 w-4" />
                  {student.branchName}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-neutral-400">
                {student.belt !== "PRETA" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(student)}
                      className="rounded-lg border border-red-700 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-700 hover:text-white transition"
                    >
                      Atualizar
                    </button>
                    <button
                      onClick={() => graduate(student)}
                      className="rounded-lg border border-red-700 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-700 hover:text-white transition"
                    >
                      Graduar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* HISTÓRICO REAL DO BACKEND */}
      <div className="rounded-2xl border border-red-800 bg-neutral-900 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Histórico de Graduação</h2>

        {loading ? (
          <p className="text-sm text-neutral-500 animate-pulse">
            Carregando histórico...
          </p>
        ) : history.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Nenhuma graduação registrada ainda.
          </p>
        ) : (
          history.map(item => (
            <div
              key={item.id}
              className="flex justify-between border-b border-neutral-800 pb-3 text-sm"
            >
              <div>
                <p className="font-medium">{item.alunoNome}</p>
                <p className="text-neutral-400">
                  {item.faixa} • Grau {item.quantidadeGraus}
                </p>
                <p className="text-neutral-500 text-xs">
                  {item.branchNome} — {item.academicNome}
                </p>
              </div>
              <div className="text-neutral-400">
                {new Date(item.dataGraduacao).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl border border-red-800 bg-neutral-900 p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Atualizar graduação
              </h2>
              <p className="mt-1 text-sm text-neutral-400">
                {editingStudent.nome}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs text-neutral-400">Faixa</label>
                <select
                  value={editBelt}
                  onChange={e => setEditBelt(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white"
                >
                  {belts.map(belt => (
                    <option key={belt} value={belt}>
                      {belt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-neutral-400">Grau</label>
                <select
                  value={editDegree}
                  onChange={e => setEditDegree(Number(e.target.value))}
                  className="mt-1 block w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white"
                >
                  {Array.from(
                    { length: getMaxDegrees(editBelt) + 1 },
                    (_, i) => i
                  ).map(degree => (
                    <option key={degree} value={degree}>
                      {degree}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingStudent(null)}
                className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 hover:bg-neutral-800 transition"
              >
                Cancelar
              </button>
              <button
                onClick={saveEdit}
                className="rounded-lg border border-red-700 bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 transition"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}