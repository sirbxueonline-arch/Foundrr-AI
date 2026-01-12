'use client'

import { useState } from 'react'
import { Palette, Type, Check, X } from 'lucide-react'

interface ThemeEditorProps {
    isOpen: boolean
    onClose: () => void
    onApply: (prompt: string) => void
    isApplying: boolean
}

export function ThemeEditor({ isOpen, onClose, onApply, isApplying }: ThemeEditorProps) {
    const [primaryColor, setPrimaryColor] = useState('#000000')
    const [secondaryColor, setSecondaryColor] = useState('#ffffff')
    const [font, setFont] = useState('Inter')

    if (!isOpen) return null

    const handleApply = () => {
        const prompt = `Update the global design system. Change the Primary Color to ${primaryColor}, Secondary Color to ${secondaryColor}, and Font Family to '${font}'. Ensure these variables are applied effectively across the entire CSS.`
        onApply(prompt)
    }

    const fonts = ['Inter', 'Roboto', 'Playfair Display', 'Outfit', 'Space Grotesk']

    return (
        <div className="absolute top-20 right-4 z-40 w-80 rounded-2xl bg-background/95 backdrop-blur-xl border border-border/40 shadow-2xl p-5 animate-in slide-in-from-right-5 fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" /> Theme Editor
                </h3>
                <button onClick={onClose} className="hover:bg-muted p-1 rounded-full">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Colors</label>
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Primary</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">{primaryColor}</span>
                            <input
                                type="color"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="w-8 h-8 rounded-full border-0 p-0 overflow-hidden cursor-pointer"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Secondary</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">{secondaryColor}</span>
                            <input
                                type="color"
                                value={secondaryColor}
                                onChange={(e) => setSecondaryColor(e.target.value)}
                                className="w-8 h-8 rounded-full border-0 p-0 overflow-hidden cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <Type className="w-3 h-3" /> Typography
                    </label>
                    <select
                        value={font}
                        onChange={(e) => setFont(e.target.value)}
                        className="w-full rounded-lg border bg-secondary/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        {fonts.map(f => (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleApply}
                    disabled={isApplying}
                    className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:opacity-90 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    {isApplying ? (
                        <>Applying...</>
                    ) : (
                        <>
                            <Check className="w-4 h-4" /> Apply Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
