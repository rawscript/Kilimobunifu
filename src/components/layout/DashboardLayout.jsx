import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function DashboardLayout() {
  return (
    <div className="flex bg-off-white min-h-screen font-sans">
      <Sidebar />
      <main className="ml-64 flex-1 relative overflow-hidden transition-all duration-300">
        <Outlet />
      </main>
    </div>
  )
}
