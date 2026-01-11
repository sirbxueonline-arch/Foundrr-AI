'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle2, CreditCard, Smartphone, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'

export function PayContent({ siteId }: { siteId: string }) {
  const router = useRouter()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [priceLoading, setPriceLoading] = useState(true)
  const [price, setPrice] = useState<number | null>(null)
  const [paymentIdentifier, setPaymentIdentifier] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'m10' | 'card'>('m10')
  const [isQrRevealed, setIsQrRevealed] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [isApproved, setIsApproved] = useState(false)

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch(`/api/pricing/${siteId}`)
        if (res.ok) {
          const data = await res.json()
          setPrice(data.price)
          // If already paid, redirect or show success immediately
          if (data.paid || data.payment_status === 'approved') {
            setIsApproved(true)
          }
        } else {
          const err = await res.json()
          console.error("Pricing fetch failed:", err)
          if (res.status === 404) {
            // Handle 404
          }
        }
      } catch (e) {
        console.error("Failed to fetch price", e)
      } finally {
        setPriceLoading(false)
      }
    }
    if (siteId) fetchPrice()
  }, [siteId])

  // Polling for payment status
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPending && !isApproved) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/pricing/${siteId}`)
          if (res.ok) {
            const data = await res.json()
            if (data.payment_status === 'approved' || data.paid === true) {
              setIsApproved(true)
              setIsPending(false)
            }
          }
        } catch (e) {
          console.error("Polling error", e)
        }
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [isPending, isApproved, siteId])

  const handlePaymentComplete = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, paymentIdentifier, paymentMethod })
      })

      if (!res.ok) {
        throw new Error('Payment verification failed')
      }

      setIsPending(true)

    } catch (error) {
      console.error(error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (isApproved) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="relative mx-auto h-32 w-32 flex items-center justify-center">
            <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full animate-ping opacity-20" />
            <div className="relative h-28 w-28 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center shadow-lg boarder border-green-200 dark:border-green-800">
              <Check className="h-14 w-14" strokeWidth={3} />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold tracking-tight text-green-600 dark:text-green-500">
              Payment Approved!
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-sm mx-auto">
              Your website has been successfully unlocked. You now have full access to your project.
            </p>
          </div>

          <button
            onClick={() => router.push(`/website/${siteId}`)}
            className="w-full max-w-sm inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="h-24 w-24 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">{t?.payment?.processing?.title || "Payment Processing"}</h2>
          <div className="bg-card border p-6 rounded-xl shadow-sm text-left space-y-4">
            <p className="font-medium">{t?.payment?.processing?.thanks || "Thanks for your payment!"}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t?.payment?.processing?.desc}
              <br /><br />
              <strong>{t?.payment?.processing?.wait}</strong>
              <br />
              {t?.payment?.processing?.WaitSub}
            </p>
          </div>

          <button
            onClick={() => router.push(`/website/${siteId}`)}
            className="text-primary hover:underline text-sm font-medium"
          >
            {t?.payment?.processing?.return || "Return to Dashboard"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-xl border bg-card shadow-lg overflow-hidden transition-all duration-300">
        <div className="bg-primary px-6 py-8 text-center text-primary-foreground">
          <h1 className="text-2xl font-bold">{t?.payment?.title || "Unlock your website"}</h1>
          <p className="mt-2 text-primary-foreground/80 text-sm">
            {t?.payment?.desc || "One-time price. Lifetime ownership. No subscriptions."}
          </p>
          <div className="mt-6 text-4xl font-extrabold flex items-center justify-center min-h-[48px]">
            {priceLoading ? (
              <Loader2 className="animate-spin h-8 w-8 opacity-50" />
            ) : (
              <>{price || '--'}<span className="text-lg font-normal text-primary-foreground/60 ml-1">{t?.payment?.currency || "AZN"}</span></>
            )}
          </div>
        </div>

        <div className="p-8 space-y-8">

          {/* Payment Method Toggle */}
          <div className="grid grid-cols-2 gap-4 p-1 bg-muted/50 rounded-lg">
            <button
              onClick={() => setPaymentMethod('m10')}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all",
                paymentMethod === 'm10'
                  ? "bg-white text-primary shadow-sm ring-1 ring-black/5"
                  : "text-muted-foreground hover:bg-white/50"
              )}
            >
              <Smartphone className="w-4 h-4" />
              {t?.payment?.m10 || "m10"}
            </button>
            <button
              onClick={() => setPaymentMethod('card')}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all",
                paymentMethod === 'card'
                  ? "bg-white text-primary shadow-sm ring-1 ring-black/5"
                  : "text-muted-foreground hover:bg-white/50"
              )}
            >
              <CreditCard className="w-4 h-4" />
              {t?.payment?.card || "Card"}
            </button>
          </div>

          <div className="flex flex-col items-center space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {paymentMethod === 'm10' ? (
              <>
                <div className="relative">
                  <div
                    className={cn(
                      "bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 shadow-sm transition-all duration-500",
                      !isQrRevealed && "blur-xl scale-95 opacity-50 grayscale"
                    )}
                  >
                    <img
                      src="/qr-code.png"
                      alt="Payment QR Code"
                      className="w-48 h-48 object-cover mix-blend-multiply"
                    />
                  </div>

                  {!isQrRevealed && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <button
                        onClick={() => setIsQrRevealed(true)}
                        className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all ring-4 ring-background"
                      >
                        {t?.payment?.revealQr || "Reveal QR"}
                      </button>
                    </div>
                  )}
                </div>

                <p className={cn(
                  "text-sm text-muted-foreground text-center max-w-[200px] transition-opacity duration-300",
                  !isQrRevealed ? "opacity-0" : "opacity-100"
                )}>
                  {t?.payment?.scanText} <span className="font-semibold text-primary">{t?.payment?.scanApp}</span>
                </p>
              </>
            ) : (
              <div className="w-full bg-secondary/30 p-6 rounded-xl border border-border/50 text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h4 className="font-semibold">{t?.payment?.bankTransfer}</h4>
                <p className="text-sm text-muted-foreground">{t?.payment?.sendTo}</p>
                <div className="bg-white px-4 py-3 rounded-md border font-mono text-sm tracking-wider shadow-sm select-all">
                  4169 7388 1234 5678
                </div>
                <p className="text-xs text-muted-foreground/80">{t?.payment?.name}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-center">{t?.payment?.instructions}</h3>
            {paymentMethod === 'm10' ? (
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                {t?.payment?.m10Steps?.map((step: string, i: number) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            ) : (
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                {t?.payment?.cardSteps?.map((step: string, i: number) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            )}
          </div>

          <div className="pt-4 border-t space-y-4">
            <div className="space-y-2">
              <label htmlFor="payment-id" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t?.payment?.verificationLabel}
              </label>
              <input
                id="payment-id"
                type="text"
                placeholder={paymentMethod === 'm10' ? t?.payment?.m10Placeholder : t?.payment?.cardPlaceholder}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-primary"
                value={paymentIdentifier}
                onChange={(e) => setPaymentIdentifier(e.target.value)}
              />
              <p className="text-[0.8rem] text-muted-foreground">
                {t?.payment?.verifyHelp}
              </p>
            </div>

            <button
              onClick={handlePaymentComplete}
              disabled={loading || !siteId || !paymentIdentifier.trim()}
              className="w-full inline-flex h-11 items-center justify-center rounded-md bg-green-600 px-8 text-sm font-bold text-white shadow transition-all hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t?.payment?.btnVerify || "Verifying..."}
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  {t?.payment?.btnSent || "I've sent the payment"}
                </>
              )}
            </button>
            <p className="mt-4 text-xs text-center text-muted-foreground">
              {t?.payment?.footerTrust}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
