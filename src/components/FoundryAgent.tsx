
'use client'

import { useState, useEffect, useRef } from 'react'
import { Bot, Send, Sparkles, Mic, MicOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FoundryAgentProps {
  siteId: string
  activeFile: string
  onUpdate: (filename?: string) => void
  onNavigate?: (filename: string) => void
  className?: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function FoundryAgent({ siteId, activeFile, onUpdate, onNavigate, className }: FoundryAgentProps) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Fondy. I can help edit your website or create new pages. Try saying 'Create an About page'." }
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
      // 1. Fetch current HTML from ACTIVE file
      const htmlRes = await fetch(`/api/preview/${siteId}?file=${activeFile}`)
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
      if (data.action === 'create') {
        setMessages(prev => [...prev, { role: 'assistant', content: `I've created **${data.filename}**. Switching to it now...` }])
        onUpdate(data.filename) // Switch to new file
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Done! I've updated the website." }])
        onUpdate(data.filename) // Refresh current
      }

    } catch (error: any) {
      console.error(error)
      setMessages(prev => [...prev, { role: 'assistant', content: `Sorry, I ran into an issue: ${error.message}. Please try again.` }])
    } finally {
      setIsLoading(false)
    }
  }

  /* Voice Control Logic */
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Browser does not support Speech Recognition")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(prev => prev + (prev ? ' ' : '') + transcript)
    }

    recognitionRef.current = recognition
    recognition.start()
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
            <h3 className="font-semibold">Fondy</h3>
            <p className="text-xs text-muted-foreground">Interactive Editor</p>
          </div>
        </div>
        <button
          onClick={() => {
            const keywords = prompt("Enter target SEO keywords:");
            if (keywords) {
              setInput(`Optimize the page for SEO targeting: ${keywords}. Rewrite meta tags and headers.`);
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 text-[10px] font-medium transition-colors"
          title="Optimize SEO"
        >
          <Sparkles className="w-3 h-3" />
          SEO
        </button>
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
              {msg.role === 'user' ? 'You' : 'Fondy'}
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

          <button
            type="button"
            onClick={toggleListening}
            className={cn(
              "absolute left-2 z-10 p-2 rounded-full transition-all",
              isListening ? "bg-red-500 text-white animate-pulse" : "text-muted-foreground hover:bg-muted"
            )}
            title="Voice Control"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Describe a change..."}
            className="w-full rounded-full border bg-muted/50 px-4 py-3 pl-10 pr-12 text-sm outline-none focus:border-primary focus:bg-background transition-colors"
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
