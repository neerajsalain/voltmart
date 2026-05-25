'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all required fields.'); return }
    if (mode === 'signup' && !name) { setError('Please enter your full name.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)

    localStorage.setItem('voltmart_user', JSON.stringify({
      name: name || email.split('@')[0],
      email,
      phone,
    }))

    const redirect = new URLSearchParams(window.location.search).get('redirect') || '/'
    router.push(redirect)
  }, [email, password, name, phone, mode, router])

  const inputClass = "w-full bg-white/10 border border-white/15 text-white placeholder-slate-500 rounded-xl h-11 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/60 transition-all"

  return (
    <div className="min-h-screen bg-[#0d0d12] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <a href="/" className="flex items-center gap-3 group mb-3">
            <div className="w-12 h-12 rounded-2xl volt-gradient grid place-items-center shadow-xl shadow-orange-500/30 group-hover:scale-105 transition-transform">
              <Zap size={22} className="text-white" fill="white" />
            </div>
            <div>
              <div className="font-extrabold text-2xl text-white leading-none" style={{ fontFamily: 'Syne, sans-serif' }}>VoltMart</div>
              <div className="text-xs text-slate-400 tracking-widest uppercase mt-0.5">Electrical Store</div>
            </div>
          </a>
          <p className="text-slate-400 text-sm text-center mt-1">
            {mode === 'login' ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40">
          {/* Tabs */}
          <div className="flex gap-1 bg-white/5 rounded-2xl p-1 mb-7">
            {['login', 'signup'].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  mode === m ? 'volt-gradient text-white shadow-md shadow-orange-500/20' : 'text-slate-400 hover:text-white'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name — signup only */}
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Full Name *</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Rahul Sharma"
                    autoComplete="name"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Email *</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="rahul@example.com"
                  autoComplete="email"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Phone — signup only */}
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Phone</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="9876543210"
                    autoComplete="tel"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Password *</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="w-full bg-white/10 border border-white/15 text-white placeholder-slate-500 rounded-xl h-11 pl-10 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/60 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            {mode === 'login' && (
              <div className="text-right -mt-1">
                <button type="button" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl volt-gradient text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 hover:opacity-90 transition-opacity disabled:opacity-60 mt-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />
                  {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                </>
              ) : (
                <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-500">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Guest */}
          <button
            type="button"
            onClick={() => router.push('/')}
            className="w-full h-11 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Browse as Guest
          </button>

          {/* Perks */}
          {mode === 'signup' && (
            <div className="mt-5 space-y-2">
              {['Track your orders easily', 'Save addresses for faster checkout', 'Get exclusive member deals'].map(p => (
                <div key={p} className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                  {p}
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          © 2025 VoltMart · By continuing you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  )
}
