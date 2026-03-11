import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'

export default function PasswordResetPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const res = await resetPassword(email)
    setIsLoading(false)
    if (res.success) setIsSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white relative overflow-hidden p-6 font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-sky-brand/10 rounded-full blur-[100px]" />

      <GlassCard variant="heavy" className="w-full max-w-md p-8 relative z-10 animate-fade-in">
        <div className="mb-6">
          <Link to="/login" className="inline-flex items-center text-sm font-semibold text-slate-brand hover:text-navy transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-navy mb-2">Reset Password</h1>
          <p className="text-sm text-slate-brand">
            {isSent
              ? "We've sent a recovery link to your email. Please check your inbox and spam folder."
              : "Enter your registered email address to receive password reset instructions."}
          </p>
        </div>

        {!isSent ? (
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

            <Button type="submit" className="w-full mt-2 lg:py-3.5" isLoading={isLoading}>
              Send Reset Link
            </Button>
          </form>
        ) : (
           <Button variant="ghost" className="w-full" onClick={() => setIsSent(false)}>
             Use a different email
           </Button>
        )}
      </GlassCard>
    </div>
  )
}
