/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { Building2 } from "lucide-react"
import apiCore from '../../api/apiCore'

const belts = [
  "BRANCA",
  "AZUL",
  "ROXA",
  "MARROM",
  "PRETA",
]

type Aluno = {
  id: number
  nome: string
  faixa: string
  quantidadeGraus: number
  branchId: number
  academicId: number
  ativo: boolean
}

export default function GraduationsPage() {
  const [students, setStudents] = useState<Aluno[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [editingStudent, setEditingStudent] = useState<Aluno | null>(null)
  const [editBelt, setEditBelt] = useState<string>("")
  const [editDegree, setEditDegree] = useState<number>(0)

  // ============================
  // Buscar alunos do backend
  // ============================
  useEffect(() => {
    async function fetchAlunos() {
      try {
        const academicId = localStorage.getItem("academic") // depois pode pegar do token
        if (!academicId) {
          console.error("academicId não encontrado no localStorage")
          return
        }
        const response = await apiCore.get(
          `/alunos/academia/${Number(academicId)}`
        )
        setStudents(response.data)
      } catch (error) {
        console.error("Erro ao buscar alunos:", error)
      }
    }

    fetchAlunos()
  }, [])

  // ============================
  // Abrir modal
  // ============================
  function openEdit(student: Aluno) {
    setEditingStudent(student)
    setEditBelt(student.faixa)
    setEditDegree(student.quantidadeGraus)
  }

  // ============================
  // Salvar edição
  // ============================
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
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error)
    }
  }

  // ============================
  // Graduar aluno
  // ============================
  async function graduate(student: Aluno) {
    const currentIndex = belts.indexOf(student.faixa)
    if (currentIndex === belts.length - 1) return

    const newBelt = belts[currentIndex + 1]
    const today = new Date().toLocaleDateString()

    try {
      await apiCore.patch("/alunos/faixa-aluno", {
        id: student.id,
        faixa: newBelt,
        quantidadeGraus: 0,
      })

      setHistory(prev => [
        {
          name: student.nome,
          from: student.faixa,
          to: newBelt,
          date: today,
        },
        ...prev,
      ])

      setStudents(prev =>
        prev.map(s =>
          s.id === student.id
            ? { ...s, faixa: newBelt, quantidadeGraus: 0 }
            : s
        )
      )
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
        {students.map(student => (
          <div
            key={student.id}
            className="rounded-2xl border border-red-800 bg-neutral-900 p-6 space-y-4"
          >
            <div>
              <p className="text-lg font-semibold">{student.nome}</p>

              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center rounded-full border border-red-700 px-3 py-1 text-xs font-medium text-red-300">
                  {student.faixa}
                </span>
                <span className="inline-flex items-center rounded-full border border-neutral-700 px-3 py-1 text-xs font-medium text-neutral-300">
                  Grau {student.quantidadeGraus}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-neutral-400">
                <Building2 className="h-4 w-4" />
                Branch {student.branchId}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-neutral-400">
              {student.faixa !== "FAIXA_PRETA" && (
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
        ))}
      </div>

      {/* HISTÓRICO */}
      <div className="rounded-2xl border border-red-800 bg-neutral-900 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Graduações recentes</h2>

        {history.length === 0 && (
          <p className="text-sm text-neutral-500">
            Nenhuma graduação registrada ainda.
          </p>
        )}

        {history.map((item, index) => (
          <div
            key={index}
            className="flex justify-between border-b border-neutral-800 pb-3 text-sm"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-neutral-400">
                {item.from} → {item.to}
              </p>
            </div>
            <div className="text-neutral-400">{item.date}</div>
          </div>
        ))}
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
                  {[0, 1, 2, 3, 4].map(degree => (
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