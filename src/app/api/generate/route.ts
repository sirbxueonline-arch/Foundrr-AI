import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {}
          },
        },
      }
    )

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { businessName, service, targetCustomer, location, contactInfo } = body

    if (!businessName || !service) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 🔒 SYSTEM PROMPT (VERSION 4.0 - PREMIUM UPGRADE)
    const systemPrompt = `
You are an expert AI Frontend Engineer specializing in **Awwwards-winning, high-conversion landing pages**.
Your goal is to generate a SINGLE html file containing a complete, production-ready website.

⚠️ CRITICAL TECH STACK REQUIREMENTS:
1.  **Framework**: NONE. Use vanilla HTML5.
2.  **Styling**: **Tailwind CSS (via CDN)**.
3.  **Icons**: **FontAwesome (via CDN)**.
4.  **Fonts**: **Google Fonts (Inter, Outfit, or Playfair Display)**.
5.  **Images**: Use \`UNSPLASH_IMG:{specific_keyword}\`.

🎨 DYNAMIC THEME ENGINE (CHOOSE ONE BASED ON VIBE):
Analyze the client's business (${businessName}) and strict ${targetCustomer} audience.
SELECT ONE of these color palettes and configure tailwind in the script:

1.  **"Oceanic" (Tech/Trust)**:
    - Primary: #0ea5e9 (Sky 500), Secondary: #0f172a (Slate 900)
    - Background: Slate 950 -> Slate 900 gradient.
2.  **"Midnight Purple" (SaaS/Creative)**:
    - Primary: #a855f7 (Purple 500), Secondary: #fafafa (Zinc 50)
    - Background: Zinc 950 -> Black gradient.
3.  **"Sunset" (Lifestyle/Food)**:
    - Primary: #f97316 (Orange 500), Secondary: #fff7ed (Orange 50)
    - Background: Stone 950 -> Stone 900 gradient.
4.  **"Forest" (Eco/Nature/Finance)**:
    - Primary: #10b981 (Emerald 500), Secondary: #064e3b (Emerald 900)
    - Background: Green 950 -> Black.

*Configure the tailwind colors object with these specific hex codes as 'primary' and 'secondary'.*

🧩 RICH COMPONENT LIBRARY (MANDATORY):
You MUST use these complex HTML patterns:

1.  **FAQ Accordion**: Use \`<details class="group">\` and \`<summary>\` for smooth native accordions.
    - Style the summary marker with a rotating FontAwesome arrow.
    - Add \`border-b border-white/10\` between items.
2.  **Pricing Table**:
    - Highlight the "Pro/Best Value" card with a border gradient or glow (\`ring-2 ring-primary\`).
    - Use checkmark icons list for features.
3.  **Testimonial Cards**:
    - MUST include a small avatar image (\`rounded-full w-10 h-10\`).
    - Use a glassmorphic card background.
4.  **Mobile Navigation (Hamburger)**:
    - On mobile (\`lg:hidden\`), show a \`<button>\` with a 'fa-bars' icon.
    - Implement a simple script to toggle a full-screen mobile menu overlay.

✍️ COPYWRITING FRAMEWORKS:
- **Hero**: Use the "Value Proposition" formula: [Benefit] + [Objection Handling]. (e.g., "Get Fit in 30 Days Without Giving Up Pizza").
- **Features**: Use "Benefit-First" headers. don't say "Fast" say "Save 10 Hours a Week".
- **CTA**: Use Action-Oriented text ("Start Your Free Trial", "Claim Offer") not "Submit".

⚠️ LAYOUT & DESIGN RULES:
1.  **HERO**: Split or Bento Grid ONLY. No centered text.
2.  **DENSITY**: background gradients (\`bg-gradient-to-br\`), glassmorphism (\`backdrop-blur-xl\`), and thin borders (\`border-white/10\`) EVERYWHERE.
3.  **IMAGES**: All images must be \`w-full h-full object-cover\`.

✨ REQUIRED ANIMATIONS (SCROLL REVEAL):
Add the IntersectionObserver script to animate elements with \`opacity-0 translate-y-10\` to \`opacity-100 translate-y-0\` on scroll.

OUTPUT FORMAT:
Return ONLY the raw HTML code. Do not wrap in markdown code blocks.
`

    // 👤 USER MESSAGE = DATA ONLY
    const userPrompt = `
Business Name: ${businessName}
What They Do: ${service}
Target Audience: ${targetCustomer || 'General'}
Location: ${location || 'Online'}
Contact Info: ${contactInfo || 'Not provided'}
`

    // Implement Retry Logic (Max 2 Attempts)
    let html = ''
    let attempts = 0
    const maxAttempts = 2

    while (attempts < maxAttempts) {
      attempts++
      console.log(`Generation Attempt ${attempts}...`)
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.25, // Low temperature for consistency
      })

      html = completion.choices[0].message.content || ''
      html = html.replace(/```html/g, '').replace(/```/g, '').trim()

      // Post-Check: Verify HTML structure
      const hasDoctype = html.toLowerCase().includes('<!doctype html')
      const hasTailwind = html.includes('cdn.tailwindcss.com')
      const hasStyle = html.toLowerCase().includes('<style')

      if (hasDoctype && (hasStyle || hasTailwind)) {
         // 🖼️ PROCESS IMAGES (Server-side Unsplash Interception)
         try {
             // ... image processing code ...
             const regex = /UNSPLASH_IMG:([a-zA-Z0-9]+)/g;
             const matches = [...html.matchAll(regex)];
             const uniqueKeywords = [...new Set(matches.map(m => m[1]))];

             if (uniqueKeywords.length > 0) {
                 console.log('Fetching Unsplash images for:', uniqueKeywords);
                 
                 const imageMap = new Map();
                 await Promise.all(uniqueKeywords.map(async (keyword) => {
                     try {
                         const unsplashRes = await fetch(`https://api.unsplash.com/photos/random?query=${keyword}&orientation=landscape&client_id=${process.env.UNSPLASH_ACCESS_KEY}`);
                         if (unsplashRes.ok) {
                             const data = await unsplashRes.json();
                             const imageUrl = data.urls?.regular || data.urls?.small; // Prefer regular
                             if (imageUrl) imageMap.set(keyword, imageUrl);
                         } else {
                            console.warn(`Unsplash Error for ${keyword}:`, unsplashRes.status);
                         }
                     } catch (e) {
                         console.error(`Failed to fetch image for ${keyword}`, e);
                     }
                 }));

                 // Replace placeholders
                 html = html.replace(regex, (match, keyword) => {
                     return imageMap.get(keyword) || `https://loremflickr.com/1600/900/${keyword}`; // Fallback if API fails/limits
                 });
             }
         } catch (e) {
             console.error('Image processing failed:', e);
             // If processing fails, regex replace with loremflickr fallback
             html = html.replace(/UNSPLASH_IMG:([a-zA-Z0-9]+)/g, 'https://loremflickr.com/1600/900/$1');
         }

         break // Valid output, exit loop
      } else if (attempts < maxAttempts) {
        console.warn(`Attempt ${attempts} failed validation (Missing DOCTYPE or Tailwind/Style). Retrying...`)
      }
    }

    // Sanitize - ALLOW Tailwind Scripts for MVP
    // We strictly remove on* events and javascript: protocols, but allow <script> tags for Tailwind/FontAwesome
    html = html.replace(/\son\w+="[^"]*"/gmi, '')
    html = html.replace(/javascript:/gi, '')
    // html = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gmi, '') // REMOVED to allow Tailwind

    const siteId = Math.random().toString(36).substring(2, 9)
    const fileName = `${user.id}/${siteId}/index.html`

    const { error: uploadError } = await supabase.storage
      .from('websites')
      .upload(fileName, html, {
        contentType: 'text/html',
        upsert: true,
      })

    if (uploadError) throw new Error('Failed to save website')

    const { error: dbError } = await supabase.from('websites').insert({
      id: siteId,
      user_id: user.id,
      html_path: fileName,
      paid: false,
      created_at: new Date().toISOString(),
    })

    if (dbError) throw new Error('Failed to save record')

    return NextResponse.json({ siteId })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
