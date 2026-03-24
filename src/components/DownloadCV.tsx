'use client'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { CVDocument } from '@/lib/pdf'
import type { PortfolioData } from '@/lib/types'

export default function DownloadCV({ data }: { data: PortfolioData }) {
  return (
    <PDFDownloadLink
      document={<CVDocument data={data} />}
      fileName="William_Martinez_Bolanos_CV.pdf"
      className="block bg-cta text-on-primary text-xs font-semibold tracking-widest uppercase px-4 py-2 hover:opacity-90 transition-opacity"
    >
      {({ loading }) => loading ? 'Generating...' : 'Download_CV'}
    </PDFDownloadLink>
  )
}
