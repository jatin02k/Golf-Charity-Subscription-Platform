'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const PLANS = {
  monthly: { name: 'Monthly', price: 999, display: '₹999/month', period: 'month' },
  yearly: { name: 'Yearly', price: 8999, display: '₹8,999/year', period: 'year', savings: 'Save 25%' }
}

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  async function handleSubscribe() {
  setLoading(true)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { router.push('/login'); return }

  const plan = PLANS[selectedPlan]
  const script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  document.body.appendChild(script)
  script.onload = () => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: plan.price * 100,
      currency: 'INR',
      name: 'GolfGive',
      description: `${plan.name} Subscription`,
      handler: async function(response: any) {
        const now = new Date()
        const end = new Date(now)
        if (selectedPlan === 'monthly') end.setMonth(end.getMonth() + 1)
        else end.setFullYear(end.getFullYear() + 1)

        const { error } = await supabase.from('profiles').update({
          subscription_status: 'active',
          subscription_plan: selectedPlan,
          subscription_start: now.toISOString(),
          subscription_end: end.toISOString(),
          razorpay_subscription_id: response.razorpay_payment_id
        }).eq('id', user.id)

        console.log('Update error:', error)
        console.log('User id:', user.id)
        
        // Force hard navigation instead of soft
        window.location.href = '/dashboard'
      },
      prefill: { email: user.email },
      theme: { color: '#10b981' }
    }
    const rzp = new (window as any).Razorpay(options)
    rzp.open()
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Choose Your Plan</h1>
          <p className="text-white/60 mt-2">Join thousands making a difference through golf</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {(Object.entries(PLANS) as any).map(([key, plan]: any) => (
            <div key={key} onClick={() => setSelectedPlan(key)}
              className={`cursor-pointer rounded-2xl p-6 border-2 transition-all ${selectedPlan === key ? 'border-emerald-400 bg-emerald-500/20' : 'border-white/20 bg-white/10'}`}>
              <div className="text-white font-bold text-lg">{plan.name}</div>
              <div className="text-emerald-400 text-2xl font-bold mt-2">{plan.display}</div>
              {plan.savings && <div className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full mt-2 inline-block">{plan.savings}</div>}
              <ul className="mt-4 space-y-1 text-white/60 text-sm">
                <li>✓ Monthly prize draw entry</li>
                <li>✓ Score tracking (5 scores)</li>
                <li>✓ Charity contribution</li>
                <li>✓ Full dashboard access</li>
              </ul>
            </div>
          ))}
        </div>
        <button onClick={handleSubscribe} disabled={loading}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg rounded-2xl transition-all disabled:opacity-50">
          {loading ? 'Processing...' : `Subscribe — ${PLANS[selectedPlan].display}`}
        </button>
        <p className="text-center text-white/40 text-sm mt-4">10% of your subscription goes to your chosen charity</p>
      </div>
    </div>
  )
}
