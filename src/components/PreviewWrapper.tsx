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
  const [selectedImage, setSelectedImage] = useState<{ src: string, id: string } | null>(null)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Rename features
  const [projectName, setProjectName] = useState("Untitled Project")
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState("")

  // Multi-page features
  const [activeFile, setActiveFile] = useState("index.html")

  // Listen for navigation events from Iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'NAVIGATION' && event.data?.path) {
        // Path might be 'about.html' or '/about.html'
        const cleanPath = event.data.path.replace(/^\//, '')
        setActiveFile(cleanPath)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  useEffect(() => {
    // Fetch site details for name
    const fetchSite = async () => {
      try {
        const res = await fetch(`/api/site/${siteId}`)
        if (res.ok) {
          const data = await res.json()
          if (data.name) setProjectName(data.name)
        }
      } catch (e) {
        console.error("Failed to fetch site details", e)
      }
    }
    fetchSite()
  }, [siteId])

  const handleNameSave = async () => {
    if (!tempName.trim()) {
      setIsEditingName(false)
      return
    }
    const oldName = projectName
    setProjectName(tempName)
    setIsEditingName(false)

    try {
      await fetch(`/api/site/${siteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: tempName })
      })
    } catch (e) {
      console.error("Failed to update name", e)
      setProjectName(oldName) // Revert on error
    }
  }

  const handleUpdate = (filename?: string) => {
    if (filename) setActiveFile(filename)
    setReloadKey(prev => prev + 1)
  }

  const handleSaveImage = async () => {
    if (!selectedImage || !iframeRef.current) return

    // 1. Update Iframe Visually
    iframeRef.current.contentWindow?.postMessage({
      type: 'UPDATE_IMAGE',
      oldSrc: selectedImage.src,
      newSrc: newImageUrl
    }, '*')

    // 2. Persist Changes
    setTimeout(async () => {
      if (!iframeRef.current?.contentDocument) return

      const updatedHtml = iframeRef.current.contentDocument.documentElement.outerHTML
      const cleanHtml = updatedHtml.replace(/<script>[\s\S]*?document\.addEventListener\('DOMContentLoaded'[\s\S]*?<\/script>/, '')

      try {
        await fetch('/api/save-site', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ siteId, html: cleanHtml })
        })
      } catch (e) {
        console.error('Failed to save', e)
        alert('Failed to save changes')
      }
    }, 100)

    setIsEditorOpen(false)
  }

  const handleDeleteImage = () => {
    if (!confirm("Are you sure you want to remove this image?")) return;
    setNewImageUrl('https://placehold.co/1x1/transparent/png')
    // User must click save after this.
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col relative bg-muted/20">

      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Image Editor Modal */}
      {isEditorOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50 p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold tracking-tight">{t?.preview?.editImage || "Edit Image"}</h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t?.preview?.imageUrl || "Image URL"}</label>
              <input
                className="w-full bg-secondary/50 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleDeleteImage}
                className="flex-1 px-4 py-2.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 font-medium text-sm transition-colors"
              >
                {t?.preview?.deleteImage || "Delete"}
              </button>
              <button
                onClick={handleSaveImage}
                className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
              >
                {t?.preview?.save || "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar - Floating Island Style */}
      <div className="relative z-20 px-10 py-6 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3 bg-background/80 backdrop-blur-md border border-border/40 rounded-full px-5 py-2.5 shadow-sm">
          <Link href="/projects" className="flex items-center gap-2 font-bold hover:opacity-80 transition-opacity">
            <Image src="/vercel.svg" alt="Foundry Logo" width={20} height={20} className="invert-0" />
          </Link>
          <span className="text-muted-foreground/40">|</span>

          {isEditingName ? (
            <input
              autoFocus
              className="bg-transparent border-none text-sm font-medium focus:ring-0 w-32 px-0 py-0 h-auto"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNameSave()
                if (e.key === 'Escape') setIsEditingName(false)
              }}
            />
          ) : (
            <span
              className="font-mono text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none"
              onDoubleClick={() => {
                setTempName(projectName)
                setIsEditingName(true)
              }}
              title="Double click to rename"
            >
              {projectName}
            </span>
          )}
        </div>

        <div className="pointer-events-auto flex items-center gap-3">
          {!isPaid ? (
            <>
              <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400 backdrop-blur-md">
                <Lock className="h-3 w-3" />
                {t?.preview?.previewMode || "Preview Mode"}
              </div>
              <Link
                href={`/billing?site=${siteId}`}
                className="group relative inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
                <span className="relative z-20 flex items-center gap-2">
                  {t?.preview?.unlock || "Unlock & Download"}
                </span>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2 bg-background/80 backdrop-blur-md border border-border/40 rounded-full p-1 shadow-sm">
              <span className="hidden sm:inline-flex text-xs text-emerald-600 font-medium items-center px-3">
                {t?.preview?.paid || "Unlocked"}
              </span>
              <a
                href={`/api/download/${siteId}`}
                className="inline-flex h-8 items-center justify-center rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                {t?.preview?.download || "Download"}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Canvas Layout */}
      <div className="flex flex-1 overflow-hidden px-4 pb-4 gap-4 relative z-10">

        {/* Iframe Container - Floating Card */}
        <div className="flex-1 relative bg-background rounded-2xl shadow-2xl border border-border/40 overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
          <iframe
            ref={iframeRef}
            key={`${reloadKey}-${activeFile}`}
            src={`/api/preview/${siteId}?t=${reloadKey}&file=${activeFile}`}
            className="h-[133.33%] w-[133.33%] border-0 bg-white origin-top-left scale-[0.75]"
            title="Website Preview"
            sandbox="allow-same-origin allow-scripts allow-modals"
          />
        </div>

        {/* AI Sidebar - Integrated Panel */}
        <div className="w-[350px] shrink-0 bg-background/95 backdrop-blur-xl rounded-2xl border border-border/40 shadow-xl overflow-hidden flex flex-col">
          <FoundryAgent
            siteId={siteId}
            activeFile={activeFile}
            onUpdate={handleUpdate}
            className="h-full border-0"
          />
        </div>
      </div>
    </div>
  )
}
