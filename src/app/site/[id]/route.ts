import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params
    const cookieStore = await cookies()
    // Use Service Role Key to bypass RLS for public sites
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { cookies: { getAll() { return cookieStore.getAll() }, setAll() { } } }
    )

    // 1. Get record using SLUG (passed as id param due to Next.js dynamic route naming)
    // We expect the URL to be /site/[slug], so `id` is the slug.
    const { data: site, error } = await supabase
        .from('websites')
        .select('html_path, is_published, user_id, id')
        .eq('slug', id)
        .single()

    if (error || !site) {
        return new NextResponse('Site not found', { status: 404 })
    }

    // 2. Check Published Status
    if (!site.is_published) {
        return new NextResponse('This site is not published yet.', { status: 404 })
    }

    // 3. Download HTML
    const { data: fileData, error: downloadError } = await supabase.storage
        .from('websites')
        .download(site.html_path)

    if (downloadError || !fileData) {
        return new NextResponse('Content not found', { status: 404 })
    }

    // 4. Inject Analytics (Public View)
    // We want to track views on the public URL too!
    const editorScript = `
    <script>
      fetch('/api/track?siteId=' + '${site.id}');
    </script>
  `;

    const htmlContent = await fileData.text();
    const htmlWithScript = htmlContent.replace('</body>', `${editorScript}</body>`);

    return new NextResponse(htmlWithScript, {
        headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'public, max-age=60', // Cache for speed
        }
    })
}
