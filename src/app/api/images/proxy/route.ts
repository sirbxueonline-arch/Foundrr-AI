import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.redirect('https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80') // Gradient backup
  }

  try {
    // 1. Try Pexels (High Quality, needs PEXELS_API_KEY)
    if (process.env.PEXELS_API_KEY) {
      const pexelsRes = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
        headers: { Authorization: process.env.PEXELS_API_KEY }
      })
      if (pexelsRes.ok) {
        const data = await pexelsRes.json()
        const imageUrl = data.photos?.[0]?.src?.large
        if (imageUrl) return NextResponse.redirect(imageUrl)
      }
    }
  } catch (error) {
    console.error('Image Proxy Error:', error)
  }

  // Fallback to Pollinations AI (Reliable, free, infinite generation)
  const fallbackPrompt = query || 'abstract tech background'
  return NextResponse.redirect(`https://image.pollinations.ai/prompt/${encodeURIComponent(fallbackPrompt)}?width=800&height=600&nologo=true`)
}
