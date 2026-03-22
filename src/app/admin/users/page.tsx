import { createClient } from '@/lib/supabase/server'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="text-white text-2xl font-bold mb-6">User Management</h1>
      <div className="bg-slate-800 rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700">
            <tr>
              {['Name', 'Email', 'Status', 'Plan', 'Joined'].map(h => (
                <th key={h} className="text-left text-white/60 text-sm px-6 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users?.map(u => (
              <tr key={u.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-white text-sm">{u.full_name || '—'}</td>
                <td className="px-6 py-4 text-white/60 text-sm">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${u.subscription_status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {u.subscription_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-white/60 text-sm capitalize">{u.subscription_plan || '—'}</td>
                <td className="px-6 py-4 text-white/40 text-sm">{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
