# GolfGive - Golf Charity Subscription Platform

A subscription-based web application combining golf performance tracking, 
charity fundraising, and a monthly draw-based reward engine.

Built for Digital Heroes Full Stack Trainee Selection · March 2026

## Live Demo
🌐 [https://golf-charity-subscription-platform-pi.vercel.app](https://golf-charity-subscription-platform-pi.vercel.app)

## Test Credentials

### User Account
- Email: `test@golfgive.com`
- Password: `test123`

### Admin Account
- URL: `/admin`
- Email: `jatingolfgive@gmail.com`
- Password: `admin123`

## How to Test Subscription (Test Mode)

Payments are in **Razorpay test mode**. To complete a subscription:

1. Sign up or log in
2. You will be redirected to `/subscribe`
3. Choose Monthly (₹999) or Yearly (₹8,999)
4. Click Subscribe
5. When Razorpay checkout opens → click **UPI**
6. Enter UPI ID: `success@razorpay`
7. Click Pay — payment succeeds instantly

> Real payments are not processed. This is a test environment.

## Features

### User Features
- Signup with charity selection and contribution percentage
- Monthly / Yearly subscription via Razorpay
- Golf score tracking (Stableford format, 5-score rolling system)
- Score range: 1–45, each score includes a date
- Monthly prize draw participation
- Charity contribution management (10%–50%)
- Winnings and payout tracking dashboard

### Admin Features
- User management (view all users, subscription status)
- Draw engine (simulate + publish, random number generation)
- Charity management (add, edit, delete, featured toggle)
- Winner verification and payout status management
- Analytics overview (total users, prize pool, charity contributions)

## Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Payments**: Razorpay (test mode)
- **Deployment**: Vercel

## Database Schema
- `profiles` - user accounts, subscription status, charity selection
- `scores` - golf scores (max 5 per user, rolling — oldest replaced)
- `charities` - charity directory with featured support
- `draws` - monthly draw engine with simulation mode
- `draw_results` - per-user draw outcomes and prize tracking
- `donations` - independent charity donations

## Draw System
- Random number generation (5 numbers, range 1–45)
- Matches user scores against winning numbers
- Prize distribution:
  - 5 Number Match → 40% Jackpot (rolls over if unclaimed)
  - 4 Number Match → 35%
  - 3 Number Match → 25%
- Admin can simulate before publishing
- Jackpot carries forward to next month if no winner

## Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/jatin02k/-Golf-Charity-Subscription-Platform.git
cd Golf-Charity-Subscription-Platform
npm install
```

### 2. Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_test_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase Setup
- Create a new Supabase project
- Go to SQL Editor and run the full schema from `/supabase/schema.sql`
- Auth is email/password - no additional config needed

### 4. Set Admin Role
After signing up, run this in Supabase SQL Editor:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

### 5. Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment
- Deployed on Vercel
- Backend on Supabase
- Environment variables configured in Vercel project settings
- New accounts created as per assignment requirements

---
Digital Heroes · Full Stack Developer Trainee Selection · March 2026
