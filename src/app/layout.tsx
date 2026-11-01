import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono, Source_Serif_4, Public_Sans } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

// Public site ("The Prospectus"): serif display + institutional sans.
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-source-serif',
  display: 'swap',
})

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-public-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

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
    <html lang="en" className={`scroll-smooth ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${sourceSerif.variable} ${publicSans.variable}`}>
      <body className="bg-bg text-text antialiased">{children}</body>
    </html>
  )
}
