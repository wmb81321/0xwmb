'use client'
import dynamic from 'next/dynamic'
import type { PortfolioData } from '@/lib/types'

const DownloadCV = dynamic(() => import('./DownloadCV'), { ssr: false })

export default function DownloadCVNoSSR({ data, className, variant }: { data: PortfolioData; className?: string; variant?: 'link' | 'button' }) {
  return <DownloadCV data={data} className={className} variant={variant} />
}
