import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-neutral-900 text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col bg-neutral-900">
        <main className="flex-1 overflow-y-auto bg-neutral-950 px-10 py-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
