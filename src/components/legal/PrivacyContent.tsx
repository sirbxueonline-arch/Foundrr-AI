'use client'

import React from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useLanguage } from '@/contexts/LanguageContext'

interface LegalPageProps {
    user: any;
}

export function PrivacyContent({ user }: LegalPageProps) {
    const { t } = useLanguage()
    
    // Safely access nested properties with fallbacks
    const privacy = t.privacy || {
        title: "Privacy Policy",
        lastUpdated: "Last updated",
        sections: []
    }

    const [date, setDate] = React.useState('')
    
    React.useEffect(() => {
        setDate(new Date().toLocaleDateString())
    }, [])

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar user={user} />
            <main className="flex-1 container max-w-4xl mx-auto px-6 py-32 space-y-8">
                <h1 className="text-4xl font-bold tracking-tight">{privacy.title}</h1>
                <p className="text-muted-foreground">{privacy.lastUpdated}: {date}</p>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
                    {privacy.sections?.map((section: any, index: number) => (
                        <section key={index}>
                            <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                            {section.content && <p>{section.content}</p>}
                            {section.items && (
                                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                                    {section.items.map((item: string, i: number) => (
                                        <li key={i}>
                                            {item.includes(":") ? (
                                                <><strong>{item.split(":")[0]}:</strong>{item.substring(item.indexOf(":") + 1)}</>
                                            ) : (
                                                item
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                             {section.list && (
                                <ul className="list-disc pl-6 space-y-1 text-muted-foreground mt-2">
                                    {section.list.map((item: string, i: number) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            )}
                            {/* Special handling for contact section link */}
                            {section.title.includes("Contact") || section.title.includes("Əlaqə") ? (
                                <p className="mt-1">
                                    <a href="mailto:privacy@foundrr.com" className="text-primary hover:underline">privacy@foundrr.com</a>
                                </p>
                            ) : null}
                        </section>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    )
}
