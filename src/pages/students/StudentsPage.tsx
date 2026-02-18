import { useState } from 'react'
import { Users, Plus, Edit, Trash2, X } from 'lucide-react'

type Faixa =
  | 'BRANCA'
  | 'AZUL'
  | 'ROXA'
  | 'MARROM'
  | 'PRETA'

type Student = {
  id: string
  nome: string
  email: string
  telefone?: string
  anoInicioNaTrinity?: number
  faixa: Faixa
  quantidadeGraus?: number
  ativo: boolean
  userId?: number
  branchId: number
}

const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '11999999999',
    anoInicioNaTrinity: 2020,
    faixa: 'AZUL',
    quantidadeGraus: 2,
    ativo: true,
    branchId: 1,
  },
]

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Student | null>(null)

  const [form, setForm] = useState<Student>({
    id: '',
    nome: '',
    email: '',
    telefone: '',
    anoInicioNaTrinity: undefined,
    faixa: 'BRANCA',
    quantidadeGraus: 0,
    ativo: true,
    branchId: 1,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]:
        name === 'ativo'
          ? value === 'true'
          : name === 'anoInicioNaTrinity' || name === 'quantidadeGraus' || name === 'branchId'
          ? Number(value)
          : value,
    }))
  }

  function handleSubmit() {
    if (editing) {
      setStudents(prev =>
        prev.map(s => (s.id === editing.id ? { ...form, id: editing.id } : s))
      )
    } else {
      setStudents(prev => [...prev, { ...form, id: crypto.randomUUID() }])
    }

    setOpen(false)
    setEditing(null)
  }

  function handleEdit(student: Student) {
    setEditing(student)
    setForm(student)
    setOpen(true)
  }

  function handleDelete(id: string) {
    setStudents(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-8 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Alunos</h1>
          <p className="text-sm text-neutral-400">
            Gerencie os alunos da Trinity
          </p>
        </div>

        <button
          onClick={() => {
            setEditing(null)
            setForm({
              id: '',
              nome: '',
              email: '',
              telefone: '',
              anoInicioNaTrinity: undefined,
              faixa: 'BRANCA',
              quantidadeGraus: 0,
              ativo: true,
              branchId: 1,
            })
            setOpen(true)
          }}
          className="flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium hover:bg-red-600 transition"
        >
          <Plus className="h-4 w-4" />
          Novo aluno
        </button>
      </div>

      {/* LISTA */}
      <div className="space-y-4">
        {students.map(student => (
          <div
            key={student.id}
            className="flex items-center justify-between rounded-2xl border border-red-800 bg-neutral-900 p-5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-700/20">
                <Users className="h-6 w-6 text-red-500" />
              </div>

              <div>
                <p className="font-medium">{student.nome}</p>
                <p className="text-sm text-neutral-400">{student.email}</p>
                <p className="text-xs text-neutral-500">
                  Faixa: {student.faixa} • Graus: {student.quantidadeGraus}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium border ${
                  student.ativo
                    ? 'border-red-600 text-red-400'
                    : 'border-neutral-600 text-neutral-400'
                }`}
              >
                {student.ativo ? 'Ativo' : 'Inativo'}
              </span>

              <button
                onClick={() => handleEdit(student)}
                className="rounded-lg border border-neutral-700 p-2 hover:bg-neutral-800"
              >
                <Edit className="h-4 w-4" />
              </button>

              <button
                onClick={() => handleDelete(student.id)}
                className="rounded-lg border border-red-700 p-2 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-lg rounded-2xl bg-neutral-900 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {editing ? 'Editar aluno' : 'Novo aluno'}
              </h2>
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-3">
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Nome"
                className="w-full rounded-lg bg-neutral-800 p-2"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full rounded-lg bg-neutral-800 p-2"
              />

              <input
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                placeholder="Telefone"
                className="w-full rounded-lg bg-neutral-800 p-2"
              />

              <input
                type="number"
                name="anoInicioNaTrinity"
                value={form.anoInicioNaTrinity || ''}
                onChange={handleChange}
                placeholder="Ano início"
                className="w-full rounded-lg bg-neutral-800 p-2"
              />

              <select
                name="faixa"
                value={form.faixa}
                onChange={handleChange}
                className="w-full rounded-lg bg-neutral-800 p-2"
              >
                <option value="BRANCA">Branca</option>
                <option value="AZUL">Azul</option>
                <option value="ROXA">Roxa</option>
                <option value="MARROM">Marrom</option>
                <option value="PRETA">Preta</option>
              </select>

              <input
                type="number"
                name="quantidadeGraus"
                value={form.quantidadeGraus || ''}
                onChange={handleChange}
                placeholder="Quantidade de graus"
                className="w-full rounded-lg bg-neutral-800 p-2"
              />

              <select
                name="ativo"
                value={String(form.ativo)}
                onChange={handleChange}
                className="w-full rounded-lg bg-neutral-800 p-2"
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full rounded-lg bg-red-700 py-2 font-medium hover:bg-red-600"
            >
              Salvar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
