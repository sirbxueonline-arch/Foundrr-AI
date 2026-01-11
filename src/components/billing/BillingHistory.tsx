'use client'

import { format } from 'date-fns' // Assuming date-fns is available, or use native Intl
import { CheckCircle2, Download, CreditCard } from 'lucide-react'
import Link from 'next/link'

interface Site {
  id: string
  subdomain: string
  created_at: string
  paid: boolean
  payment_identifier?: string // Optional as we don't know if column exists
}

export function BillingHistory({ sites }: { sites: Site[] }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Billing History</h1>
        <p className="text-muted-foreground mt-1">View your payment history and invoices.</p>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          {sites.length === 0 ? (
            <div className="text-center py-10">
              <CreditCard className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No payments yet</h3>
              <p className="text-muted-foreground mt-2">
                When you unlock a website, your receipt will appear here.
              </p>
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Website</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Invoice</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {sites.map((site) => (
                    <tr key={site.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-4 align-middle font-medium">
                         <Link href={`/website/${site.id}`} className="hover:underline">
                           {site.subdomain}.foundry.site
                         </Link>
                      </td>
                      <td className="p-4 align-middle">
                        {formatDate(site.created_at)}
                      </td>
                      <td className="p-4 align-middle">
                        $99.00 USD
                      </td>
                      <td className="p-4 align-middle">
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-600 text-white shadow hover:bg-green-600/80">
                            Paid
                        </div>
                      </td>
                      <td className="p-4 align-middle text-right">
                        <Link 
                            href={`/billing/invoice/${site.id}`}
                            target="_blank"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
                            title="Download Invoice"
                        >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
