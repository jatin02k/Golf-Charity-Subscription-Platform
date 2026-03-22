'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const supabase = createClient()
  const router = useRouter()

  async function logout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <button onClick={logout}
      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/60 hover:text-white text-sm rounded-xl transition-all border border-white/20">
      Sign Out
    </button>
  )
}