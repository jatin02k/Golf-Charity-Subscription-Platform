import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ScoreEntry from '@/components/dashboard/ScoreEntry'
import CharityCard from '@/components/dashboard/CharityCard'
import DrawParticipation from '@/components/dashboard/DrawParticipation'
import WinningsCard from '@/components/dashboard/WinningsCard'
import { LogoutButton } from '@/components/LogoutButton'
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: scores } = await supabase.from('scores').select('*').eq('user_id', user.id).order('played_at', { ascending: false }).limit(5)
  const { data: drawResults } = await supabase.from('draw_results').select('*, draws(*)').eq('user_id', user.id).order('created_at', { ascending: false })

  const isActive = profile?.subscription_status === 'active'
  console.log('PROFILE DATA:', JSON.stringify(profile))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {profile?.full_name?.split(' ')[0]} 👋</h1>
            <p className="text-white/60">Your golf journey dashboard</p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
            {isActive ? '✓ Active Subscriber' : '✗ Inactive'}
          </div>
          <div className="flex items-center gap-3">
  <div className={`px-4 py-2 rounded-full text-sm font-semibold ${isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
    {isActive ? '✓ Active Subscriber' : '✗ Inactive'}
  </div>
  <LogoutButton />
</div>
        </div>

        {!isActive && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-4 mb-6 text-yellow-300">
            Your subscription is inactive. <a href="/subscribe" className="underline font-semibold">Subscribe now</a> to enter draws and track scores.
          </div>
        )}

        {/* Subscription Card */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-3">Subscription</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><p className="text-white/40 text-xs">Status</p><p className="text-white font-medium capitalize">{profile?.subscription_status}</p></div>
            <div><p className="text-white/40 text-xs">Plan</p><p className="text-white font-medium capitalize">{profile?.subscription_plan || 'None'}</p></div>
            <div><p className="text-white/40 text-xs">Started</p><p className="text-white font-medium">{profile?.subscription_start ? new Date(profile.subscription_start).toLocaleDateString() : '—'}</p></div>
            <div><p className="text-white/40 text-xs">Renews</p><p className="text-white font-medium">{profile?.subscription_end ? new Date(profile.subscription_end).toLocaleDateString() : '—'}</p></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScoreEntry userId={user.id} initialScores={scores || []} isActive={isActive} />
          <CharityCard profile={profile} />
          <DrawParticipation drawResults={drawResults || []} />
          <WinningsCard drawResults={drawResults || []} />
        </div>
      </div>
    </div>
  )
}
