import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, Mail, Lock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const res = await login(email, password)
    setIsLoading(false)
    if (res.success) navigate('/dashboard/map')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white relative overflow-hidden p-6 font-sans">
      {/* Abstract Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-sky-brand/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-healthy/10 rounded-full blur-[100px]" />

      <GlassCard variant="heavy" className="w-full max-w-md p-8 relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-xl bg-navy flex items-center justify-center shadow-lg mb-4">
            <span className="text-healthy font-black text-2xl tracking-tighter">KB</span>
          </div>
          <h1 className="text-2xl font-bold text-navy">Welcome Back</h1>
          <p className="text-sm text-slate-brand mt-1">Sign in to your agronomist dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-navy uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-brand" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-glass pl-10"
                placeholder="agronomist@farm.org"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-navy uppercase tracking-wider">Password</label>
              <Link to="/reset-password" className="text-xs font-semibold text-sky-brand hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-brand" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-glass pl-10"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button type="submit" className="w-full mt-2 lg:py-3.5" isLoading={isLoading}>
            Sign In to Dashboard
          </Button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-slate-brand">
          Don't have an account?{' '}
          <Link to="/signup" className="text-sky-brand hover:underline font-bold">
            Apply here
          </Link>
        </div>
      </GlassCard>
    </div>
  )
}
