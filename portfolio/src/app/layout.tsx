import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'William Martinez Bolaños – Product Manager',
  description: 'Product Manager & Business Developer specializing in Crypto, Fintech, and AI',
  keywords: 'Product Manager, Business Development, Crypto, Blockchain, Fintech, AI',
  openGraph: {
    title: 'William Martinez Bolaños – Portfolio',
    description: 'Product Manager & Business Developer with expertise in Crypto, Fintech, and AI',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-bg text-text antialiased">{children}</body>
    </html>
  )
}
