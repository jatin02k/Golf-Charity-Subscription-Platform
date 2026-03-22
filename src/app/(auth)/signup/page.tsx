'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Charity } from '@/types'

export default function SignupPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', charityId: '', contributionPercent: 10 })
  const [charities, setCharities] = useState<Charity[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.from('charities').select('*').then(({ data }) => setCharities(data || []))
  }, [])

  async function handleSignup(e: React.FormEvent) {
  e.preventDefault()
  setLoading(true)
  setError('')
  
  const { data, error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: { data: { full_name: form.fullName } }
  })
  
  if (error) { setError(error.message); setLoading(false); return }
  
  // Wait for trigger to create profile, then update
  if (data.user) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    await supabase.from('profiles').update({
      charity_id: form.charityId,
      charity_contribution_percent: form.contributionPercent
    }).eq('id', data.user.id)
  }
  
  router.push('/subscribe')
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Join GolfGive</h1>
          <p className="text-emerald-400 mt-2">Play golf. Win prizes. Change lives.</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium">Full Name</label>
              <input value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})}
                className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                placeholder="John Smith" required />
            </div>
            <div>
              <label className="text-white text-sm font-medium">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                placeholder="you@example.com" required />
            </div>
            <div>
              <label className="text-white text-sm font-medium">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                placeholder="Min 6 characters" required minLength={6} />
            </div>
            <div>
              <label className="text-white text-sm font-medium">Choose Your Charity</label>
              <select value={form.charityId} onChange={e => setForm({...form, charityId: e.target.value})}
                className="w-full mt-1 px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:border-emerald-400" required>
                <option value="">Select a charity...</option>
                {charities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-white text-sm font-medium">
                Charity Contribution: <span className="text-emerald-400">{form.contributionPercent}%</span>
              </label>
              <input type="range" min={10} max={50} value={form.contributionPercent}
                onChange={e => setForm({...form, contributionPercent: Number(e.target.value)})}
                className="w-full mt-2 accent-emerald-400" />
              <div className="flex justify-between text-white/40 text-xs mt-1">
                <span>10% (min)</span><span>50% (max)</span>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-white/60 mt-4 text-sm">
            Already have an account? <Link href="/login" className="text-emerald-400 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
