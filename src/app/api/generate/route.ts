import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { TEMPLATES } from '@/lib/generator-templates'

// Initialize lazily
export async function POST(request: Request) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
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
            } catch { }
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, style = 'minimal', lang = 'en', primaryColor = '', pages = [] } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 })
    }

    // Generate a secure ID immediately
    const siteId = Math.random().toString(36).substring(2, 9)
    const fileName = `${user.id}/${siteId}/index.html`

    // Generate Navbar Links
    const standardLinks = ['Home'] // Home is always there
    if (pages.includes('Features')) standardLinks.push('Features')
    if (pages.includes('Pricing')) standardLinks.push('Pricing')
    if (pages.includes('About')) standardLinks.push('About')
    if (pages.includes('Blog')) standardLinks.push('Blog')
    if (pages.includes('Contact')) standardLinks.push('Contact')

    const navLinksHtml = standardLinks.filter(l => l !== 'Home').map(link => 
      `<button onclick="navigateTo('${link.toLowerCase()}')" class="px-5 py-2 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white hover:shadow-sm transition-all">${link}</button>`
    ).join('\n')

    const mobileNavLinksHtml = standardLinks.filter(l => l !== 'Home').map(link => 
      `<button onclick="navigateTo('${link.toLowerCase()}'); toggleMobileMenu()" class="text-left font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 dark:text-white">${link}</button>`
    ).join('\n')

    // Detect if this is an architecture/minimal site
    const isArchitectural = prompt.toLowerCase().includes('architecture') || 
                           prompt.toLowerCase().includes('interior') || 
                           prompt.toLowerCase().includes('construction') ||
                           style === 'minimal' || 
                           style === 'elegant';

    // Generate Navbar Links (Minimal variant has different classes)
    const navLinksHtmlMinimal = standardLinks.filter(l => l !== 'Home').map(link => 
      `<button onclick="navigateTo('${link.toLowerCase()}')" class="hover:text-stone-900 dark:hover:text-white transition-colors">${link}</button>`
    ).join('\n')

    // Generate Footer Links (Product Column)
    const productFooterLinks = []
    if (pages.includes('Features')) productFooterLinks.push('Features')
    if (pages.includes('Pricing')) productFooterLinks.push('Pricing')
    
    const footerProductHtml = productFooterLinks.map(link => 
        `<li><button onclick="navigateTo('${link.toLowerCase()}')" class="hover:text-black">${link}</button></li>`
    ).join('\n')

    // Generate Footer Links (Company Column)
    const companyFooterLinks = []
    if (pages.includes('About')) companyFooterLinks.push('About')
    if (pages.includes('Blog')) companyFooterLinks.push('Blog')
    if (pages.includes('Contact')) companyFooterLinks.push('Contact')

    const footerCompanyHtml = companyFooterLinks.map(link => 
        `<li><button onclick="navigateTo('${link.toLowerCase()}')" class="hover:text-black">${link}</button></li>`
    ).join('\n')

    // Prepare Navbar & Footer Template with injected links
    const navbarTemplate = (isArchitectural ? TEMPLATES.NAVBAR_MINIMAL : TEMPLATES.NAVBAR)
      .replace('{{NAV_LINKS}}', isArchitectural ? navLinksHtmlMinimal : navLinksHtml)
      .replace('{{MOBILE_NAV_LINKS}}', mobileNavLinksHtml)

    const footerTemplate = TEMPLATES.FOOTER
      .replace('{{FOOTER_PRODUCT_LINKS}}', footerProductHtml)
      .replace('{{FOOTER_COMPANY_LINKS}}', footerCompanyHtml)

    const systemPrompt = `
    You are an expert Frontend Architect and UI/UX Designer.
    
    GOAL: Build a high-performance, WORLD-CLASS Single Page Application (SPA) using Tailwind CSS.
    
    STRICT RULES:
    1.  **Output**: Return ONLY the raw HTML code. Do not wrap in markdown \`\`\`.
    2.  **Tech Stack**: HTML5, Tailwind CSS (CDN), FontAwesome (CDN), Google Fonts, AOS (Animate On Scroll).
    3.  **Language**: All visible text MUST be in ${lang === 'az' ? 'Azerbaijani (Azərbaycan dili)' : 'English'}.
        - Translate ALL headlines, paragraphs, buttons, and navigation links.
        - Do NOT mix languages.

    4.  **SEO & Performance**: 
        -   <title>Catchy Title | Brand</title>
        -   <meta name="description" content="Engaging 160 char description...">
        -   <link rel="preconnect" href="https://fonts.googleapis.com">
        -   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        -   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@500;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
    5.  **Images**: Use \`/api/images/proxy?query=KEYWORD\` for ALL images. 
        -   **Specifics Matter**: NEVER use "office". Use "modern minimalist white office workspace with macbook".
        -   **Style Matching**: If layout is "Dark", query "dark futuristic cyber city". If "Luxury", query "marble gold texture luxury interior".
    6.  **Design System & Aesthetics (MOBILE FIRST)**:
        -   **Mobile Logic**: ALWAYS design for mobile first. Use \`flex-col\` by default, \`md:flex-row\` for desktop.
        -   **Touch Targets**: ALL buttons/links MUST be at least 44px high. Use \`py-3\` or \`h-12\`.
        -   **Typography**: 
            - Headings: \`text-4xl\` on mobile, \`md:text-6xl\` or \`lg:text-7xl\` on desktop.
            - Body: \`text-base\` or \`text-lg\`.
            - Fonts: Use 'Outfit' for modern headings, 'Playfair Display' for luxury. 'Inter' for body.
        -   **Spacing**: 
            - Mobile: \`py-12\` or \`py-16\`. \`px-6\`.
            - Desktop: \`md:py-24\` or \`lg:py-32\`.
            - Use "Breathable" layout.
        -   **Visuals**: Use glassmorphism (bg-white/90 backdrop-blur-md), subtle borders (border-white/10), and deep shadows (shadow-2xl).
        -   **Colors**: If no primaryColor is given, CHOOSE one based on psychology.
        -   **Animations**: heavily utilize AOS (data-aos="fade-up") with staggered delays.

    7. **Copywriting (The "Apple" Standard)**:
        -   **Rule #1**: NO MARKETING FLUFF.
        -   **Bad**: "Our cutting-edge solution revolutionizes the way you work."
        -   **Good**: "Work faster. Save time."
        -   **Focus**: Active verbs. Short sentences. User benefits.
        -   **Headlines**: Punchy, short (2-5 words), emotional. "Your Ideas. Realized."
    
    8. **Content Completeness**:
        -   **NEGATIVE CONSTRAINTS**: DO NOT use: "Unlock", "Unleash", "Elevate", "Supercharge", "Game-changer", "Revolutionize", "Destiny", "Embark", "Realm", "Tapestry", "Delve", "Cutting-edge", "State-of-the-art".
        -   **NO PLACEHOLDERS**: NEVER use "Lorem Ipsum", "Feature 1", "John Doe". Generate realistic names/titles.
        - **FUNCTIONAL BUTTONS**: ALL buttons and links MUST work.
            - Navigation links must match section IDs (e.g., href="#features").
            - "Get Started" or "Contact" buttons should link to #contact or #pricing.
            - Do NOT use href="#".
        - **FUNCTIONAL BUTTONS**: ALL buttons and links MUST work.
            - Navigation links must match section IDs (e.g., href="#features").
            - "Get Started" or "Contact" buttons should link to #contact or #pricing.
            - Do NOT use href="#".
        - **BRANDING**: The site is generated by "Foundrr Group". DO NOT add any other "Made by" credits in the footer.
        - **STRICT QUALITY**: No broken layouts. No missing images. No lorem ipsum.
        - **TONE**: Adopt a specific persona based on the prompt. If it's a law firm, be "Confident & authoritative". If it's a creative agency, be "Bold & Avant-garde".

    COMPONENT SELECTION:
    Analyze the user's prompt "${prompt}" and choose the best sections.
    
    1. **Navbar**: Always use this (Contains navigation logic). REPLACE 'BRAND_NAME' with a creative name.
       - Ensure standard links: Home (#hero), Features (#features), Pricing (#pricing), Contact (#contact).
    ${navbarTemplate}
    
    2. **Hero Section** (Pick ONE based on prompt type):
       - If SaaS/Startup/Business -> Use HERO_SAAS
         ${TEMPLATES.HERO_SAAS}
       - If Portfolio/Creative/Art or user asks for "Creative" -> Use HERO_CREATIVE
         ${TEMPLATES.HERO_CREATIVE}
       - If style is 'dark' or user asks for "Dark Mode" -> Use HERO_DARK
         ${TEMPLATES.HERO_DARK}
       - If style is 'neobrutal' -> Use HERO_NEOBRUTAL
         ${TEMPLATES.HERO_NEOBRUTAL}
       - If style is 'retro' -> Use HERO_RETRO
         ${TEMPLATES.HERO_RETRO}
       - If style is 'luxury' -> Use HERO_LUXURY
         ${TEMPLATES.HERO_LUXURY}
       - If prompt includes 'architecture', 'interior', 'construction', or style is 'minimal' -> Use HERO_ARCHITECT
         ${TEMPLATES.HERO_ARCHITECT}
       - Else (Default) -> Use HERO_MODERN
         ${TEMPLATES.HERO_MODERN}
    
    3. **Content Sections** (Pick relevant ones based on prompt):
       - If showing work/images -> Include GALLERY or PROJECTS_GALLERY_MINIMAL (for architecture):
         ${TEMPLATES.GALLERY}
         ${TEMPLATES.PROJECTS_GALLERY_MINIMAL}
       - If building trust -> Include TESTIMONIALS:
         ${TEMPLATES.TESTIMONIALS}
       - If requested 'FAQ' -> FAQ:
         ${TEMPLATES.FAQ}
       - If requested 'Team' -> TEAM:
         ${TEMPLATES.TEAM}
       - If prompt includes 'architecture' or 'design' -> Include STATS_MINIMAL:
         ${TEMPLATES.STATS_MINIMAL}

       
       ${pages.includes('Features') ? `- Features/Services Section: ${TEMPLATES.BENTO_GRID} OR ${TEMPLATES.SERVICES_MINIMAL} (Use SERVICES_MINIMAL for architecture/clean brands)` : ''}
       ${pages.includes('Pricing') ? `- Pricing Section: ${TEMPLATES.PRICING}` : ''}
       ${pages.includes('Contact') ? `- Contact Section: ${TEMPLATES.CONTACT}` : ''}


    4. **Extra Pages** (YOU MUST INCLUDE THESE AS HIDDEN SECTIONS):
        - Login Page: ${TEMPLATES.PAGE_LOGIN}
        - Signup Page: ${TEMPLATES.PAGE_SIGNUP}
        ${pages.includes('About') ? `- About Page: ${TEMPLATES.PAGE_ABOUT}` : ''}
        ${pages.includes('Blog') ? `- Blog Page: ${TEMPLATES.PAGE_BLOG}` : ''}
    
    5. **Footer**: Always use this:
    ${footerTemplate}
    
    6. **Router Script**: REQUIRED for navigation:
    ${TEMPLATES.JS_ROUTER}
    
    INSTRUCTIONS:
    - **Assemble**: Put all the selected sections into the \`body\`.
    - **Customize**: MODIFY the text, colors, and images in the templates to MATCH the user's request explicitly.
    - **Translate**: ALL content in templates (Navbar, Hero, Features, etc.) MUST be translated to ${lang === 'az' ? 'Azerbaijani' : 'English'}.
    - **Styles**: 
      - If the user asks for "Dark Mode" or style='dark', add \`bg-slate-950 text-white\` to the body and ensure all components adapt (use dark: classes).
    
    STRUCTURE:
    <!DOCTYPE html>
    <html lang="${lang}" class="${style === 'dark' ? 'dark' : ''}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${prompt}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet">
      <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
      <script>
        tailwind.config = {
          darkMode: 'class',
          theme: {
            extend: {
                fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
                mono: ['Space Grotesk', 'monospace'],
              },
                colors: {
                primary: '${primaryColor ? primaryColor : style === 'vibrant' ? '#4f46e5' : style === 'corporate' ? '#0f172a' : '#18181b'}',
              },
              animation: {
                'fade-in-down': 'fadeInDown 0.5s ease-out',
                'float': 'float 6s ease-in-out infinite',
                'gradient': 'gradient 8s ease infinite',
              },
              keyframes: {
                fadeInDown: {
                  '0%': { opacity: '0', transform: 'translateY(-10px)' },
                  '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                gradient: {
                    '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
                    '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
                },
              }
            }
          }
        }
      </script>
      <style>
        .glass { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid rgba(0,0,0,0.05); }
        html.dark .glass { background: rgba(15, 23, 42, 0.7); border-bottom: 1px solid rgba(255,255,255,0.05); }
        html { scroll-behavior: smooth; }
        .page-section { transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out; }
        .hidden { display: none !important; }
      </style>
    </head>
    <body class="font-sans antialiased text-slate-900 bg-white dark:bg-slate-950 dark:text-white selection:bg-indigo-500 selection:text-white overflow-x-hidden">
    
    <!-- GENERATED SECTIONS GO HERE -->

    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
      AOS.init({
        duration: 800,
        once: true,
        offset: 50,
        easing: 'ease-out-cubic',
      });
    </script>
    </body>
    </html>
    `

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Build a website for: ${prompt}. Style: ${style}.` },
            ],
            stream: true,
          })

          let fullHtml = ''

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              fullHtml += content
              // Stream to client
              controller.enqueue(encoder.encode(content))
            }
          }

          // CLEANUP & SAVE (After stream finishes)
          // We need to clean markdown if present (though system prompt says no)
          // CLEANUP & SAVE (After stream finishes)
          // We need to clean markdown if present (though system prompt says no)
          const cleanHtml = fullHtml.replace(/```html/g, '').replace(/```/g, '').trim()

          // Save to Storage
          await supabase.storage
            .from('websites')
            .upload(fileName, cleanHtml, {
              contentType: 'text/html',
              upsert: true,
            })

          // Save to DB
          await supabase.from('websites').insert({
            id: siteId,
            user_id: user.id,
            html_path: fileName,
            paid: false,
            price: 75.99, // Force explicit price
            name: prompt.substring(0, 30) || 'Untitled Project',
            created_at: new Date().toISOString(),
          })

          // Send a special "end of stream" marker with the site ID so client knows where to redirect
          const metaInfo = JSON.stringify({ siteId })
          controller.enqueue(encoder.encode(`\n<!-- SITE_ID:${siteId} -->`))

          controller.close()
        } catch (err) {
          console.error('Stream Error:', err)
          controller.error(err)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })

  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
