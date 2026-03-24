import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // 0px border-radius everywhere — the Sovereign Terminal rule
    borderRadius: {
      DEFAULT: '0px',
      none: '0px',
      sm: '0px',
      md: '0px',
      lg: '0px',
      xl: '0px',
      '2xl': '0px',
      '3xl': '0px',
      full: '9999px', // pills / avatar only
    },
    extend: {
      colors: {
        // ── Semantic aliases (used throughout admin + existing components) ──
        bg:           '#10131c',
        surface:      '#181c24',
        'surface-2':  '#262a33',
        accent:       '#00D1FF',
        'accent-dim': '#00b8d9',
        muted:        '#b2c8cc',
        border:       '#32434d',
        text:         '#e0e2ee',
        'text-dim':   '#b2c8cc',

        // ── Full Sovereign Terminal palette ──
        background:                  '#10131c',
        'surface-dim':               '#10131c',
        'surface-container-lowest':  '#0a0e16',
        'surface-container-low':     '#181c24',
        'surface-container':         '#1c2028',
        'surface-container-high':    '#262a33',
        'surface-container-highest': '#31353e',
        'surface-bright':            '#353943',
        'surface-variant':           '#31353e',
        'surface-tint':              '#00D1FF',

        primary:              '#e2f8ff',
        'primary-container':  '#00D1FF',
        'primary-fixed':      '#80eaff',
        'primary-fixed-dim':  '#00D1FF',
        'on-primary':         '#003642',
        'on-primary-container': '#002a33',
        'on-primary-fixed':   '#001f28',
        'on-primary-fixed-variant': '#004e5e',

        secondary:             '#d3fbff',
        'secondary-container': '#00eefc',
        'secondary-fixed':     '#7df4ff',
        'secondary-fixed-dim': '#00dbe9',
        'on-secondary':        '#00363a',
        'on-secondary-container': '#00686f',
        'on-secondary-fixed':  '#002022',
        'on-secondary-fixed-variant': '#004f54',

        tertiary:             '#fff7fc',
        'tertiary-container': '#f2d2ff',
        'tertiary-fixed':     '#f5d9ff',
        'tertiary-fixed-dim': '#e5b4ff',
        'on-tertiary':        '#4f0077',
        'on-tertiary-container': '#9700df',
        'on-tertiary-fixed':  '#30004b',
        'on-tertiary-fixed-variant': '#7000a7',

        'on-surface':         '#e0e2ee',
        'on-surface-variant': '#b2c8cc',
        'on-background':      '#e0e2ee',
        'inverse-surface':    '#e0e2ee',
        'inverse-on-surface': '#2d303a',
        'inverse-primary':    '#00667c',

        outline:         '#7f909e',
        'outline-variant': '#32434d',

        error:             '#ffb4ab',
        'error-container': '#93000a',
        'on-error':        '#690005',
        'on-error-container': '#ffdad6',
      },
      fontFamily: {
        sans:     ['Space Grotesk', 'monospace'],
        mono:     ['Space Grotesk', 'monospace'],
        headline: ['Space Grotesk', 'monospace'],
        body:     ['Space Grotesk', 'monospace'],
        label:    ['Space Grotesk', 'monospace'],
      },
      boxShadow: {
        // Glow shadow — primary at 8% opacity, 32px blur
        glow: '0 0 32px 0 rgba(0, 209, 255, 0.08)',
        'glow-md': '0 0 24px 0 rgba(0, 209, 255, 0.15)',
        'glow-lg': '0 0 48px 0 rgba(0, 209, 255, 0.20)',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        flicker: 'flicker 0.1s ease-in-out',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}

export default config
