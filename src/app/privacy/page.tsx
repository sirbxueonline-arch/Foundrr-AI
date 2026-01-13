import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { PrivacyContent } from '@/components/legal/PrivacyContent'

export default async function PrivacyPolicy() {
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
                    } catch { }
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    return <PrivacyContent user={user} />
}
