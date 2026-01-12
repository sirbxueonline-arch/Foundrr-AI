import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const siteId = searchParams.get('siteId')

    if (!siteId) {
        return NextResponse.json({ error: 'Missing siteId' }, { status: 400 })
    }

    // Use service role key to bypass RLS for incrementing views
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    try {
        // 1. Get current views
        const { data: site, error: fetchError } = await supabase
            .from('websites')
            .select('views')
            .eq('id', siteId)
            .single()

        if (fetchError) throw fetchError

        // 2. Increment
        // Note: In high traffic, this is race-condition prone. 
        // Ideally use store procedure: rpc('increment_views', { row_id: siteId })
        // For MVP, this is fine.
        const { error: updateError } = await supabase
            .from('websites')
            .update({ views: (site?.views || 0) + 1 })
            .eq('id', siteId)

        if (updateError) throw updateError

        // Return transparent 1x1 pixel
        // Or just JSON since we'll likely fetch it via JS
        return NextResponse.json({ success: true, views: (site?.views || 0) + 1 })

    } catch (error) {
        console.error('Track error:', error)
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}
