import {
  MapPin,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react'

export default function BranchesPage() {
  const branches = [
    {
      id: 1,
      name: 'Trinity Centro',
      address: 'Rua das Lutas, 123',
      status: 'Ativa',
    },
    {
      id: 2,
      name: 'Trinity Zona Norte',
      address: 'Av. dos Guerreiros, 456',
      status: 'Ativa',
    },
    {
      id: 3,
      name: 'Trinity Zona Sul',
      address: 'Rua do Tatame, 789',
      status: 'Inativa',
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8 space-y-10">
      {/* HEADER */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Filiais</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Unidades da Trinity Jiu-Jitsu
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-lg border border-red-700 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-700 hover:text-white transition">
          <Plus className="h-4 w-4" />
          Nova filial
        </button>
      </header>

      {/* LISTA DE FILIAIS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {branches.map(branch => (
          <div
            key={branch.id}
            className="relative overflow-hidden rounded-2xl border border-red-800 bg-neutral-900 p-6 shadow-lg transition hover:shadow-xl"
          >
            {/* detalhe visual */}
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-red-700/10" />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-400">Filial</p>
                <p className="mt-1 text-xl font-semibold">
                  {branch.name}
                </p>

                <div className="mt-2 flex items-center gap-2 text-sm text-neutral-400">
                  <MapPin className="h-4 w-4" />
                  {branch.address}
                </div>

                <span
                  className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    branch.status === 'Ativa'
                      ? 'bg-green-700/20 text-green-400'
                      : 'bg-neutral-700/20 text-neutral-400'
                  }`}
                >
                  {branch.status}
                </span>
              </div>

              {/* AÇÕES */}
              <div className="flex gap-2">
                <button className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="rounded-lg p-2 text-neutral-400 hover:bg-red-700/20 hover:text-red-500 transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
