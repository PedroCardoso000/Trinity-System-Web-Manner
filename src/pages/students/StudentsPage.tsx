import { useEffect, useState } from 'react'
import { Users, Plus, Edit, Trash2, X } from 'lucide-react'
import apiCore from '../../api/apiCore'
import Loading from '../../components/Loading'

type Faixa =
  | 'BRANCA'
  | 'AZUL'
  | 'ROXA'
  | 'MARROM'
  | 'PRETA'

type Student = {
  id: number
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

type Branch = {
  id: number
  name: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Student | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<string | null>(null)

  const emptyForm: Student = {
    id: 0,
    nome: '',
    email: '',
    telefone: '',
    anoInicioNaTrinity: undefined,
    faixa: 'BRANCA',
    quantidadeGraus: 0,
    ativo: true,
    branchId: 0,
  }

  const [form, setForm] = useState<Student>(emptyForm)

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const closeModal = () => {
    setOpen(false)
    setEditing(null)
    setForm(emptyForm)
    setErrors({})
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]:
        name === 'ativo'
          ? value === 'true'
          : name === 'anoInicioNaTrinity' ||
            name === 'quantidadeGraus' ||
            name === 'branchId'
          ? Number(value)
          : value,
    }))

    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!form.nome.trim()) newErrors.nome = 'Nome obrigatório'
    if (!form.email.trim()) newErrors.email = 'Email obrigatório'
    if (!form.branchId) newErrors.branchId = 'Filial obrigatória'

    if (form.email && !form.email.includes('@'))
      newErrors.email = 'Email inválido'

    if (
      form.telefone &&
      form.telefone.replace(/\D/g, '').length < 10
    )
      newErrors.telefone = 'Telefone inválido'

    if (
      form.anoInicioNaTrinity &&
      form.anoInicioNaTrinity < 1900
    )
      newErrors.anoInicioNaTrinity = 'Ano inválido'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const fetchData = async () => {
    try {
      const academicId = localStorage.getItem('academic')
      if (!academicId) return

      const [studentsRes, branchesRes] = await Promise.all([
        apiCore.get(`/alunos/academia/${academicId}`),
        apiCore.get(`/branches/academic/${academicId}`),
      ])

      setStudents(studentsRes.data)
      setBranches(branchesRes.data)
    } catch (error) {
      console.error(error)
      showToast('Erro ao carregar dados.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async () => {
    if (!validate()) return

    const academicId = localStorage.getItem('academic')
    if (!academicId) {
      showToast('Academia não identificada.')
      return
    }

    setSaving(true)

    try {
      if (editing) {
        await apiCore.put(`/alunos/${editing.id}`, {
          ...form,
          academicId: Number(academicId),
        })
        showToast('Aluno atualizado com sucesso!')
      } else {
        await apiCore.post(`/alunos`, {
          ...form,
          academicId: Number(academicId),
        })
        showToast('Aluno criado com sucesso!')
      }

      await fetchData()
      closeModal()
    } catch (error) {
      console.error(error)
      showToast('Erro ao salvar aluno.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      'Tem certeza que deseja excluir este aluno?'
    )
    if (!confirmDelete) return

    try {
      await apiCore.delete(`/alunos/${id}`)
      setStudents(prev => prev.filter(s => s.id !== id))
      showToast('Aluno removido com sucesso!')
    } catch (error) {
      console.error(error)
      showToast('Erro ao deletar aluno.')
    }
  }

  const isFormValid =
    form.nome &&
    form.email &&
    form.branchId !== 0

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8 space-y-8">

      {toast && (
        <div className="fixed top-5 right-5 bg-red-700 px-4 py-2 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Alunos</h1>
          <p className="text-sm text-neutral-400">
            Gerencie os alunos da academia
          </p>
        </div>

        <button
          onClick={() => {
            setEditing(null)
            setForm(emptyForm)
            setOpen(true)
          }}
          className="flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2 text-sm hover:bg-red-600"
        >
          <Plus className="h-4 w-4" />
          Novo aluno
        </button>
      </div>

      {loading ? (
        <Loading text="Carregando alunos..." />
      ) : students.length === 0 ? (
        <p className="text-neutral-500 italic">
          Nenhum aluno cadastrado.
        </p>
      ) : (
        students.map(student => (
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
                <p className="text-sm text-neutral-400">
                  {student.email}
                </p>
                <p className="text-xs text-neutral-500">
                  Faixa: {student.faixa} • Graus: {student.quantidadeGraus}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs border ${
                  student.ativo
                    ? 'border-red-600 text-red-400'
                    : 'border-neutral-600 text-neutral-400'
                }`}
              >
                {student.ativo ? 'Ativo' : 'Inativo'}
              </span>

              <button
                onClick={() => {
                  setEditing(student)
                  setForm(student)
                  setOpen(true)
                }}
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
        ))
      )}

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-lg rounded-2xl bg-neutral-900 p-6 space-y-4">

            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {editing ? 'Editar aluno' : 'Novo aluno'}
              </h2>
              <button onClick={closeModal}>
                <X />
              </button>
            </div>

            <div className="space-y-3">

              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Nome *"
                className="w-full rounded-lg bg-neutral-800 p-2"
              />
              {errors.nome && (
                <span className="text-red-500 text-xs">
                  {errors.nome}
                </span>
              )}

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email *"
                className="w-full rounded-lg bg-neutral-800 p-2"
              />
              {errors.email && (
                <span className="text-red-500 text-xs">
                  {errors.email}
                </span>
              )}

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
                name="branchId"
                value={form.branchId}
                onChange={handleChange}
                className="w-full rounded-lg bg-neutral-800 p-2"
              >
                <option value={0}>Selecione a filial *</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              {errors.branchId && (
                <span className="text-red-500 text-xs">
                  {errors.branchId}
                </span>
              )}

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
              disabled={!isFormValid || saving}
              className="w-full rounded-lg bg-red-700 py-2 font-medium hover:bg-red-600 disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}