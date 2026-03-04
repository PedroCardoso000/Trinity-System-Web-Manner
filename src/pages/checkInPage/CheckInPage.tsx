import { useEffect, useState } from 'react'
import { Building2, Check, X, Plus } from 'lucide-react'
import apiCore from '../../api/apiCore'
import type { Branch } from '../../types/Branch'
import type { ClassRoom } from '../../types/ClassRoom'
import type { Student } from '../../types/Student'
import type { Attendance } from '../../types/Attendance'
import Loading from '../../components/Loading'

export default function CheckInPage() {

  const [branches, setBranches] = useState<Branch[]>([])
  const [classRooms, setClassRooms] = useState<ClassRoom[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [attendances, setAttendances] = useState<Attendance[]>([])

  const [selectedBranch, setSelectedBranch] = useState<number | null>(null)
  const [selectedClassRoom, setSelectedClassRoom] = useState<number | null>(null)
  const [studentToAdd, setStudentToAdd] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const academicId = localStorage.getItem('academic')

  /* ================= LOAD FILIAIS ================= */

  useEffect(() => {
    async function loadBranches() {
      if (!academicId) return
      try {
        const res = await apiCore.get(`/branches/academic/${academicId}`)
        setBranches(res?.data)
        
        // Se houver filiais e nenhuma selecionada, seleciona a primeira
        if (res.data.length > 0 && !selectedBranch) {
          setSelectedBranch(res?.data[0]?.id)
        }
      } catch (error) {
        console.error('Erro ao carregar filiais:', error)
      }
    }
    loadBranches()
  }, [academicId])

  /* ================= LOAD AULAS E ALUNOS ================= */

  useEffect(() => {
    async function loadBranchData() {
      if (!selectedBranch) return
      
      setLoading(true)
      try {
        const [classesRes, studentsRes] = await Promise.all([
          apiCore.get(`/class-schedules/branch/${selectedBranch}`),
          apiCore.get(`/alunos/branch/${selectedBranch}/academia/${academicId}`)
        ])
        
        setClassRooms(classesRes.data)
        setStudents(studentsRes.data)
      } catch (error) {
        console.error('Erro ao carregar dados da filial:', error)
      } finally {
        setLoading(false)
      }
    }
    loadBranchData()
  }, [selectedBranch])

  /* ================= LOAD PRESENÇAS ================= */

  useEffect(() => {
    if (!selectedClassRoom) return

    apiCore.get(`/attendances/classroom/${selectedClassRoom}`)
      .then(res => setAttendances(res.data))

  }, [selectedClassRoom])

  /* ================= CHECK-IN ================= */

  async function registrarCheckIn(studentId: number) {

    const existente = attendances.find(
      a => a.studentId === studentId
    )

    if (existente) {
      await apiCore.put(`/attendances/${existente.id}`, {
        ...existente,
        status: 'PRESENTE'
      })
    } else {
      await apiCore.post('/attendances', {
        studentId,
        classRoomId: selectedClassRoom,
        status: 'PRESENTE'
      })
    }

    reloadAttendances()
  }

  async function ausentarCheckIn(studentId: number) {

    const existente = attendances.find(
      a => a.studentId === studentId
    )

    if (!existente) return

    await apiCore.put(`/attendances/${existente.id}`, {
      ...existente,
      status: 'AUSENTE'
    })

    reloadAttendances()
  }

  async function adicionarAlunoNaAula() {

    if (!studentToAdd) return

    await apiCore.post('/attendances', {
      studentId: studentToAdd,
      classRoomId: selectedClassRoom,
      status: 'PRESENTE'
    })

    setStudentToAdd(null)
    reloadAttendances()
  }

  function reloadAttendances() {
    apiCore
      .get(`/attendances/class-room/${selectedClassRoom}`)
      .then(res => setAttendances(res.data))
  }

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8 space-y-10">

      <h1 className="text-2xl font-semibold">Check-in Geral</h1>

      {/* FILIAIS */}
      <div className="flex gap-4 flex-wrap">
        {branches.map(branch => (
          <button
            key={branch.id}
            onClick={() => {
              setSelectedBranch(branch.id)
              setSelectedClassRoom(null)
            }}
            className={`rounded-xl border px-5 py-3
              ${selectedBranch === branch.id
                ? 'border-red-600 bg-red-700/20'
                : 'border-neutral-700 bg-neutral-900'
              }`}
          >
            <Building2 className="h-4 w-4 inline mr-2" />
            {branch.name}
          </button>
        ))}
      </div>

      {/* AULAS */}
      {selectedBranch && (
        <div className="grid md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-full py-10">
              <Loading text="Buscando aulas e alunos..." />
            </div>
          ) : classRooms.length === 0 ? (
            <p className="text-neutral-500 italic">Nenhuma aula encontrada para esta filial.</p>
          ) : (
            classRooms.map(aula => (
              <div
                key={aula.id}
                onClick={() => setSelectedClassRoom(aula.id)}
                className={`cursor-pointer rounded-2xl border p-5
                  ${selectedClassRoom === aula.id
                    ? 'border-red-600 bg-red-700/10'
                    : 'border-neutral-700 bg-neutral-900'
                  }`}
              >
                <p className="font-semibold">
                  {new Date(aula.dateTime).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* PRESENÇA */}
      {selectedClassRoom && (
        <div>

          <div className="flex gap-3 mb-6">
            <select
              className="bg-neutral-900 border border-neutral-700 rounded-lg p-2"
              value={studentToAdd || ''}
              onChange={e => setStudentToAdd(Number(e.target.value))}
            >
              <option value="">Selecionar aluno</option>
              {students.map(aluno => (
                <option key={aluno.id} value={aluno.id}>
                  {aluno.nome}
                </option>
              ))}
            </select>

            <button
              onClick={adicionarAlunoNaAula}
              className="bg-red-700 px-4 py-2 rounded-lg"
            >
              <Plus className="h-4 w-4 inline mr-2" />
              Inserir aluno
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {attendances.map(att => {

                const aluno = students.find(s => s.id === att.studentId)
                if (!aluno) return null

                return (
                  <tr key={att.id}>
                    <td>{aluno.nome}</td>
                    <td>{att.status}</td>
                    <td className="flex gap-3">
                      <button onClick={() => registrarCheckIn(aluno.id)}>
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={() => ausentarCheckIn(aluno.id)}>
                        <X className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}