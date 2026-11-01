// Logo wall under the hero (Figma 12-118): organisations William has built with,
// worked for and studied at. Logos are the background-removed versions stored in
// Supabase Storage `portfolio-assets/v2/` (the Ekinoxis mark ships in /public/brand).

const V2 = 'https://nfzppyfqtcvwwokrrvca.supabase.co/storage/v1/object/public/portfolio-assets/v2'

export interface NetworkOrg {
  name: string
  url?: string
  logo: string
}

export const NETWORK: NetworkOrg[] = [
  { name: 'ETH Cali', url: 'https://ethcali.org', logo: `${V2}/ethcali.png` },
  { name: 'Ekinoxis', url: 'https://ekinoxis.xyz', logo: '/brand/ekinoxis-mark.svg' },
  { name: 'Convexo', url: 'https://convexo.xyz', logo: `${V2}/convexo.png` },
  { name: 'Giveth', url: 'https://giveth.io', logo: `${V2}/giveth.png` },
  { name: 'Ethereum Foundation', url: 'https://ethereum.foundation', logo: `${V2}/ethereumf.png` },
  { name: 'Universidad San Buenaventura Cali', url: 'https://usbcali.edu.co', logo: `${V2}/usbcali.png` },
  { name: 'Manuelita', url: 'https://manuelita.com', logo: `${V2}/manuelita.png` },
  { name: 'Universidad ICESI', url: 'https://icesi.edu.co', logo: `${V2}/icesi.png` },
  { name: 'SKEMA Business School', url: 'https://skema.edu', logo: `${V2}/skema.png` },
  { name: 'Montpellier Business School', url: 'https://mbs-education.com', logo: `${V2}/mbs.png` },
  { name: 'NIDO', logo: `${V2}/nido.png` },
  { name: 'ETHGlobal', url: 'https://ethglobal.com', logo: `${V2}/ethglobal.png` },
]
