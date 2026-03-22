import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function CharitiesPage() {
  const supabase = await createClient()
  const { data: charities } = await supabase.from('charities').select('*').order('featured', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-white font-bold text-xl">⛳ GolfGive</Link>
        <Link href="/signup" className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-xl">Subscribe</Link>
      </nav>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-white text-4xl font-bold mb-3">Our Charities</h1>
        <p className="text-white/60 mb-10">Every subscription contributes to these causes. Choose yours at signup.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {charities?.map(c => (
            <div key={c.id} className="bg-white/10 border border-white/20 rounded-2xl overflow-hidden">
              <img src={c.image_url} alt={c.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-white font-semibold text-lg">{c.name}</h3>
                  {c.featured && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">Featured</span>}
                </div>
                <p className="text-white/50 text-sm">{c.description}</p>
                {c.website && <a href={c.website} target="_blank" className="text-emerald-400 text-sm mt-3 inline-block hover:underline">Visit website →</a>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
