import { useEffect, useState } from 'react'
import apiCore from '../../api/apiCore'
import type { Branch } from '../../types/Branch'

type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'

export default function ScheduleManagementPage() {

  const [branches, setBranches] = useState<Branch[]>([])
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null)

  const [name, setName] = useState('')
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>('MONDAY')
  const [time, setTime] = useState('19:00')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const academicId = localStorage.getItem('academic')

  useEffect(() => {
    if (!academicId) return

    apiCore
      .get(`/branches/academic/${academicId}`)
      .then(res => setBranches(res.data))

  }, [academicId])

  async function criarSchedule() {

    if (!selectedBranch) return

    await apiCore.post('/class-schedules', {
      name,
      dayOfWeek,
      time,
      startDate,
      endDate,
      active: true,
      branchId: selectedBranch,
      academicId
    })

    alert('Horário criado!')
  }

  return (

    <div className="min-h-screen bg-black text-white p-10 space-y-6">

      <h1 className="text-2xl font-semibold">
        Criar Horário de Aula
      </h1>

      {/* FILIAL */}

      <select
        onChange={e => setSelectedBranch(Number(e.target.value))}
        className="bg-neutral-900 px-3 py-2 rounded-lg"
      >

        <option>Selecionar filial</option>

        {branches.map(b => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}

      </select>

      {/* FORM */}

      <input
        placeholder="Nome da aula"
        value={name}
        onChange={e => setName(e.target.value)}
        className="bg-neutral-900 px-3 py-2 rounded-lg w-full"
      />

      <select
        value={dayOfWeek}
        onChange={e => setDayOfWeek(e.target.value as DayOfWeek)}
        className="bg-neutral-900 px-3 py-2 rounded-lg"
      >
        <option value="MONDAY">Segunda</option>
        <option value="TUESDAY">Terça</option>
        <option value="WEDNESDAY">Quarta</option>
        <option value="THURSDAY">Quinta</option>
        <option value="FRIDAY">Sexta</option>
        <option value="SATURDAY">Sábado</option>
        <option value="SUNDAY">Domingo</option>
      </select>

      <input
        type="time"
        value={time}
        onChange={e => setTime(e.target.value)}
        className="bg-neutral-900 px-3 py-2 rounded-lg"
      />

      <input
        type="date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
        className="bg-neutral-900 px-3 py-2 rounded-lg"
      />

      <input
        type="date"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
        className="bg-neutral-900 px-3 py-2 rounded-lg"
      />

      <button
        onClick={criarSchedule}
        className="bg-red-700 px-6 py-3 rounded-lg"
      >
        Criar horário
      </button>

    </div>

  )
}