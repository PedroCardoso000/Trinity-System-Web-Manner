import { useState } from 'react'
import { Users, Plus, Edit, Trash2 } from 'lucide-react'

type Student = {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive'
}

const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'João Silva', email: 'joao@email.com', status: 'active' },
  { id: '2', name: 'Maria Souza', email: 'maria@email.com', status: 'active' },
  { id: '3', name: 'Carlos Lima', email: 'carlos@email.com', status: 'inactive' },
]

export default function StudentsPage() {
  const [students] = useState<Student[]>(MOCK_STUDENTS)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Alunos</h1>
          <p className="text-sm text-neutral-400">
            Gerencie os alunos da Trinity Jiu-Jitsu
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium hover:bg-red-600 transition">
          <Plus className="h-4 w-4" />
          Novo aluno
        </button>
      </div>

      {/* LISTA */}
      <div className="space-y-4">
        {students.map(student => (
          <div
            key={student.id}
            className="flex items-center justify-between rounded-2xl border border-red-800 bg-neutral-900 p-5 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-700/20">
                <Users className="h-6 w-6 text-red-500" />
              </div>

              <div>
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-neutral-400">{student.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium border
                  ${
                    student.status === 'active'
                      ? 'border-green-600 text-green-400'
                      : 'border-neutral-600 text-neutral-400'
                  }
                `}
              >
                {student.status === 'active' ? 'Ativo' : 'Inativo'}
              </span>

              <button className="rounded-lg border border-neutral-700 p-2 hover:bg-neutral-800">
                <Edit className="h-4 w-4" />
              </button>

              <button className="rounded-lg border border-red-700 p-2 hover:bg-red-700">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
