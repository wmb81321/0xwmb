'use client'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { CVDocument } from '@/lib/pdf'
import type { PortfolioData } from '@/lib/types'

export default function DownloadCV({ data }: { data: PortfolioData }) {
  return (
    <PDFDownloadLink
      document={<CVDocument data={data} />}
      fileName="William_Martinez_Bolanos_CV.pdf"
      className="px-6 py-3 bg-accent text-white text-sm font-mono rounded hover:bg-accent-dim transition-colors"
    >
      {({ loading }) => loading ? 'Generating CV...' : 'Download CV (PDF)'}
    </PDFDownloadLink>
  )
}
