'use client'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { CVDocument } from '@/lib/pdf'
import type { PortfolioData } from '@/lib/types'

export default function DownloadCV({ data, className = '' }: { data: PortfolioData; className?: string }) {
  return (
    <PDFDownloadLink
      document={<CVDocument data={data} />}
      fileName="William_Martinez_Bolanos_CV.pdf"
      className={`doc-link inline-flex min-h-11 items-center ${className}`}
    >
      {({ loading }) => (loading ? 'Preparing CV…' : 'Download CV (PDF)')}
    </PDFDownloadLink>
  )
}
