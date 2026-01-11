'use client'

import { Printer, Download, Loader2 } from 'lucide-react'
import { useState } from 'react'

export function PrintButton() {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    const element = document.getElementById('invoice-container')
    if (!element) {
        alert('Error: Could not find invoice content.')
        return
    }

    setDownloading(true)
    try {
      // Dynamic imports to ensure client-side execution and avoid build issues
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')

      // Scroll to top to ensure capture works correctly
      window.scrollTo(0, 0)
      
      const canvas = await html2canvas(element, {
        scale: 2, // Better resolution
        logging: false,
        useCORS: true, 
        backgroundColor: '#ffffff',
        // Fix for potential scroll issues
        scrollX: 0,
        scrollY: -window.scrollY
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`Foundry-Invoice-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error: any) {
      console.error('PDF generation failed', error)
      alert(`Failed to generate PDF: ${error.message || 'Unknown error'}`)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="fixed bottom-8 right-8 print:hidden flex gap-2">
        <button 
            onClick={() => window.print()}
            className="bg-white text-black border border-gray-200 rounded-full px-4 py-4 shadow-lg hover:scale-105 transition-transform flex items-center gap-2 font-medium"
            title="Print"
        >
            <Printer size={20} />
        </button>
        <button 
            onClick={handleDownload}
            disabled={downloading}
            className="bg-black text-white rounded-full px-6 py-4 shadow-lg hover:scale-105 transition-transform flex items-center gap-2 font-medium"
        >
            {downloading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
            {downloading ? 'Generating...' : 'Download PDF'}
        </button>
    </div>
  )
}
