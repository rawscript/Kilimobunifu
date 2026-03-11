import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'
import PasswordResetPage from '@/pages/auth/PasswordResetPage'
import DashboardLayout from '@/components/layout/DashboardLayout'
import OverviewView from '@/pages/dashboard/OverviewView'
import MapView from '@/pages/dashboard/MapView'
import AnalyticsView from '@/pages/dashboard/AnalyticsView'
import SettingsView from '@/pages/dashboard/SettingsView'

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-sky-brand border-t-transparent animate-spin" />
          <p className="text-slate-brand text-sm font-medium">Loading session…</p>
        </div>
      </div>
    )
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Redirect logged-in users away from auth pages
function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  return !isAuthenticated ? children : <Navigate to="/dashboard/overview" replace />
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth */}
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
      <Route path="/reset-password" element={<GuestRoute><PasswordResetPage /></GuestRoute>} />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<OverviewView />} />
        <Route path="map" element={<MapView />} />
        <Route path="analytics" element={<AnalyticsView />} />
        <Route path="settings" element={<SettingsView />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
