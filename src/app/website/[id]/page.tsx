import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import PreviewWrapper from '@/components/PreviewWrapper'

export default async function WebsitePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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
  if (!user) {
    redirect('/login')
  }

  const { data: site } = await supabase
    .from('websites')
    .select('*')
    .eq('id', id)
    .single()

  if (!site) {
    return <div className="p-8 text-center">Site not found</div>
  }

  if (site.user_id !== user.id) {
    return <div className="p-8 text-center">Unauthorized</div>
  }

  return (
    <PreviewWrapper siteId={site.id} isPaid={site.paid} />
  )
}
