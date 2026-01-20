// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
    

// import { Label } from '@/components/ui/label';
// import { BarChart3, Users, Calendar, TrendingUp, Award } from 'lucide-react';
// import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// /* =======================
//    MOCK DATA
// ======================= */

// const branches = [
//   { id: '1', name: 'Matriz' },
//   { id: '2', name: 'Zona Norte' },
// ];

// const students = [
//   { id: '1', full_name: 'João Silva', branch_id: '1', belt: 'blue' },
//   { id: '2', full_name: 'Pedro Santos', branch_id: '1', belt: 'purple' },
//   { id: '3', full_name: 'Lucas Costa', branch_id: '2', belt: 'white' },
// ];

// const attendance = [
//   { student_id: '1', branch_id: '1', check_in_date: '2025-01-05' },
//   { student_id: '2', branch_id: '1', check_in_date: '2025-01-05' },
//   { student_id: '1', branch_id: '1', check_in_date: '2025-01-06' },
//   { student_id: '3', branch_id: '2', check_in_date: '2025-01-07' },
//   { student_id: '1', branch_id: '1', check_in_date: '2025-01-07' },
// ];

// /* =======================
//    COMPONENT
// ======================= */

// export default function Reports() {
//   const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
//   const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
//   const [selectedBranch, setSelectedBranch] = useState('all');

//   const filteredAttendance = attendance.filter(att => {
//     const matchesDate = att.check_in_date >= startDate && att.check_in_date <= endDate;
//     const matchesBranch = selectedBranch === 'all' || att.branch_id === selectedBranch;
//     return matchesDate && matchesBranch;
//   });

//   const totalAttendance = filteredAttendance.length;
//   const uniqueStudents = new Set(filteredAttendance.map(a => a.student_id)).size;

//   const avgAttendancePerDay =
//     totalAttendance /
//     Math.max(
//       1,
//       eachDayOfInterval({
//         start: new Date(startDate),
//         end: new Date(endDate),
//       }).length
//     );

//   /* Presenças por dia */
//   const attendanceByDay: Record<string, number> = {};
//   filteredAttendance.forEach(att => {
//     const day = format(new Date(att.check_in_date), 'dd/MM');
//     attendanceByDay[day] = (attendanceByDay[day] || 0) + 1;
//   });

//   const dailyData = Object.entries(attendanceByDay).map(([day, count]) => ({
//     day,
//     count,
//   }));

//   /* Top alunos */
//   const studentAttendance: Record<string, number> = {};
//   filteredAttendance.forEach(att => {
//     studentAttendance[att.student_id] = (studentAttendance[att.student_id] || 0) + 1;
//   });

//   const topStudents = Object.entries(studentAttendance)
//     .sort(([, a], [, b]) => b - a)
//     .slice(0, 5)
//     .map(([studentId, count]) => ({
//       student: students.find(s => s.id === studentId),
//       count,
//     }));

//   /* Presenças por filial */
//   const branchData = branches.map(branch => ({
//     name: branch.name,
//     count: filteredAttendance.filter(a => a.branch_id === branch.id).length,
//   }));

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div>
//         <h1 className="text-4xl font-bold text-slate-900 mb-2">Relatórios</h1>
//         <p className="text-slate-600">Dashboard visual (dados mockados)</p>
//       </div>

//       {/* Filters */}
//       <Card>
//         <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <Label>Data Início</Label>
//             <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
//           </div>

//           <div>
//             <Label>Data Fim</Label>
//             <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
//           </div>

//           <div>
//             <Label>Filial</Label>
//             <select
//               className="w-full px-3 py-2 border rounded-lg"
//               value={selectedBranch}
//               onChange={e => setSelectedBranch(e.target.value)}
//             >
//               <option value="all">Todas</option>
//               {branches.map(b => (
//                 <option key={b.id} value={b.id}>{b.name}</option>
//               ))}
//             </select>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Stat title="Total de Presenças" value={totalAttendance} icon={<BarChart3 />} />
//         <Stat title="Alunos Únicos" value={uniqueStudents} icon={<Users />} />
//         <Stat title="Média por Dia" value={avgAttendancePerDay.toFixed(1)} icon={<TrendingUp />} />
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex gap-2 items-center">
//               <Calendar className="w-5 h-5" />
//               Presenças por Dia
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="h-[300px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={dailyData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="day" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line dataKey="count" stroke="#D4AF37" strokeWidth={2} />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex gap-2 items-center">
//               <BarChart3 className="w-5 h-5" />
//               Presenças por Filial
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="h-[300px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={branchData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="count" fill="#0A1628" radius={[6, 6, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Top Students */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex gap-2 items-center">
//             <Award className="w-5 h-5" />
//             Alunos Mais Frequentes
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           {topStudents.map((item, i) => (
//             <div key={i} className="flex justify-between items-center p-3 border rounded-lg">
//               <span className="font-medium">{item.student?.full_name}</span>
//               <Badge>{item.count} presenças</Badge>
//             </div>
//           ))}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// /* =======================
//    STAT CARD
// ======================= */
// function Stat({ title, value, icon }: { title: string, value: number | string, icon: React.ReactNode }) {
//   return (
//     <Card>
//       <CardContent className="p-6 flex justify-between items-center">
//         <div>
//           <p className="text-sm text-slate-500">{title}</p>
//           <p className="text-3xl font-bold">{value}</p>
//         </div>
//         <div className="p-3 bg-slate-900 text-white rounded-xl">
//           {icon}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
