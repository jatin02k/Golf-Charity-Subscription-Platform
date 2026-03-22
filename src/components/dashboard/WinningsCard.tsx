export default function WinningsCard({ drawResults }: { drawResults: any[] }) {
  const winners = drawResults.filter(r => r.prize_amount > 0)
  const total = winners.reduce((sum, r) => sum + r.prize_amount, 0)
  const pending = winners.filter(r => r.payment_status === 'pending')

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
      <h2 className="text-white font-semibold mb-4">Winnings</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <p className="text-emerald-400 text-2xl font-bold">₹{total.toLocaleString()}</p>
          <p className="text-white/40 text-xs mt-1">Total Won</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <p className="text-yellow-400 text-2xl font-bold">{pending.length}</p>
          <p className="text-white/40 text-xs mt-1">Pending Payout</p>
        </div>
      </div>
      {winners.map(r => (
        <div key={r.id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 mb-2">
          <div>
            <span className="text-white text-sm font-medium">₹{r.prize_amount.toLocaleString()}</span>
            <span className="text-white/40 text-xs ml-2">{r.draws?.month}</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${r.payment_status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
            {r.payment_status}
          </span>
        </div>
      ))}
      {winners.length === 0 && <p className="text-white/40 text-sm">No winnings yet. Your lucky draw is coming!</p>}
    </div>
  )
}
