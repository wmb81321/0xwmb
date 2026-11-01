'use client'
import dynamic from 'next/dynamic'
import type { PortfolioData } from '@/lib/types'

const DownloadCV = dynamic(() => import('./DownloadCV'), { ssr: false })

export default function DownloadCVNoSSR({ data, className }: { data: PortfolioData; className?: string }) {
  return <DownloadCV data={data} className={className} />
}
