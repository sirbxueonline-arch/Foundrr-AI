export interface PricingFactors {
    pageCount: number
    sectionCount: number
    businessType: 'personal' | 'freelancer' | 'local' | 'startup' | 'ecommerce'
    copyDepth: 'minimal' | 'clear' | 'long'
    designRichness: 'simple' | 'clean' | 'premium'
}

export const PRICING_BUCKETS = [20, 29, 39, 49, 59, 79, 99]

export function calculatePrice(factors: PricingFactors): number {
    let score = 20 // Base Price

    // 1. Page Count
    if (factors.pageCount >= 7) score += 25
    else if (factors.pageCount >= 4) score += 15
    else if (factors.pageCount >= 2) score += 8
    // else +0

    // 2. Section Complexity
    if (factors.sectionCount >= 11) score += 20
    else if (factors.sectionCount >= 8) score += 15
    else if (factors.sectionCount >= 5) score += 8
    // else +0

    // 3. Business Type
    switch (factors.businessType) {
        case 'ecommerce': score += 30; break;
        case 'startup': score += 25; break;
        case 'local': score += 15; break;
        case 'freelancer': score += 8; break;
        default: score += 0; break;
    }

    // 4. Copy Depth
    switch (factors.copyDepth) {
        case 'long': score += 15; break;
        case 'clear': score += 8; break;
        default: score += 0; break;
    }

    // 5. Design Richness
    switch (factors.designRichness) {
        case 'premium': score += 15; break;
        case 'clean': score += 8; break;
        default: score += 0; break;
    }

    // Clamp to Max 100
    if (score > 100) score = 100

    // Round to nearest allowed bucket
    // Logic: Find the closest bucket to the raw score. 
    // If score is 45, closest is 49. If 42, closest 39 or 49? 
    // "Round to nearest".
    // Let's iterate and find min diff.

    let finalPrice = PRICING_BUCKETS[0]
    let minDiff = Math.abs(score - finalPrice)

    for (const bucket of PRICING_BUCKETS) {
        const diff = Math.abs(score - bucket)
        if (diff <= minDiff) {
            // greedy take higher if equal diff? or strictly nearest?
            // Usually rounding up is better for business, but let's stick to strict nearest.
            // If equal (e.g. 24.5 between 20 and 29), let's go up.
            minDiff = diff
            finalPrice = bucket
        }
    }

    return finalPrice
}

// Helper to analyze HTML and Prompt to derive factors
export function analyzeSite(html: string, prompt: string, fileCount: number): PricingFactors {
    const lowerPrompt = prompt.toLowerCase()
    const lowerHtml = html.toLowerCase()

    // Business Type Heuristics
    let businessType: PricingFactors['businessType'] = 'personal'
    if (lowerPrompt.includes('shop') || lowerPrompt.includes('store') || lowerPrompt.includes('ecommerce') || lowerPrompt.includes('sell')) {
        businessType = 'ecommerce'
    } else if (lowerPrompt.includes('saas') || lowerPrompt.includes('startup') || lowerPrompt.includes('app') || lowerPrompt.includes('platform')) {
        businessType = 'startup'
    } else if (lowerPrompt.includes('restaurant') || lowerPrompt.includes('cafe') || lowerPrompt.includes('gym') || lowerPrompt.includes('clinic') || lowerPrompt.includes('service')) {
        businessType = 'local'
    } else if (lowerPrompt.includes('portfolio') || lowerPrompt.includes('freelance') || lowerPrompt.includes('agency')) {
        businessType = 'freelancer'
    }

    // Section Count (Heuristic: count <section> tags or divs with distinct IDs like 'hero', 'about', etc)
    // Simple regex for <section
    const sectionMatches = (html.match(/<section/g) || []).length
    // Also count divs with id="..." which often act as sections
    const divIdMatches = (html.match(/<div [^>]*id=["'](hero|about|services|features|pricing|contact|testimonials|faq|footer)["']/g) || []).length
    const totalSections = Math.max(sectionMatches, divIdMatches, 1) // At least 1

    // Copy Depth (Word count of body text)
    // Strip tags
    const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')
    const wordCount = textContent.split(' ').length
    let copyDepth: PricingFactors['copyDepth'] = 'minimal'
    if (wordCount > 600) copyDepth = 'long'
    else if (wordCount > 300) copyDepth = 'clear'

    // Design Richness
    // Heuristics: usage of gradients, specific complex classes, etc.
    // Or map style from Prompt/DB if available?
    // Let's infer from HTML class complexity?
    // Simple heuristic: If it has "gradient" or "backdrop-blur" or "shadow-2xl" -> Premium.
    let designRichness: PricingFactors['designRichness'] = 'simple'
    if (lowerHtml.includes('gradient') || lowerHtml.includes('backdrop-blur') || lowerHtml.includes('animate-')) {
        designRichness = 'premium'
    } else if (lowerHtml.includes('container') && lowerHtml.includes('grid')) {
        designRichness = 'clean'
    }

    return {
        pageCount: fileCount,
        sectionCount: totalSections,
        businessType,
        copyDepth,
        designRichness
    }
}
