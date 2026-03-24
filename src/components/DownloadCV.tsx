'use client'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { CVDocument } from '@/lib/pdf'
import type { PortfolioData } from '@/lib/types'

export default function DownloadCV({ data }: { data: PortfolioData }) {
  return (
    <PDFDownloadLink
      document={<CVDocument data={data} />}
      fileName="William_Martinez_Bolanos_CV.pdf"
      className="block border border-outline-variant/40 text-on-surface-variant text-xs font-semibold tracking-widest uppercase px-8 py-3 hover:border-primary-container hover:text-primary-container transition-colors"
    >
      {({ loading }) => loading ? 'Generating...' : 'Download_CV'}
    </PDFDownloadLink>
  )
}
