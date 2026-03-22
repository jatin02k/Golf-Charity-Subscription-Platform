import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: activeCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active')
  const { data: charities } = await supabase.from('charities').select('*')
  const { data: draws } = await supabase.from('draws').select('*').order('created_at', { ascending: false }).limit(5)

  const monthlyRevenue = (activeCount || 0) * 999
  const prizePool = monthlyRevenue * 0.6
  const charityPool = monthlyRevenue * 0.1

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <h1 className="text-white font-bold text-xl">GolfGive Admin</h1>
        <div className="flex gap-4">
          {[['Users', '/admin/users'], ['Draws', '/admin/draws'], ['Charities', '/admin/charities'], ['Winners', '/admin/winners']].map(([label, href]) => (
            <Link key={href} href={href} className="text-white/60 hover:text-white text-sm transition-colors">{label}</Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-white text-lg font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: userCount || 0, color: 'text-blue-400' },
            { label: 'Active Subscribers', value: activeCount || 0, color: 'text-emerald-400' },
            { label: 'Prize Pool', value: `₹${prizePool.toLocaleString()}`, color: 'text-yellow-400' },
            { label: 'Charity Contributions', value: `₹${charityPool.toLocaleString()}`, color: 'text-pink-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-slate-800 rounded-2xl p-5 border border-white/10">
              <p className="text-white/40 text-sm">{stat.label}</p>
              <p className={`${stat.color} text-2xl font-bold mt-1`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Draws */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Recent Draws</h3>
              <Link href="/admin/draws" className="text-emerald-400 text-sm hover:underline">Manage →</Link>
            </div>
            {draws?.map(d => (
              <div key={d.id} className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-white/60 text-sm">{d.month}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${d.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : d.status === 'simulated' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 text-white/40'}`}>
                  {d.status}
                </span>
              </div>
            ))}
            {!draws?.length && <p className="text-white/40 text-sm">No draws yet.</p>}
          </div>

          {/* Charities */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Charities ({charities?.length})</h3>
              <Link href="/admin/charities" className="text-emerald-400 text-sm hover:underline">Manage →</Link>
            </div>
            {charities?.map(c => (
              <div key={c.id} className="flex items-center gap-3 py-3 border-b border-white/5">
                <img src={c.image_url} alt={c.name} className="w-8 h-8 rounded-lg object-cover" />
                <span className="text-white/80 text-sm">{c.name}</span>
                {c.featured && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">Featured</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
