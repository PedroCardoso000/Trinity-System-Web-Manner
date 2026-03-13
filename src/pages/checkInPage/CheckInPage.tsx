import { useEffect, useRef, useState } from 'react'
import {
  Building2,
  Calendar as CalendarIcon,
  Search,
  Check,
  X,
  Plus
} from 'lucide-react'

import apiCore from '../../api/apiCore'
import type { Branch } from '../../types/Branch'
import type { ClassRoom } from '../../types/ClassRoom'
import type { Student } from '../../types/Student'
import type { Attendance } from '../../types/Attendance'
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
  const [attendances, setAttendances] = useState<Attendance[]>([])

  const [selectedBranch, setSelectedBranch] = useState<number | null>(null)
  const [selectedClassRoom, setSelectedClassRoom] = useState<number | null>(null)

  const [selectedStudent, setSelectedStudent] = useState<number | null>(null)

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  const [selectedDayOfWeek, setSelectedDayOfWeek] =
    useState<DayOfWeek | ''>('')

  const [loading, setLoading] = useState(false)

  const academicId = localStorage.getItem('academic')

  const branchSelected = selectedBranch !== null
  const dateInputRef = useRef<HTMLInputElement | null>(null)

  const openDatePicker = () => {
    const input = dateInputRef.current
    if (!input) return

    const withPicker = input as HTMLInputElement & {
      showPicker?: () => void
    }

    if (typeof withPicker.showPicker === 'function') {
      withPicker.showPicker()
      return
    }

    input.focus()
    input.click()
  }


  /* ================= FILIAIS ================= */

  useEffect(() => {

    if (!academicId) return

    apiCore
      .get(`/branches/academic/${academicId}`)
      .then(res => setBranches(res.data))

  }, [academicId])

  /* ================= ALUNOS DA FILIAL ================= */

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
      academicId
    }

    if (selectedDayOfWeek) params.dayOfWeek = selectedDayOfWeek
    if (selectedDate) params.date = selectedDate

    apiCore
      .get(`/classrooms/filter`, { params })
      .then(res => setClassRooms(res.data))
      .finally(() => setLoading(false))
  }

  /* ================= LISTA DE CHAMADA ================= */

  const carregarLista = (classRoomId: number) => {

    setSelectedClassRoom(classRoomId)

    apiCore
      .get(`/attendances/classroom/${classRoomId}`)
      .then(res => setAttendances(res.data))
  }

  /* ================= CHECK-IN ================= */

  async function registrarCheckIn(alunoId: number) {

    if (!selectedClassRoom) return

    await apiCore.post(`/attendances/check-in`, null, {
      params: {
        alunoId,
        classRoomId: selectedClassRoom
      }
    })

    carregarLista(selectedClassRoom)
  }

  async function ausentarCheckIn(alunoId: number) {

    if (!selectedClassRoom) return

    await apiCore.patch(`/attendances/absent`, null, {
      params: {
        alunoId,
        classRoomId: selectedClassRoom
      }
    })

    carregarLista(selectedClassRoom)
  }

  /* ================= ADICIONAR PRESENÇA ================= */

  async function adicionarAlunoNaAula() {

    if (!selectedStudent || !selectedClassRoom) return

    await apiCore.post(`/attendances/check-in`, null, {
      params: {
        alunoId: selectedStudent,
        classRoomId: selectedClassRoom
      }
    })

    setSelectedStudent(null)

    carregarLista(selectedClassRoom)
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

        <div className="flex flex-col gap-1">

          <label className="text-xs text-neutral-400">
            Data
          </label>

          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2">

            <CalendarIcon
              onClick={openDatePicker}
              className="w-4 h-4 text-neutral-400 cursor-pointer"
            />

            <input
              ref={dateInputRef}
              type="date"
              disabled={!branchSelected}
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="date-input bg-transparent outline-none text-sm disabled:opacity-40"
            />

          </div>

        </div>

        <div className="flex flex-col gap-1">

          <label className="text-xs text-neutral-400">
            Dia da semana
          </label>

          <select
            disabled={!branchSelected}
            value={selectedDayOfWeek}
            onChange={e =>
              setSelectedDayOfWeek(e.target.value as DayOfWeek | '')
            }
            className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm disabled:opacity-40"
          >

            <option value="">Todos</option>
            <option value="MONDAY">Segunda</option>
            <option value="TUESDAY">Terça</option>
            <option value="WEDNESDAY">Quarta</option>
            <option value="THURSDAY">Quinta</option>
            <option value="FRIDAY">Sexta</option>
            <option value="SATURDAY">Sábado</option>
            <option value="SUNDAY">Domingo</option>

          </select>

        </div>

        <button
          disabled={!branchSelected}
          onClick={buscarTurmas}
          className="bg-red-700 hover:bg-red-600 px-5 py-2 rounded-lg flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >

          <Search className="w-4 h-4" />
          Buscar

        </button>

      </div>

      {loading && <Loading text="Buscando turmas..." />}

      {/* LAYOUT PRINCIPAL */}

      <div className="grid grid-cols-2 gap-10 items-start">

        {/* TURMAS */}

        <div>

          <h2 className="text-lg font-semibold mb-4">
            Turmas encontradas
          </h2>

          <div className="grid grid-cols-2 gap-4">

            {classRooms.map(aula => {

              const data = new Date(aula.dateTime)

              return (

                <div
                  key={aula.id}
                  onClick={() => carregarLista(aula.id)}
                  className={`border rounded-xl p-4 cursor-pointer transition
                  ${selectedClassRoom === aula.id
                      ? 'border-red-600 bg-red-700/10'
                      : 'border-neutral-700 hover:border-red-600'
                    }`}
                >

                  <p className="text-sm text-red-500">

                    {data.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}

                  </p>

                  <p className="font-semibold">

                    {data.toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long'
                    })}

                  </p>

                </div>

              )

            })}

          </div>

        </div>

        {/* LISTA DE CHAMADA */}

        <div>

          {selectedClassRoom && (

            <div className="space-y-6">

              <h2 className="text-xl font-semibold">
                Lista de chamada
              </h2>

              <div className="flex gap-3">

                <select
                  value={selectedStudent || ''}
                  onChange={e => setSelectedStudent(Number(e.target.value))}
                  className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2"
                >

                  <option value="">Selecionar aluno</option>

                  {students.map(student => (

                    <option key={student.id} value={student.id}>
                      {student.nome}
                    </option>

                  ))}

                </select>

                <button
                  onClick={adicionarAlunoNaAula}
                  className="bg-green-600 px-4 py-2 rounded-lg flex items-center gap-2"
                >

                  <Plus size={16} />
                  Inserir presença

                </button>

              </div>

              <div className="max-h-[500px] overflow-y-auto border border-neutral-800 rounded-lg">

                <table className="w-full">

                  <thead>

                    <tr className="border-b border-neutral-700">

                      <th className="text-left py-2 px-3">Aluno</th>
                      <th>Status</th>
                      <th>Ações</th>

                    </tr>

                  </thead>

                  <tbody>

                    {attendances.map(att => {

                      const aluno = students.find(
                        s => s.id === att.studentId
                      )

                      if (!aluno) return null

                      return (

                        <tr key={att.id} className="border-b border-neutral-800">

                          <td className="py-2 px-3">
                            {aluno.nome}
                          </td>

                          <td>{att.status}</td>

                          <td className="flex gap-3 justify-center">

                            <button
                              onClick={() => registrarCheckIn(aluno.id)}
                              className="text-green-500"
                            >
                              <Check />
                            </button>

                            <button
                              onClick={() => ausentarCheckIn(aluno.id)}
                              className="text-red-500"
                            >
                              <X />
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

      </div>

    </div>

  )

}
