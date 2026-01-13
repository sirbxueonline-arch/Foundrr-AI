'use client'

import React from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import { Check, X, Shield, Zap, Code2, Smartphone } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage({ user }: { user: any }) {
    const { t, lang } = useLanguage()

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar user={user} />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 overflow-hidden bg-background">
                    <div className="absolute top-0 z-[0] h-screen w-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-medium text-muted-foreground mb-4">
                        {lang === 'az' ? 'Sadə və Şəffaf' : 'Simple & Transparent'}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground text-balance">
                        {lang === 'az' ? 'Sayt başına bir qiymət.' : 'One price per website.'} <br />
                        {lang === 'az' ? 'Abunəlik yoxdur.' : 'No subscriptions ever.'}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                        {lang === 'az'
                            ? 'Yalnız saytınız hazır olduqda ödəniş edin. Gizli aylıq ödəniş yoxdur. Ömürlük sahiblik.'
                            : 'Pay only when you\'re ready to launch. No hidden monthly fees. Lifetime ownership.'}
                    </p>
                </div>
                </section>

                {/* Pricing Cards */}
                <section className="pb-24">
                    <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8 items-start">

                            {/* Free Plan */}
                            <div className="rounded-3xl border border-border p-8 bg-card shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                <div className="mb-8 text-center">
                                    <h3 className="text-lg font-medium text-muted-foreground">{lang === 'az' ? 'Yaradıcılıq' : 'Creation'}</h3>
                                    <div className="text-5xl font-bold mt-4 mb-2">0 <span className="text-2xl font-normal text-muted-foreground">AZN</span></div>
                                    <p className="text-sm text-muted-foreground">{lang === 'az' ? 'Sınaq üçün mükəmməldir' : 'Perfect for experimenting'}</p>
                                </div>
                                <ul className="space-y-4 mb-8 w-fit mx-auto text-left">
                                    <li className="flex items-center gap-3 text-sm">
                                        <Check className="w-5 h-5 text-green-500 shrink-0" />
                                        {lang === 'az' ? 'Limitsiz AI Generasiyası' : 'Unlimited AI Generation'}
                                    </li>
                                    <li className="flex items-center gap-3 text-sm">
                                        <Check className="w-5 h-5 text-green-500 shrink-0" />
                                        {lang === 'az' ? 'Dizayn Redaktoru' : 'Visual Design Editor'}
                                    </li>
                                    <li className="flex items-center gap-3 text-sm">
                                        <Check className="w-5 h-5 text-green-500 shrink-0" />
                                        {lang === 'az' ? 'İstənilən vaxt önizləmə' : 'Preview Anytime'}
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <X className="w-5 h-5 shrink-0" />
                                        {lang === 'az' ? 'HTML Yükləmə yoxdur' : 'No HTML Download'}
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <X className="w-5 h-5 shrink-0" />
                                        {lang === 'az' ? 'Xüsusi Domen yoxdur' : 'No Custom Domain Hosting'}
                                    </li>
                                </ul>
                                <Link href="/login" className="block w-full py-3 rounded-xl border border-input bg-background hover:bg-muted text-center font-medium transition-colors">
                                    {lang === 'az' ? 'Pulsuz Başla' : 'Start for Free'}
                                </Link>
                            </div>

                            {/* Pro Plan */}
                            <div className="rounded-3xl border border-primary/20 bg-background shadow-2xl relative overflow-hidden ring-1 ring-primary/20">
                                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
                                <div className="p-8">
                                    <div className="mb-8 text-center">
                                        <h3 className="text-lg font-medium text-primary">{lang === 'az' ? 'Sahiblik' : 'Ownership'}</h3>
                                        <div className="flex items-baseline justify-center gap-2 mt-4 mb-2">
                                            <span className="text-5xl font-bold">49.99</span>
                                            <span className="text-2xl font-normal text-muted-foreground">AZN</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{lang === 'az' ? 'Sayt başına birdəfəlik ödəniş' : 'One-time payment per site'}</p>
                                    </div>
                                    <ul className="space-y-4 mb-8 w-fit mx-auto text-left">
                                        <li className="flex items-center gap-3 text-sm font-medium">
                                            <div className="p-1 rounded-full bg-green-500/10 text-green-600 shrink-0"><Check className="w-3 h-3" /></div>
                                            {lang === 'az' ? 'Tam HTML/CSS Koduna Çıxış' : 'Full HTML/CSS Code Access'}
                                        </li>
                                        <li className="flex items-center gap-3 text-sm font-medium">
                                            <div className="p-1 rounded-full bg-green-500/10 text-green-600 shrink-0"><Check className="w-3 h-3" /></div>
                                            {lang === 'az' ? 'Dərhal Yükləmə (ZIP)' : 'Instant Download (ZIP)'}
                                        </li>
                                        <li className="flex items-center gap-3 text-sm font-medium">
                                            <div className="p-1 rounded-full bg-green-500/10 text-green-600 shrink-0"><Check className="w-3 h-3" /></div>
                                            {lang === 'az' ? 'Kommersiya İstifadə Hüququ' : 'Commercial Usage Rights'}
                                        </li>
                                        <li className="flex items-center gap-3 text-sm font-medium">
                                            <div className="p-1 rounded-full bg-green-500/10 text-green-600 shrink-0"><Check className="w-3 h-3" /></div>
                                            {lang === 'az' ? 'SEO üçün Hazır' : 'SEO Optimized Code'}
                                        </li>
                                        <li className="flex items-center gap-3 text-sm font-medium">
                                            <div className="p-1 rounded-full bg-green-500/10 text-green-600 shrink-0"><Check className="w-3 h-3" /></div>
                                            {lang === 'az' ? 'Məhdudiyyətsiz Düzəlişlər' : 'Unlimited Future Edits'}
                                        </li>
                                    </ul>
                                    <Link href="/login" className="block w-full py-3 rounded-xl bg-primary text-primary-foreground text-center font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                                        {lang === 'az' ? 'İndi Başla' : 'Get Started'}
                                    </Link>
                                </div>
                                <div className="bg-muted/50 p-4 text-center text-xs text-muted-foreground border-t border-border/50">
                                    {lang === 'az' ? '30 gün pulun geri qaytarılması zəmanəti' : '30-day money-back guarantee'}
                                </div>
                            </div>

                            {/* Enterprise Plan */}
                            <div className="rounded-3xl border border-border p-8 bg-card shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                <div className="mb-8 text-center">
                                    <h3 className="text-lg font-medium text-muted-foreground">{lang === 'az' ? 'Agentlik' : 'Agency'}</h3>
                                    <div className="text-3xl font-bold mt-4 mb-2">{lang === 'az' ? 'Razılaşma ilə' : 'Custom Quote'}</div>
                                    <p className="text-sm text-muted-foreground">{lang === 'az' ? 'Mürəkkəb layihələr üçün xüsusi həllər' : 'For complex projects needing extra power'}</p>
                                </div>
                                <ul className="space-y-4 mb-8 w-fit mx-auto text-left">
                                    <li className="flex items-center gap-3 text-sm">
                                        <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                                        {lang === 'az' ? 'İstifadəçi Girişi və Auth' : 'User Login & Authentication'}
                                    </li>
                                    <li className="flex items-center gap-3 text-sm">
                                        <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                                        {lang === 'az' ? 'Backend İnteqrasiyası' : 'Backend Database Integration'}
                                    </li>
                                    <li className="flex items-center gap-3 text-sm">
                                        <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                                        {lang === 'az' ? 'Çoxsəhifəli Dizayn' : 'Multi-page Custom Design'}
                                    </li>
                                    <li className="flex items-center gap-3 text-sm">
                                        <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                                        {lang === 'az' ? 'Ödəniş Sistemləri' : 'Payment Frameworks'}
                                    </li>
                                    <li className="flex items-center gap-3 text-sm">
                                        <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                                        {lang === 'az' ? 'Xüsusi Funksionallıq' : 'Custom Functionality'}
                                    </li>
                                </ul>
                                <a href="mailto:contact@foundrr.com" className="block w-full py-3 rounded-xl border border-indigo-500/20 bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-center font-bold transition-colors">
                                    {lang === 'az' ? 'Bizimlə Əlaqə' : 'Contact Us'}
                                </a>
                            </div>

                        </div>
                    </div>
                </section>

                {/* FAQ Style Grid */}
                <section className="py-24 bg-muted/30 border-t border-border/40">
                    <div className="container px-4 md:px-6 max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0">
                                    <Code2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-2">{lang === 'az' ? 'Kod mənimdir?' : 'Is the code mine?'}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {lang === 'az' ? 'Bəli. Ödəniş etdikdən sonra kodu yükləyə bilərsiniz. Heç bir asılılıq yoxdur, istənilən yerdə yerləşdirin.' : 'Yes. Once you pay, you own the code. You can download it and host it anywhere (Netlify, Vercel, FTP). No lock-in.'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 shrink-0">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-2">{lang === 'az' ? 'Təhlükəsizlik?' : 'Is payment secure?'}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {lang === 'az' ? 'Biz bank səviyyəsində təhlükəsizlikdən istifadə edirik. Məlumatlarınız şifrələnir və qorunur.' : 'We use bank-level SSL encryption. Your payment details are processed securely through trusted providers.'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 shrink-0">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-2">{lang === 'az' ? 'Dəyişikliklər edə bilərəm?' : 'Can I edit later?'}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {lang === 'az' ? 'Bəli. Ödənişsiz dəyişikliklər edə və yenidən yükləyə bilərsiniz.' : 'Yes. You can come back, use our AI to make edits, and re-download the updated code anytime for free.'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 shrink-0">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-2">{lang === 'az' ? 'Saytlar mobildir?' : 'Are sites mobile ready?'}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {lang === 'az' ? '100%. Bütün saytlar responsivdir və mobil cihazlar üçün optimallaşdırılıb.' : '100%. All generated websites are fully responsive and optimized for mobile, tablet, and desktop.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    )
}
