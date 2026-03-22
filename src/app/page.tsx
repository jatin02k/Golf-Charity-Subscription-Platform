import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: charities } = await supabase.from('charities').select('*').eq('featured', true).limit(3)
  const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="text-white font-bold text-xl">⛳ GolfGive</div>
        <div className="flex items-center gap-4">
          <Link href="/charities" className="text-white/60 hover:text-white text-sm transition-colors">Charities</Link>
          <Link href="/login" className="text-white/60 hover:text-white text-sm transition-colors">Sign In</Link>
          <Link href="/signup" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium rounded-xl transition-all">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm px-4 py-2 rounded-full mb-6">
          🌍 {count || 0}+ members making a difference
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Play Golf.<br />
          <span className="text-emerald-400">Win Prizes.</span><br />
          Change Lives.
        </h1>
        <p className="text-white/60 text-xl max-w-2xl mx-auto mb-10">
          Join the first golf platform where your performance fuels monthly prize draws and funds the charities you care about.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/signup" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg rounded-2xl transition-all">
            Subscribe & Play →
          </Link>
          <Link href="/charities" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium text-lg rounded-2xl transition-all border border-white/20">
            Explore Charities
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-white text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Subscribe', desc: 'Choose monthly or yearly. A portion of your fee goes directly to your chosen charity.', icon: '💳' },
            { step: '02', title: 'Track Your Scores', desc: 'Enter up to 5 Stableford scores. Your scores become your draw entries.', icon: '📊' },
            { step: '03', title: 'Win Monthly Draws', desc: 'Match 3, 4, or 5 numbers to win from the monthly prize pool. Jackpot rolls over!', icon: '🏆' },
          ].map(item => (
            <div key={item.step} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <div className="text-4xl mb-4">{item.icon}</div>
              <div className="text-emerald-400 text-sm font-mono mb-2">{item.step}</div>
              <h3 className="text-white text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-white/60">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prize Pool */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-white text-3xl font-bold text-center mb-4">Prize Pool Distribution</h2>
        <p className="text-white/60 text-center mb-10">Every subscription contributes to the monthly prize pool</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { match: '5 Number Match', share: '40%', label: 'Jackpot', color: 'from-yellow-500/20 to-orange-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400', rollover: true },
            { match: '4 Number Match', share: '35%', label: 'Major Prize', color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30', text: 'text-emerald-400', rollover: false },
            { match: '3 Number Match', share: '25%', label: 'Prize', color: 'from-blue-500/20 to-indigo-500/20', border: 'border-blue-500/30', text: 'text-blue-400', rollover: false },
          ].map(p => (
            <div key={p.match} className={`bg-gradient-to-br ${p.color} border ${p.border} rounded-2xl p-6 text-center`}>
              <div className={`text-4xl font-bold ${p.text} mb-2`}>{p.share}</div>
              <div className="text-white font-semibold">{p.match}</div>
              <div className="text-white/40 text-sm mt-1">{p.label}</div>
              {p.rollover && <div className="mt-3 text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full inline-block">Jackpot Rolls Over</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Charities */}
      {charities && charities.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-white text-3xl font-bold text-center mb-4">Featured Charities</h2>
          <p className="text-white/60 text-center mb-10">Your subscription directly supports these causes</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {charities.map(c => (
              <div key={c.id} className="bg-white/10 border border-white/20 rounded-2xl overflow-hidden">
                <img src={c.image_url} alt={c.name} className="w-full h-40 object-cover" />
                <div className="p-5">
                  <h3 className="text-white font-semibold">{c.name}</h3>
                  <p className="text-white/50 text-sm mt-1">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/charities" className="text-emerald-400 hover:underline">View all charities →</Link>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-3xl p-12">
          <h2 className="text-white text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-white/60 text-lg mb-8">Join today. Play golf. Fund change. Win big.</p>
          <Link href="/signup" className="inline-block px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xl rounded-2xl transition-all">
            Start Your Journey →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-white/30 text-sm">
        © 2026 GolfGive. Built with purpose.
      </footer>
    </div>
  )
}
