import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import StudentsPage from '../pages/students/StudentsPage'
import DashboardLayout from '../pages/layouts/DashboardLayout'
import BranchesPage from '../pages/branchs/BranchesPage'
import GraduationsPage from '../pages/graduationsPage/GraduationsPage'
import CheckInPage from '../pages/checkInPage/CheckInPage'
// import { useAuth } from '../hooks/useAuth'
// import type { UserRole } from '../types/auth'
// import type { JSX } from 'react'

// interface PrivateRouteProps {
//   children: JSX.Element
//   allowedRoles?: UserRole[]
// }

// function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
//   const { isAuthenticated, user } = useAuth()

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />
//   }

//   if (allowedRoles && user && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/" replace />
//   }

//   return children
// }

export default function AppRouter() {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/branches" element={<BranchesPage />} />
          <Route path="/graduations" element={<GraduationsPage />} />
          <Route path="/checkin" element={<CheckInPage />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
