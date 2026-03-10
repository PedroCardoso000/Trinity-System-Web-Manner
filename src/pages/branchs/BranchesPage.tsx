import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, MapPin, X } from 'lucide-react'
import apiCore from '../../api/apiCore'
import Loading from '../../components/Loading'
import ConfirmModal from '../../components/ConfirmModal'
import {
  onlyLetters,
  onlyNumbers,
  formatPhone,
  formatZipCode,
} from '../../hooks/validation/Fields'
import type { Branch } from '@/types/Branch'



export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<string | null>(null)

  const emptyForm: Branch = {
    id: 0,
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    number: '',
    zipCode: '',
    phone: '',
    active: true,
  }

  const [form, setForm] = useState<Branch>(emptyForm)

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let newValue = value

    if (['name', 'address', 'city', 'state', 'country'].includes(name)) {
      newValue = onlyLetters(value)
    }

    if (name === 'number') newValue = onlyNumbers(value)
    if (name === 'zipCode') newValue = formatZipCode(value)
    if (name === 'phone') newValue = formatPhone(value)

    setForm(prev => ({ ...prev, [name]: newValue }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleCheckbox = () => {
    setForm(prev => ({ ...prev, active: !prev.active }))
  }

  const closeModal = () => {
    setOpen(false)
    setForm(emptyForm)
    setEditingBranch(null)
    setErrors({})
  }

  const openCreate = () => {
    setEditingBranch(null)
    setForm(emptyForm)
    setErrors({})
    setOpen(true)
  }

  const openEdit = (branch: Branch) => {
    setEditingBranch(branch)
    setForm(branch)
    setErrors({})
    setOpen(true)
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!form.name.trim()) newErrors.name = 'Nome obrigatório'
    if (!form.city.trim()) newErrors.city = 'Cidade obrigatória'

    if (!form.zipCode.trim()) {
      newErrors.zipCode = 'CEP obrigatório'
    } else if (form.zipCode.replace(/\D/g, '').length !== 8) {
      newErrors.zipCode = 'CEP inválido'
    }

    if (form.phone && form.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Telefone inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    const academicId = localStorage.getItem('academic')
    if (!academicId) {
      showToast('Academia não identificada.')
      return
    }

    setSaving(true)

    try {
      if (editingBranch) {
        await apiCore.put(`/branches/${editingBranch.id}`, {
          ...form,
          academicId: Number(academicId),
        })
        showToast('Filial atualizada com sucesso!')
      } else {
        await apiCore.post(`/branches`, {
          name: form.name,
          address: form.address,
          city: form.city,
          state: form.state,
          country: form.country,
          number: form.number,
          zipCode: form.zipCode,
          phone: form.phone,
          active: form.active,
          academicId: Number(academicId),
        })
        showToast('Filial criada com sucesso!')
      }

      const response = await apiCore.get(
        `/branches/academic/${academicId}`
      )

      setBranches(response.data)
      closeModal()
    } catch (error) {
      console.error('Erro ao salvar filial', error)
      showToast('Erro ao salvar filial.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return

    try {
      await apiCore.delete(`/branches/${deletingId}`)
      setBranches(prev => prev.filter(b => b.id !== deletingId))
      showToast('Filial removida com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar', error)
      showToast('Erro ao deletar filial.')
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true)
      try {
        const academicId = localStorage.getItem('academic')
        if (!academicId) return

        const response = await apiCore.get(
          `/branches/academic/${academicId}`
        )

        setBranches(response.data)
      } catch (error) {
        console.error('Erro ao buscar filiais', error)
        showToast('Erro ao buscar filiais.')
      } finally {
        setLoading(false)
      }
    }

    fetchBranches()
  }, [])

  const isFormValid =
    form.name &&
    form.city &&
    form.zipCode &&
    form.zipCode.replace(/\D/g, '').length === 8

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8 space-y-10">

      {toast && (
        <div className="fixed top-5 right-5 bg-red-700 px-4 py-2 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}

      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Filiais</h1>
          <p className="text-neutral-400 text-sm">
            Gerenciamento das unidades
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg text-sm"
        >
          <Plus className="h-4 w-4" />
          Nova filial
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-20">
            <Loading text="Buscando filiais..." />
          </div>
        ) : branches.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-neutral-500 italic">
              Nenhuma filial cadastrada.
            </p>
          </div>
        ) : (
          branches.map(branch => (
            <div
              key={branch.id}
              className="bg-neutral-900 border border-red-800 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-xl font-semibold">
                    {branch.name}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-neutral-400 mt-1">
                    <MapPin className="h-4 w-4" />
                    {branch.address}, {branch.city}
                  </div>

                  <p className="text-sm text-neutral-500 mt-1">
                    {branch.state} - {branch.country}
                  </p>

                  <p className="text-sm text-neutral-500">
                    CEP: {branch.zipCode}
                  </p>

                  <p className="text-sm text-neutral-500">
                    Tel: {branch.phone}
                  </p>

                  <span
                    className={`inline-block mt-3 px-3 py-1 rounded-full text-xs ${branch.active
                      ? 'bg-red-700/20 text-red-400'
                      : 'bg-neutral-700/20 text-neutral-400'
                      }`}
                  >
                    {branch.active ? 'Ativa' : 'Inativa'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(branch)}
                    className="p-2 hover:bg-neutral-800 rounded-lg"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setDeletingId(branch.id)}
                    className="p-2 hover:bg-red-700/20 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-red-800 rounded-2xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editingBranch ? 'Editar Filial' : 'Nova Filial'}
              </h2>
              <button onClick={closeModal}>
                <X />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="col-span-2">
                <input
                  name="name"
                  placeholder="Nome *"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full bg-neutral-800 p-2 rounded border ${errors.name ? 'border-red-500' : 'border-transparent'
                    }`}
                />
                {errors.name && (
                  <span className="text-red-500 text-xs">
                    {errors.name}
                  </span>
                )}
              </div>

              <input
                name="address"
                placeholder="Endereço"
                value={form.address}
                onChange={handleChange}
                className="bg-neutral-800 p-2 rounded"
              />

              <input
                name="number"
                placeholder="Número"
                value={form.number}
                onChange={handleChange}
                className="bg-neutral-800 p-2 rounded"
              />

              <div>
                <input
                  name="city"
                  placeholder="Cidade *"
                  value={form.city}
                  onChange={handleChange}
                  className={`w-full bg-neutral-800 p-2 rounded border ${errors.city ? 'border-red-500' : 'border-transparent'
                    }`}
                />
                {errors.city && (
                  <span className="text-red-500 text-xs">
                    {errors.city}
                  </span>
                )}
              </div>

              <input
                name="state"
                placeholder="Estado"
                value={form.state}
                onChange={handleChange}
                className="bg-neutral-800 p-2 rounded"
              />

              <input
                name="country"
                placeholder="País"
                value={form.country}
                onChange={handleChange}
                className="bg-neutral-800 p-2 rounded"
              />

              <div>
                <input
                  name="zipCode"
                  placeholder="CEP *"
                  value={form.zipCode}
                  onChange={handleChange}
                  className={`w-full bg-neutral-800 p-2 rounded border ${errors.zipCode
                    ? 'border-red-500'
                    : 'border-transparent'
                    }`}
                />
                {errors.zipCode && (
                  <span className="text-red-500 text-xs">
                    {errors.zipCode}
                  </span>
                )}
              </div>

              <div className="col-span-2">
                <input
                  name="phone"
                  placeholder="Telefone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`w-full bg-neutral-800 p-2 rounded border ${errors.phone
                    ? 'border-red-500'
                    : 'border-transparent'
                    }`}
                />
                {errors.phone && (
                  <span className="text-red-500 text-xs">
                    {errors.phone}
                  </span>
                )}
              </div>

              <label className="col-span-2 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={handleCheckbox}
                />
                Filial ativa
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-neutral-700 rounded-lg"
              >
                Cancelar
              </button>

              <button
                onClick={handleSave}
                disabled={!isFormValid || saving}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 rounded-lg disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Excluir Filial"
        message="Tem certeza que deseja excluir esta filial? Esta ação não pode ser desfeita e removerá todos os dados vinculados a ela."
        confirmText="Sim, excluir"
        cancelText="Não, cancelar"
      />
    </div>
  )
}