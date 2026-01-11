'use client'

import { useState, useEffect, useRef } from 'react'
import { FoundryAgent } from '@/components/FoundryAgent'
import { Lock, Download } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

interface PreviewWrapperProps {
  siteId: string
  isPaid: boolean
}

export default function PreviewWrapper({ siteId, isPaid }: PreviewWrapperProps) {
  const { t } = useLanguage()
  const [reloadKey, setReloadKey] = useState(0)
  // ... state ...

// ... (Effect and handlers remain same)

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col relative">
       {/* Image Editor Modal */}
       {isEditorOpen && (
         <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-white/10 p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">{t?.preview?.editImage || "Edit Image"}</h3>
                    <button onClick={() => setIsEditorOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-zinc-500">{t?.preview?.imageUrl || "Image URL"}</label>
                    <input 
                        className="w-full bg-zinc-100 dark:bg-zinc-800 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://..."
                    />
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={handleDeleteImage}
                        className="flex-1 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 font-medium"
                    >
                        {t?.preview?.deleteImage || "Delete"}
                    </button>
                    <button 
                        onClick={handleSaveImage}
                        className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90"
                    >
                        {t?.preview?.save || "Save Changes"}
                    </button>
                </div>
            </div>
         </div>
       )}

       {/* Top Bar */}
       <div className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 sm:px-6 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Image src="/vercel.svg" alt="Foundry Logo" width={24} height={24} className="invert-0" />
            foundrr
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-mono text-sm pl-2">{siteId}</span>
        </div>
        
        <div className="flex items-center gap-3">
          {!isPaid ? (
            <>
              <div className="flex items-center gap-2 rounded-full bg-amber-100/80 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700 px-4 py-1.5 text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-400 shadow-sm backdrop-blur-sm">
                <Lock className="h-3.5 w-3.5" />
                {t?.preview?.previewMode || "Preview Mode"}
              </div>
              <Link
                href={`/billing?site=${siteId}`}
                className="inline-flex h-9 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 px-6 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/30 active:scale-95"
              >
                 {t?.preview?.unlock || "Unlock & Download"}
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
               <span className="hidden sm:inline-flex text-sm text-green-600 font-medium items-center mr-2">
                 {t?.preview?.paid || "Paid & Unlocked"}
               </span>
               <a
                href={`/api/download/${siteId}`}
                className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Download className="mr-2 h-4 w-4" />
                {t?.preview?.download || "Download"}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Split Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Iframe Container */}
        <div className="relative flex-1 bg-muted/20">
           <iframe
             ref={iframeRef}
             key={reloadKey}
             src={`/api/preview/${siteId}?t=${reloadKey}`}
             className="h-full w-full border-0"
             title="Website Preview"
             sandbox="allow-same-origin allow-scripts allow-modals"
           />
        </div>

        {/* Persistent AI Sidebar */}
        <FoundryAgent 
            siteId={siteId} 
            onUpdate={handleUpdate} 
            className="w-[400px] border-l h-full"
        />
      </div>
    </div>
  )
}
