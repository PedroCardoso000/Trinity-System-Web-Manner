import { useEffect, useState } from 'react'
import {
  Building2,
   
  Search
  
} from 'lucide-react'

import apiCore from '../../api/apiCore'
import type { Branch } from '../../types/Branch'
import type { ClassRoom } from '../../types/ClassRoom'
import type { Student } from '../../types/Student'
import Loading from '../../components/Loading'

type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'

export default function CheckInPage() {

  const [branches, setBranches] = useState<Branch[]>([])
  const [classRooms, setClassRooms] = useState<ClassRoom[]>([])
  const [students, setStudents] = useState<Student[]>([])
  // const [attendances, setAttendances] = useState<Attendance[]>([])

  const [selectedBranch, setSelectedBranch] = useState<number | null>(null)
  const [selectedClassRoom, setSelectedClassRoom] = useState<ClassRoom | null>(null)

  const [selectedStudent, setSelectedStudent] = useState<number | null>(null)

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDayOfWeek, setSelectedDayOfWeek] =
    useState<DayOfWeek | ''>('')

  const [loading, setLoading] = useState(false)

  const academicId = localStorage.getItem('academic')

  /* ================= FILIAIS ================= */

  useEffect(() => {
    if (!academicId) return

    apiCore
      .get(`/branches/academic/${academicId}`)
      .then(res => setBranches(res.data))

  }, [academicId])

  /* ================= ALUNOS ================= */

  useEffect(() => {

    if (!selectedBranch || !academicId) return

    apiCore
      .get(`/alunos/branch/${selectedBranch}/academia/${academicId}`)
      .then(res => setStudents(res.data))

  }, [selectedBranch, academicId])

  /* ================= BUSCAR TURMAS ================= */

  const buscarTurmas = () => {

    if (!selectedBranch || !academicId) return

    setLoading(true)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = {
      branchId: selectedBranch,
      academicId,
      date: selectedDate
    }

    if (selectedDayOfWeek) params.dayOfWeek = selectedDayOfWeek

    apiCore
      .get(`/classrooms/calendar`, { params })
      .then(res => setClassRooms(res.data))
      .finally(() => setLoading(false))
  }

  /* ================= CHECK-IN ================= */

  async function registrarCheckIn(alunoId: number) {

    if (!selectedClassRoom || !selectedBranch) return

    await apiCore.post(`/classrooms/check-in`, null, {
      params: {
        alunoId,
        scheduleId: selectedClassRoom.scheduleId,
        dateTime: selectedClassRoom.dateTime,
        branchId: selectedBranch,
        academicId
      }
    })

    alert('Check-in realizado!')
  }

  async function cancelarAula() {

    if (!selectedClassRoom || !selectedBranch) return

    await apiCore.post(`/classrooms/cancel`, null, {
      params: {
        scheduleId: selectedClassRoom.scheduleId,
        dateTime: selectedClassRoom.dateTime,
        branchId: selectedBranch,
        academicId
      }
    })

    buscarTurmas()
  }

  /* ================= UI ================= */

  return (

    <div className="min-h-screen bg-black text-white px-10 py-8 space-y-10">

      <h1 className="text-2xl font-semibold">
        Check-in Geral
      </h1>

      {/* FILIAIS */}

      <div className="flex gap-4 flex-wrap">

        {branches.map(branch => (

          <button
            key={branch.id}
            onClick={() => {
              setSelectedBranch(branch.id)
              setSelectedClassRoom(null)
              setClassRooms([])
            }}
            className={`rounded-xl border px-5 py-3
            ${selectedBranch === branch.id
                ? 'border-red-600 bg-red-700/20'
                : 'border-neutral-700 bg-neutral-900'}
            `}
          >
            <Building2 className="h-4 w-4 inline mr-2" />
            {branch.name}
          </button>

        ))}

      </div>

      {/* FILTROS */}

      <div className="flex gap-4 items-end flex-wrap">

        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="bg-neutral-900 border px-3 py-2 rounded-lg"
        />

        <button
          onClick={buscarTurmas}
          className="bg-red-700 px-5 py-2 rounded-lg flex items-center gap-2"
        >
          <Search size={16} />
          Buscar
        </button>

      </div>

      {loading && <Loading text="Buscando turmas..." />}

      {/* TURMAS */}

      <div className="grid grid-cols-3 gap-4">

        {classRooms.map(aula => {

          const data = new Date(aula.dateTime)

          return (

            <div
              key={aula.scheduleId + aula.dateTime}
              onClick={() => setSelectedClassRoom(aula)}
              className="border p-4 rounded-lg cursor-pointer hover:border-red-500"
            >

              <p className="text-red-500">
                {data.toLocaleTimeString('pt-BR')}
              </p>

              <p>
                {data.toLocaleDateString('pt-BR')}
              </p>

              {aula.cancelled && (
                <p className="text-red-600 text-sm">CANCELADA</p>
              )}

            </div>

          )

        })}

      </div>

      {/* AÇÕES */}

      {selectedClassRoom && (

        <div className="space-y-4">

          <h2 className="text-lg">Ações</h2>

          <div className="flex gap-4">

            <select
              onChange={e => setSelectedStudent(Number(e.target.value))}
              className="bg-neutral-900 px-3 py-2 rounded-lg"
            >
              <option>Selecionar aluno</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>

            <button
              onClick={() => registrarCheckIn(selectedStudent!)}
              className="bg-green-600 px-4 py-2 rounded-lg"
            >
              Check-in
            </button>

            <button
              onClick={cancelarAula}
              className="bg-red-600 px-4 py-2 rounded-lg"
            >
              Cancelar aula
            </button>

          </div>

        </div>

      )}

    </div>

  )
}