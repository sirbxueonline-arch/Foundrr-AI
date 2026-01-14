import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import LandingContent from '@/components/landing/LandingContent'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'foundrr | AI Website Builder No Subscription',
  description: 'Building a website shouldn\'t exist on a lease. Generate, download, and own your code forever. One-time payment.',
}

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
             try {
               cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
             } catch {}
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    redirect('/generate')
  }
  
  // Note: We are passing the user object to the client component.
  return <LandingContent user={user} />
}
