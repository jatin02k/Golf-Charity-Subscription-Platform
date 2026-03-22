'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminWinnersPage() {
  const [winners, setWinners] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    supabase.from('draw_results')
      .select('*, profiles(full_name, email), draws(month)')
      .gt('matched_count', 0)
      .order('created_at', { ascending: false })
      .then(({ data }) => setWinners(data || []))
  }, [])

  async function updateStatus(id: string, field: string, value: string) {
    await supabase.from('draw_results').update({ [field]: value }).eq('id', id)
    setWinners(winners.map(w => w.id === id ? { ...w, [field]: value } : w))
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="text-white text-2xl font-bold mb-6">Winners Management</h1>
      <div className="bg-slate-800 rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700">
            <tr>
              {['User', 'Draw', 'Match', 'Prize', 'Verification', 'Payment'].map(h => (
                <th key={h} className="text-left text-white/60 text-sm px-6 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {winners.map(w => (
              <tr key={w.id} className="border-t border-white/5">
                <td className="px-6 py-4">
                  <p className="text-white text-sm">{w.profiles?.full_name}</p>
                  <p className="text-white/40 text-xs">{w.profiles?.email}</p>
                </td>
                <td className="px-6 py-4 text-white/60 text-sm">{w.draws?.month}</td>
                <td className="px-6 py-4">
                  <span className="text-emerald-400 font-bold">{w.matched_count} Match</span>
                </td>
                <td className="px-6 py-4 text-white text-sm">₹{Number(w.prize_amount).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <select value={w.verification_status} onChange={e => updateStatus(w.id, 'verification_status', e.target.value)}
                    className="bg-slate-700 text-white text-xs px-2 py-1 rounded-lg border border-white/10">
                    <option value="unverified">Unverified</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <select value={w.payment_status} onChange={e => updateStatus(w.id, 'payment_status', e.target.value)}
                    className="bg-slate-700 text-white text-xs px-2 py-1 rounded-lg border border-white/10">
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!winners.length && <p className="text-white/40 text-sm p-6">No winners yet.</p>}
      </div>
    </div>
  )
}
