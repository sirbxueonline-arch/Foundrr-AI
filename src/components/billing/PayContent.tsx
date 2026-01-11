'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle2 } from 'lucide-react'

export function PayContent({ siteId }: { siteId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [paymentIdentifier, setPaymentIdentifier] = useState('')

  const handlePaymentComplete = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, paymentIdentifier })
      })

      if (!res.ok) {
        throw new Error('Payment verification failed')
      }

      // Allow a small delay for "processing" feel
      setTimeout(() => {
        router.push(`/website/${siteId}`)
        router.refresh() 
      }, 1000)
    } catch (error) {
      console.error(error)
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-xl border bg-card shadow-lg overflow-hidden">
        <div className="bg-primary px-6 py-8 text-center text-primary-foreground">
          <h1 className="text-2xl font-bold">Unlock your website</h1>
          <p className="mt-2 text-primary-foreground/80">
            One-time payment. Lifetime ownership.
          </p>
          <div className="mt-6 text-4xl font-extrabold flex items-center justify-center">
            $99<span className="text-lg font-normal text-primary-foreground/60 ml-1">USD</span>
          </div>
        </div>
        
        <div className="p-8 space-y-8">
          <div className="flex flex-col items-center space-y-4">
             <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
               <img 
                 src="/qr-code.png" 
                 alt="Payment QR Code" 
                 className="w-48 h-48 object-cover"
               />
             </div>
             <p className="text-sm text-muted-foreground text-center">
               Scan with your m10 app to pay instantly.
             </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-center">Instructions</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Open your banking app</li>
              <li>Scan the QR code above</li>
              <li>Confirm the payment of $99.00</li>
              <li>Click the button below once confirmed</li>
            </ol>
          </div>

          <div className="pt-4 border-t space-y-4">
            <div className="space-y-2">
              <label htmlFor="payment-id" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Payment Verification
              </label>
              <input
                id="payment-id"
                type="text"
                placeholder="Enter last 4 digits of card OR M10 number"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={paymentIdentifier}
                onChange={(e) => setPaymentIdentifier(e.target.value)}
              />
              <p className="text-[0.8rem] text-muted-foreground">
                We need this to verify your transaction matches our records.
              </p>
            </div>

            <button
              onClick={handlePaymentComplete}
              disabled={loading || !siteId || !paymentIdentifier.trim()}
              className="w-full inline-flex h-11 items-center justify-center rounded-md bg-green-600 px-8 text-sm font-bold text-white shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  I've sent the payment
                </>
              )}
            </button>
            <p className="mt-4 text-xs text-center text-muted-foreground">
              By unlocking, you agree to our Terms of Service.
              <br/>
              Instant unlock verified by Foundry Trust System™.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
