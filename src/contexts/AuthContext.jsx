import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('kb_access_token')
    const storedUser = localStorage.getItem('kb_user')
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch {
        localStorage.removeItem('kb_access_token')
        localStorage.removeItem('kb_refresh_token')
        localStorage.removeItem('kb_user')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      // Dummy mock login
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const userData = {
        id: 'usr_123',
        name: 'Demo User',
        email: email,
        role: 'Lead Agronomist'
      }
      
      localStorage.setItem('kb_access_token', 'mock_jwt_token_123')
      localStorage.setItem('kb_user', JSON.stringify(userData))
      
      setUser(userData)
      setIsAuthenticated(true)
      toast.success(`Welcome back, ${userData.name}!`)
      return { success: true }
    } catch (err) {
      toast.error('Login failed.')
      return { success: false, message: 'Login failed.' }
    }
  }, [])

  const signup = useCallback(async (name, email, password, role = 'agronomist') => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const userData = {
        id: `usr_${Date.now()}`,
        name,
        email,
        role
      }
      
      localStorage.setItem('kb_access_token', 'mock_jwt_token_456')
      localStorage.setItem('kb_user', JSON.stringify(userData))
      
      setUser(userData)
      setIsAuthenticated(true)
      toast.success('Account created successfully!')
      return { success: true }
    } catch (err) {
      toast.error('Signup failed. Please try again.')
      return { success: false, message: 'Signup failed.' }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('kb_access_token')
    localStorage.removeItem('kb_refresh_token')
    localStorage.removeItem('kb_user')
    setUser(null)
    setIsAuthenticated(false)
    toast.success('Logged out successfully.')
  }, [])

  const resetPassword = useCallback(async (email) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Password reset link sent to your email.')
      return { success: true }
    } catch (err) {
      toast.error('Failed to send reset link.')
      return { success: false, message: 'Failed to send reset link.' }
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, login, signup, logout, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
