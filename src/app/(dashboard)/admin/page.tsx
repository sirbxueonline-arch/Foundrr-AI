'use client'

import { useState, useEffect } from 'react'
import { Loader2, Check, X, ShieldAlert, CreditCard, Smartphone, RefreshCw, Layers } from 'lucide-react'
import { format } from 'date-fns'

interface PendingSite {
    id: string
    name: string
    created_at: string
    price: number
    payment_method: string
    payment_identifier: string
    payment_status: string
    user_id: string
}

export default function AdminPage() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [sites, setSites] = useState<PendingSite[]>([])
    const [processingId, setProcessingId] = useState<string | null>(null)

    useEffect(() => {
        fetchPending()
    }, [])

    const fetchPending = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/pending')
            if (res.ok) {
                const data = await res.json()
                setSites(data.sites || [])
            } else {
                const err = await res.json()
                setError(err.error || 'Failed to load sites')
            }
        } catch (e) {
            console.error(e)
            setError('Connection error')
        } finally {
            setLoading(false)
        }
    }

    const handleAction = async (siteId: string, action: 'approve' | 'reject') => {
        setProcessingId(siteId)
        try {
            const res = await fetch('/api/admin/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ siteId, action })
            })

            if (res.ok) {
                setSites(prev => prev.filter(s => s.id !== siteId))
            }
        } catch (e) {
            alert('Failed to process')
        } finally {
            setProcessingId(null)
        }
    }

    if (loading && sites.length === 0) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary/80" />
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading secure dashboard...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-[80vh] flex-col items-center justify-center gap-6 text-center px-4">
                <div className="rounded-full bg-destructive/10 p-4">
                    <ShieldAlert className="h-12 w-12 text-destructive" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">Access Restricted</h2>
                    <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
                >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry Connection
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen space-y-8 pb-20">
            {/* Header Section */}
            <div className="relative bg-gradient-to-b from-primary/5 to-transparent pb-12 pt-16 -mx-6 px-6 md:-mx-12 md:px-12 border-b border-primary/5">
                <div className="container mx-auto max-w-5xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                                Admin Control
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Verify and process incoming wire transfers.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 rounded-xl bg-background/50 backdrop-blur-sm border px-4 py-3 shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm font-medium text-muted-foreground">System Online</span>
                            </div>
                            <div className="h-4 w-px bg-border" />
                            <div className="text-sm font-medium">
                                <span className="text-foreground font-bold">{sites.length}</span> Pending
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-4 md:px-0">
                <div className="grid gap-6">
                    {sites.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-16 text-center animate-in fade-in zoom-in-95 duration-500">
                            <div className="h-16 w-16 bg-background rounded-2xl shadow-sm flex items-center justify-center mb-6 border rotate-3 transition-transform hover:rotate-6">
                                <Layers className="h-8 w-8 text-primary/60" />
                            </div>
                            <h3 className="font-bold text-2xl tracking-tight mb-2">Queue Empty</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto">
                                All payments have been processed. New requests will appear here automatically.
                            </p>
                        </div>
                    ) : (
                        sites.map((site) => (
                            <div
                                key={site.id}
                                className="group relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5"
                            >
                                <div className="space-y-3 flex-1">
                                    <div className="flex items-start justify-between md:justify-start md:items-center gap-3">
                                        <h3 className="font-bold text-xl tracking-tight group-hover:text-primary transition-colors">
                                            {site.name || 'Untitled Project'}
                                        </h3>
                                        <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 border border-amber-500/20 shadow-sm animate-pulse">
                                            Action Required
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Created</p>
                                            <p className="font-mono text-foreground/80">{format(new Date(site.created_at), 'MMM d, HH:mm')}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Method</p>
                                            <div className="flex items-center gap-1.5">
                                                {site.payment_method === 'm10' ? <Smartphone className="h-3.5 w-3.5" /> : <CreditCard className="h-3.5 w-3.5" />}
                                                <span className="capitalize">{site.payment_method || 'Wire'}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</p>
                                            <p className="font-bold text-green-600 dark:text-green-400">{site.price?.toFixed(2) || '49.99'} ₼</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ref ID</p>
                                            <p className="font-mono text-xs bg-muted/50 px-1.5 py-0.5 rounded border fit-content w-fit">{site.payment_identifier || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 mt-2 md:mt-0">
                                    <button
                                        onClick={() => handleAction(site.id, 'reject')}
                                        disabled={!!processingId}
                                        className="flex-1 md:flex-none h-10 px-4 inline-flex items-center justify-center whitespace-nowrap rounded-lg border border-input bg-transparent text-sm font-medium transition-colors hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        {processingId === site.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reject"}
                                    </button>
                                    <button
                                        onClick={() => handleAction(site.id, 'approve')}
                                        disabled={!!processingId}
                                        className="relative flex-1 md:flex-none h-10 px-6 inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-primary text-sm font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:shadow-md disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        {processingId === site.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Check className="h-4 w-4" />
                                                <span>Approve Payment</span>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
