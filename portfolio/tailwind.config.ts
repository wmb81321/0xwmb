import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#050810',
        surface: '#0d1117',
        'surface-2': '#111827',
        accent: '#6366f1',
        'accent-dim': '#4f46e5',
        muted: '#6b7280',
        border: '#1f2937',
        text: '#f9fafb',
        'text-dim': '#9ca3af',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
