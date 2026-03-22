export default function DrawParticipation({ drawResults }: { drawResults: any[] }) {
  const upcoming = new Date()
  upcoming.setMonth(upcoming.getMonth() + 1)
  upcoming.setDate(1)

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
      <h2 className="text-white font-semibold mb-4">Draw Participation</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <p className="text-emerald-400 text-2xl font-bold">{drawResults.length}</p>
          <p className="text-white/40 text-xs mt-1">Draws Entered</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <p className="text-emerald-400 text-2xl font-bold">{upcoming.toLocaleDateString('en', { month: 'short', day: 'numeric' })}</p>
          <p className="text-white/40 text-xs mt-1">Next Draw</p>
        </div>
      </div>
      {drawResults.slice(0, 3).map(r => (
        <div key={r.id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 mb-2">
          <span className="text-white/60 text-sm">{r.draws?.month}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${r.matched_count >= 5 ? 'bg-yellow-500/20 text-yellow-400' : r.matched_count >= 4 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
            {r.matched_count} Match
          </span>
        </div>
      ))}
      {drawResults.length === 0 && <p className="text-white/40 text-sm">No draw history yet. Keep playing!</p>}
    </div>
  )
}
