'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminDrawsPage() {
  const [draws, setDraws] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('draws').select('*').order('created_at', { ascending: false }).then(({ data }) => setDraws(data || []))
  }, [])

  function generateWinningNumbers(): number[] {
    const nums = new Set<number>()
    while (nums.size < 5) nums.add(Math.floor(Math.random() * 45) + 1)
    return Array.from(nums).sort((a, b) => a - b)
  }

  async function runDraw(type: 'simulate' | 'publish') {
    setLoading(true)
    const month = new Date().toISOString().slice(0, 7)
    const winning_numbers = generateWinningNumbers()

    // Get all active subscribers and their scores
    const { data: activeUsers } = await supabase.from('profiles').select('id').eq('subscription_status', 'active')
    
    const { data: existingDraw } = await supabase.from('draws').select('*').eq('month', month).single()

    let draw
    if (existingDraw) {
      const { data } = await supabase.from('draws').update({
        winning_numbers,
        status: type === 'publish' ? 'published' : 'simulated'
      }).eq('id', existingDraw.id).select().single()
      draw = data
    } else {
      const { data } = await supabase.from('draws').insert({
        month,
        winning_numbers,
        status: type === 'publish' ? 'published' : 'simulated',
        draw_type: 'random',
        jackpot_amount: (activeUsers?.length || 0) * 999 * 0.4,
        four_match_amount: (activeUsers?.length || 0) * 999 * 0.35,
        three_match_amount: (activeUsers?.length || 0) * 999 * 0.25,
      }).select().single()
      draw = data
    }

    // Match users scores against winning numbers
    if (draw && activeUsers) {
      for (const user of activeUsers) {
        const { data: userScores } = await supabase.from('scores').select('score').eq('user_id', user.id)
        const userScoreNums = userScores?.map(s => s.score) || []
        const matched = userScoreNums.filter(s => winning_numbers.includes(s)).length

        if (matched >= 3) {
          const prizeAmount = matched === 5 ? draw.jackpot_amount / 1 : matched === 4 ? draw.four_match_amount / 1 : draw.three_match_amount / 1
          await supabase.from('draw_results').upsert({
            draw_id: draw.id,
            user_id: user.id,
            matched_count: matched,
            prize_amount: prizeAmount,
          }, { onConflict: 'draw_id,user_id' })
        }
      }
    }

    const { data: updated } = await supabase.from('draws').select('*').order('created_at', { ascending: false })
    setDraws(updated || [])
    setLoading(false)
    alert(`Draw ${type === 'simulate' ? 'simulated' : 'published'}! Numbers: ${winning_numbers.join(', ')}`)
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-2xl font-bold">Draw Management</h1>
        <div className="flex gap-3">
          <button onClick={() => runDraw('simulate')} disabled={loading}
            className="px-4 py-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-xl text-sm hover:bg-yellow-500/30 disabled:opacity-50 transition-all">
            {loading ? '...' : 'Simulate Draw'}
          </button>
          <button onClick={() => runDraw('publish')} disabled={loading}
            className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm hover:bg-emerald-400 disabled:opacity-50 transition-all">
            {loading ? '...' : 'Run & Publish Draw'}
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700">
            <tr>
              {['Month', 'Winning Numbers', 'Jackpot', 'Status', 'Type'].map(h => (
                <th key={h} className="text-left text-white/60 text-sm px-6 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {draws.map(d => (
              <tr key={d.id} className="border-t border-white/5">
                <td className="px-6 py-4 text-white text-sm">{d.month}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    {d.winning_numbers?.map((n: number) => (
                      <span key={n} className="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-full text-xs flex items-center justify-center font-bold">{n}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-white/60 text-sm">₹{Number(d.jackpot_amount).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${d.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : d.status === 'simulated' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 text-white/40'}`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-white/40 text-sm">{d.draw_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!draws.length && <p className="text-white/40 text-sm p-6">No draws yet. Run your first draw above.</p>}
      </div>
    </div>
  )
}
