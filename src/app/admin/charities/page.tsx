'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<any[]>([])
  const [form, setForm] = useState({ name: '', description: '', image_url: '', website: '', featured: false })
  const [showForm, setShowForm] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('charities').select('*').then(({ data }) => setCharities(data || []))
  }, [])

  async function addCharity() {
    const { data } = await supabase.from('charities').insert(form).select().single()
    if (data) { setCharities([...charities, data]); setForm({ name: '', description: '', image_url: '', website: '', featured: false }); setShowForm(false) }
  }

  async function deleteCharity(id: string) {
    await supabase.from('charities').delete().eq('id', id)
    setCharities(charities.filter(c => c.id !== id))
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-2xl font-bold">Charity Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm hover:bg-emerald-400 transition-all">
          + Add Charity
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800 rounded-2xl p-6 border border-white/10 mb-6">
          <h3 className="text-white font-semibold mb-4">New Charity</h3>
          <div className="grid grid-cols-2 gap-4">
            {[['Name', 'name', 'text'], ['Description', 'description', 'text'], ['Image URL', 'image_url', 'text'], ['Website', 'website', 'text']].map(([label, key, type]) => (
              <div key={key}>
                <label className="text-white/60 text-sm">{label}</label>
                <input type={type} value={(form as any)[key]} onChange={e => setForm({...form, [key]: e.target.value})}
                  className="w-full mt-1 px-3 py-2 bg-slate-700 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-400" />
              </div>
            ))}
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} id="featured" />
              <label htmlFor="featured" className="text-white/60 text-sm">Featured</label>
            </div>
          </div>
          <button onClick={addCharity} className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm hover:bg-emerald-400 transition-all">Save Charity</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {charities.map(c => (
          <div key={c.id} className="bg-slate-800 rounded-2xl border border-white/10 overflow-hidden">
            <img src={c.image_url} alt={c.name} className="w-full h-32 object-cover" />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">{c.name}</h3>
                {c.featured && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">Featured</span>}
              </div>
              <p className="text-white/40 text-xs mt-1 line-clamp-2">{c.description}</p>
              <button onClick={() => deleteCharity(c.id)} className="mt-3 text-red-400 text-xs hover:text-red-300 transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
