import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { siteId, paymentIdentifier } = body

    if (!siteId) {
      return NextResponse.json({ error: 'Missing site ID' }, { status: 400 })
    }

    // Update paid status
    // In a real app, we would verify a webhook or transaction ID here.
    // For v1 Trust Based: We just trust the user clicked "I've paid".
    
    // Attempt to save payment_identifier
    // Note: If the column doesn't exist, this might throw an error depending on Supabase configuration.
    // We'll try to update it, if it fails, we fall back to just updating 'paid'.
    
    try {
        const { error } = await supabase
          .from('websites')
          .update({ 
            paid: true,
            // @ts-ignore - column might not exist yet in types
            payment_identifier: paymentIdentifier // Attempt to save the receipt/card info
          })
          .eq('id', siteId)
          .eq('user_id', user.id) // Ensure they own it
        
        if (error) throw error
    } catch (e) {
        // Fallback: Just mark as paid if the above failed (likely due to missing column)
        console.warn('Could not save payment_identifier, falling back to paid status only', e)
        const { error: fallbackError } = await supabase
          .from('websites')
          .update({ paid: true })
          .eq('id', siteId)
          .eq('user_id', user.id)
        
        if (fallbackError) {
             console.error('Payment Update Error:', fallbackError)
             return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
        }
    }

    return NextResponse.json({ success: true })

  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
