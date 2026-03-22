'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Score } from '@/types'

export default function ScoreEntry({ userId, initialScores, isActive }: { userId: string, initialScores: Score[], isActive: boolean }) {
  const [scores, setScores] = useState<Score[]>(initialScores)
  const [newScore, setNewScore] = useState('')
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function addScore() {
    if (!isActive) return alert('Subscribe to track scores')
    const scoreNum = parseInt(newScore)
    if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 45) return alert('Score must be between 1 and 45')
    
    setLoading(true)

    // If already 5 scores, delete the oldest
    if (scores.length >= 5) {
      const oldest = [...scores].sort((a, b) => new Date(a.played_at).getTime() - new Date(b.played_at).getTime())[0]
      await supabase.from('scores').delete().eq('id', oldest.id)
    }

    const { data, error } = await supabase.from('scores').insert({
      user_id: userId, score: scoreNum, played_at: newDate
    }).select().single()

    if (!error && data) {
      const updated = [...scores.filter(s => s.id !== (scores.length >= 5 ? [...scores].sort((a,b) => new Date(a.played_at).getTime() - new Date(b.played_at).getTime())[0].id : '')), data]
        .sort((a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime())
        .slice(0, 5)
      setScores(updated)
      setNewScore('')
    }
    setLoading(false)
  }

  async function deleteScore(id: string) {
    await supabase.from('scores').delete().eq('id', id)
    setScores(scores.filter(s => s.id !== id))
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
      <h2 className="text-white font-semibold mb-4">Golf Scores <span className="text-white/40 text-sm">({scores.length}/5)</span></h2>
      
      <div className="space-y-2 mb-4">
        {scores.length === 0 && <p className="text-white/40 text-sm">No scores yet. Add your first score!</p>}
        {scores.map(s => (
          <div key={s.id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-bold text-lg">{s.score}</span>
              <span className="text-white/60 text-sm">pts</span>
              <span className="text-white/40 text-xs">{new Date(s.played_at).toLocaleDateString()}</span>
            </div>
            <button onClick={() => deleteScore(s.id)} className="text-white/30 hover:text-red-400 text-xs transition-colors">✕</button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input type="number" value={newScore} onChange={e => setNewScore(e.target.value)}
          min={1} max={45} placeholder="Score (1-45)"
          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-400" />
        <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
          className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-400" />
        <button onClick={addScore} disabled={loading || !isActive}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium rounded-xl disabled:opacity-50 transition-all">
          {loading ? '...' : 'Add'}
        </button>
      </div>
      <p className="text-white/30 text-xs mt-2">Stableford format · Range: 1–45 · Max 5 scores stored</p>
    </div>
  )
}
