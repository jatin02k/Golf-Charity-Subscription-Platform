export type Profile = {
  id: string
  full_name: string
  email: string
  role: 'user' | 'admin'
  subscription_status: 'active' | 'inactive' | 'cancelled'
  subscription_plan: 'monthly' | 'yearly' | null
  subscription_start: string | null
  subscription_end: string | null
  charity_id: string | null
  charity_contribution_percent: number
}

export type Score = {
  id: string
  user_id: string
  score: number
  played_at: string
  created_at: string
}

export type Charity = {
  id: string
  name: string
  description: string
  image_url: string
  website: string
  featured: boolean
  upcoming_events: any[]
}

export type Draw = {
  id: string
  month: string
  status: 'pending' | 'simulated' | 'published'
  draw_type: 'random' | 'algorithmic'
  winning_numbers: number[]
  jackpot_amount: number
  four_match_amount: number
  three_match_amount: number
  jackpot_rolled_over: boolean
}

export type DrawResult = {
  id: string
  draw_id: string
  user_id: string
  matched_count: number
  prize_amount: number
  payment_status: 'pending' | 'paid'
  proof_url: string | null
  verification_status: 'unverified' | 'approved' | 'rejected'
}
