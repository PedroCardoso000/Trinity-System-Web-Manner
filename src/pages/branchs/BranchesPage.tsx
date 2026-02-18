import { useState } from 'react'
import { Plus, Edit, Trash2, MapPin, X } from 'lucide-react'

interface Branch {
  id: number
  name: string
  address: string
  city: string
  state: string
  country: string
  zipCode: string
  phone: string
  active: boolean
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [open, setOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)

  const emptyForm: Branch = {
    id: 0,
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    phone: '',
    active: true,
  }

  const [form, setForm] = useState<Branch>(emptyForm)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckbox = () => {
    setForm(prev => ({ ...prev, active: !prev.active }))
  }

  const openCreate = () => {
    setEditingBranch(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const openEdit = (branch: Branch) => {
    setEditingBranch(branch)
    setForm(branch)
    setOpen(true)
  }

  const handleSave = () => {
    if (!form.name || !form.city || !form.zipCode) return

    if (editingBranch) {
      setBranches(prev =>
        prev.map(b => (b.id === editingBranch.id ? form : b))
      )
    } else {
      setBranches(prev => [...prev, { ...form, id: Date.now() }])
    }

    setOpen(false)
  }

  const handleDelete = (id: number) => {
    setBranches(prev => prev.filter(b => b.id !== id))
  }

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8 space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Filiais</h1>
          <p className="text-neutral-400 text-sm">Gerenciamento das unidades</p>
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
        {branches.map(branch => (
          <div
            key={branch.id}
            className="bg-neutral-900 border border-red-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-xl font-semibold">{branch.name}</p>

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
                  className={`inline-block mt-3 px-3 py-1 rounded-full text-xs ${
                    branch.active
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
                  onClick={() => handleDelete(branch.id)}
                  className="p-2 hover:bg-red-700/20 rounded-lg"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-red-800 rounded-2xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editingBranch ? 'Editar Filial' : 'Nova Filial'}
              </h2>
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Nome *"
                value={form.name}
                onChange={handleChange}
                className="col-span-2 bg-neutral-800 p-2 rounded"
              />

              <input
                name="address"
                placeholder="Endereço"
                value={form.address}
                onChange={handleChange}
                className="col-span-2 bg-neutral-800 p-2 rounded"
              />

              <input
                name="city"
                placeholder="Cidade *"
                value={form.city}
                onChange={handleChange}
                className="bg-neutral-800 p-2 rounded"
              />

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

              <input
                name="zipCode"
                placeholder="CEP *"
                value={form.zipCode}
                onChange={handleChange}
                className="bg-neutral-800 p-2 rounded"
              />

              <input
                name="phone"
                placeholder="Telefone"
                value={form.phone}
                onChange={handleChange}
                className="col-span-2 bg-neutral-800 p-2 rounded"
              />

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
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-neutral-700 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 rounded-lg"
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
