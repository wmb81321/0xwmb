'use client'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { CVDocument } from '@/lib/pdf'
import type { PortfolioData } from '@/lib/types'

/** `link` is a document link; `button` drops the underline so the caller styles it as a button. */
export default function DownloadCV({ data, className = '', variant = 'link' }: { data: PortfolioData; className?: string; variant?: 'link' | 'button' }) {
  return (
    <PDFDownloadLink
      document={<CVDocument data={data} />}
      fileName="William_Martinez_Bolanos_CV.pdf"
      className={`${variant === 'link' ? 'doc-link ' : ''}inline-flex min-h-11 items-center ${className}`}
    >
      {({ loading }) => (loading ? 'Preparing CV…' : 'Download CV (PDF)')}
    </PDFDownloadLink>
  )
}
