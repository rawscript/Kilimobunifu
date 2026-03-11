import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'agronomist' })
  const [isLoading, setIsLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const { name, email, password, role } = formData
    const res = await signup(name, email, password, role)
    setIsLoading(false)
    if (res.success) navigate('/dashboard/map')
  }

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white relative overflow-hidden p-6 font-sans py-12">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-healthy/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-sky-brand/10 rounded-full blur-[100px]" />

      <GlassCard variant="heavy" className="w-full max-w-md p-8 relative z-10 animate-fade-in mt-10 mb-10">
        <div className="text-center mb-8">
           <div className="mx-auto w-12 h-12 rounded-xl bg-navy flex items-center justify-center shadow-lg mb-4">
             <span className="text-healthy font-black text-2xl tracking-tighter">KB</span>
           </div>
          <h1 className="text-2xl font-bold text-navy">Join the Network</h1>
          <p className="text-sm text-slate-brand mt-1">Create an agronomist or researcher account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-navy uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-brand" />
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                required
                className="input-glass pl-10"
                placeholder="Dr. Jane Doe"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-navy uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-brand" />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                required
                className="input-glass pl-10"
                placeholder="agronomist@farm.org"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-navy uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-brand" />
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                required
                minLength={8}
                className="input-glass pl-10"
                placeholder="At least 8 characters"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-navy uppercase tracking-wider">Platform Role</label>
            <div className="relative">
              <ShieldCheck className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-brand z-10" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="select-glass pl-10 h-[46px]"
              >
                <option value="agronomist">Field Agronomist</option>
                <option value="researcher">Remote Researcher</option>
                <option value="technician">IoT Technician</option>
              </select>
            </div>
          </div>

          <Button type="submit" className="w-full mt-4 lg:py-3.5" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm font-medium text-slate-brand">
          Already registered?{' '}
          <Link to="/login" className="text-sky-brand hover:underline font-bold">
            Sign In
          </Link>
        </div>
      </GlassCard>
    </div>
  )
}
