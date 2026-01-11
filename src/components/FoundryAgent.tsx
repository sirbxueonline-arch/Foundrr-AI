
'use client'

import { useState, useEffect, useRef } from 'react'
import { Bot, Send, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FoundryAgentProps {
  siteId: string
  onUpdate: () => void
  className?: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function FoundryAgent({ siteId, onUpdate, className }: FoundryAgentProps) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm foundrr. I can help edit your website. Try saying 'Make the headline bigger' or 'Change the background to blue'." }
  ])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg = input.trim()
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setIsLoading(true)

    try {
      // 1. Fetch current HTML
      const htmlRes = await fetch(`/api/preview/${siteId}`)
      const currentHtml = await htmlRes.text()

      // 2. Send to Edit API
      const res = await fetch('/api/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          prompt: userMsg,
          currentHtml
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to edit')
      }

      const data = await res.json()
      
      // 3. Update Success
      setMessages(prev => [...prev, { role: 'assistant', content: "Done! I've updated the website for you." }])
      onUpdate() // Trigger iframe reload

    } catch (error: any) {
      console.error(error)
      setMessages(prev => [...prev, { role: 'assistant', content: `Sorry, I ran into an issue: ${error.message}. Please try again.` }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col border-l bg-background shadow-xl z-20 h-full overflow-hidden", className)}>
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b px-6 bg-background">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">foundrr AI</h3>
            <p className="text-xs text-muted-foreground">Interactive Editor</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto w-full p-6 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex flex-col gap-2 rounded-xl px-4 py-3 text-sm shadow-sm max-w-[90%]",
              msg.role === 'user'
                ? "ml-auto bg-black text-white"
                : "bg-white border-2 border-gray-200 text-black"
            )}
          >
            <span className="text-[10px] uppercase tracking-wider opacity-70 font-bold mb-1 block">
                {msg.role === 'user' ? 'You' : 'Foundry'}
            </span>
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="flex max-w-[85%] items-center gap-3 rounded-xl bg-muted/50 px-4 py-3 text-sm text-foreground border">
            <Sparkles className="h-4 w-4 animate-spin text-primary" />
            <span className="font-medium">Writing code...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-background shrink-0">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe a change..."
            className="w-full rounded-full border bg-muted/50 px-4 py-3 pr-12 text-sm outline-none focus:border-primary focus:bg-background transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-1.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
