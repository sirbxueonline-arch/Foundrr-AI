'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Globe } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useLanguage } from '@/contexts/LanguageContext'

interface NavbarProps {
    user: any;
}

export function Navbar({ user }: NavbarProps) {
    const { t, lang, toggleLanguage } = useLanguage()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-xl mx-auto items-center justify-between px-4 sm:px-8">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <Image src="/vercel.svg" alt="Foundry Logo" width={22} height={22} className="invert dark:invert-0" />
                    <span className="text-lg font-bold tracking-tight">foundrr</span>
                </Link>
                <nav className="flex items-center space-x-6 text-sm font-medium">
                    <Link
                        href="/#how-it-works"
                        className="transition-colors hover:text-foreground/80 text-foreground/60 hidden sm:block"
                    >
                        {t?.nav?.howItWorks || "How it works"}
                    </Link>
                    <Link
                        href="/pricing"
                        className="transition-colors hover:text-foreground/80 text-foreground/60 hidden sm:block"
                    >
                        {t?.nav?.pricing || "Pricing"}
                    </Link>

                    {/* Language Toggle */}
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-muted ml-2 transition-colors border border-border/40"
                        aria-label="Toggle Language"
                    >
                        <Globe className="h-3.5 w-3.5" />
                        <span className="text-xs font-semibold uppercase">{lang === 'az' ? 'EN' : 'AZ'}</span>
                    </button>


                    {user ? (
                        <Link href="/projects" className="font-medium">{t?.nav?.dashboard || "Dashboard"}</Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="hidden sm:block transition-colors hover:text-foreground/80 text-foreground/60"
                            >
                                {t?.nav?.login || "Log in"}
                            </Link>
                            <Link
                                href="/login"
                                className={cn(
                                    "inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                )}
                            >
                                {t?.nav?.getStarted || "Get Started"}
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}
