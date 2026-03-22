'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function CharityCard({ profile }: { profile: any }) {
  const [percent, setPercent] = useState(profile?.charity_contribution_percent || 10)
  const [saved, setSaved] = useState(false)
  const [charity, setCharity] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    if (profile?.charity_id) {
      supabase.from('charities').select('*').eq('id', profile.charity_id).single()
        .then(({ data }) => setCharity(data))
    }
  }, [profile?.charity_id])

  async function savePercent() {
    await supabase.from('profiles').update({ charity_contribution_percent: percent }).eq('id', profile.id)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const monthlyAmount = profile?.subscription_plan === 'yearly' 
    ? Math.round(8999 / 12 * percent / 100) 
    : Math.round(999 * percent / 100)

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
      <h2 className="text-white font-semibold mb-4">Your Charity</h2>
      {charity ? (
        <>
          <div className="flex items-center gap-3 mb-4">
            <img src={charity.image_url} alt={charity.name} className="w-12 h-12 rounded-xl object-cover" />
            <div>
              <p className="text-white font-medium">{charity.name}</p>
              <p className="text-white/40 text-xs">{charity.description?.slice(0, 60)}...</p>
            </div>
          </div>
          <div>
            <label className="text-white/60 text-sm">
              Contribution: <span className="text-emerald-400 font-bold">{percent}%</span> (≈₹{monthlyAmount}/mo)
            </label>
            <input type="range" min={10} max={50} value={percent} 
              onChange={e => setPercent(Number(e.target.value))}
              className="w-full mt-2 accent-emerald-400" />
            <button onClick={savePercent} 
              className="mt-3 px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-sm hover:bg-emerald-500/30 transition-all">
              {saved ? '✓ Saved!' : 'Save'}
            </button>
          </div>
        </>
      ) : (
        <p className="text-white/40 text-sm">
          No charity selected. <a href="/charities" className="text-emerald-400 underline">Choose one</a>
        </p>
      )}
    </div>
  )
}