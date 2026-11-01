'use client'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Optical logo sizing.
 *
 * Logos arrive with wildly different aspect ratios, transparent padding and ink
 * density, so `object-contain` in a fixed box makes wide wordmarks look huge and
 * tall marks look tiny. On load we sample the image on a small canvas, trim its
 * transparent padding, then size the visible artwork by *area* (not by its longest
 * side) with a mild correction for density: solid plates shrink a little, sparse
 * line marks grow a little. Everything is computed relative to the box, so the
 * result holds at every responsive size.
 */

interface Fit {
  /** visible artwork frame, as a fraction of the box */
  w: number
  h: number
  /** full image placement inside that frame, as fractions of the frame */
  imgW: number
  imgH: number
  x: number
  y: number
}

const SAMPLE = 96
const ALPHA_MIN = 24
const INK_MIN = 48

function measure(img: HTMLImageElement, fill: number, ratio: number, surface: Surface): Fit | null {
  const W = img.naturalWidth
  const H = img.naturalHeight
  if (!W || !H) return null

  const s = SAMPLE / Math.max(W, H)
  const cw = Math.max(1, Math.round(W * s))
  const ch = Math.max(1, Math.round(H * s))
  const canvas = document.createElement('canvas')
  canvas.width = cw
  canvas.height = ch
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  ctx.drawImage(img, 0, 0, cw, ch)

  let data: Uint8ClampedArray
  try {
    data = ctx.getImageData(0, 0, cw, ch).data
  } catch {
    return null // cross-origin canvas: fall back to plain contain
  }

  let minX = cw, minY = ch, maxX = -1, maxY = -1, ink = 0
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const i = (y * cw + x) * 4
      // Count only pixels visible on the surface: near-black artwork is invisible
      // on navy, near-white artwork is invisible on paper.
      const visible = data[i + 3] > ALPHA_MIN && (surface === 'dark'
        ? Math.max(data[i], data[i + 1], data[i + 2]) > INK_MIN
        : Math.min(data[i], data[i + 1], data[i + 2]) < 255 - INK_MIN / 4)
      if (visible) {
        ink++
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX < 0) return null

  const bw = maxX - minX + 1
  const bh = maxY - minY + 1
  const aspect = bw / bh
  const coverage = ink / (bw * bh)
  // Solid plates (coverage ≈ 1) read heavier than line marks: nudge, never distort.
  const density = Math.min(1.1, Math.max(0.86, Math.pow(0.55 / coverage, 0.25)))

  // Work in units of the box height; the box is `ratio` heights wide.
  const area = (fill * density) ** 2
  let w = Math.sqrt(area * aspect)
  let h = Math.sqrt(area / aspect)
  const clamp = Math.min(1, ratio / w, 1 / h)
  w *= clamp
  h *= clamp

  return {
    w: w / ratio,
    h,
    imgW: cw / bw,
    imgH: ch / bh,
    x: -minX / bw,
    y: -minY / bh,
  }
}

type Surface = 'dark' | 'light'

const pct = (n: number) => `${(n * 100).toFixed(3)}%`

export default function OpticalLogo({ src, alt, box, fill = 0.62, ratio = 1, surface = 'dark', className = '' }: {
  src?: string | null
  alt: string
  /** Tailwind size classes for the square box, e.g. "size-20 sm:size-30" */
  box: string
  /** Share of the box height a square logo occupies (area basis). */
  fill?: number
  /** Box width ÷ height when the box is not square. */
  ratio?: number
  /** What the logo sits on: decides which pixels count as visible artwork. */
  surface?: Surface
  className?: string
}) {
  const ref = useRef<HTMLImageElement>(null)
  const [fit, setFit] = useState<Fit | null>(null)
  const [ready, setReady] = useState(false)

  const onLoad = useCallback(() => {
    const img = ref.current
    if (!img) return
    setFit(measure(img, fill, ratio, surface))
    setReady(true)
  }, [fill, ratio, surface])

  // Cached images can finish before hydration attaches onLoad.
  useEffect(() => {
    if (ref.current?.complete) onLoad()
  }, [onLoad])

  if (!src) return <div className={`${box} shrink-0`} aria-hidden />

  const frame = fit ? { width: pct(fit.w), height: pct(fit.h) } : { width: '80%', height: '80%' }
  const art = fit
    ? { left: pct(fit.x), top: pct(fit.y), width: pct(fit.imgW), height: pct(fit.imgH) }
    : { left: 0, top: 0, width: '100%', height: '100%' }

  return (
    <div className={`optical-logo relative flex shrink-0 items-center justify-center ${box} ${className}`}
      data-state={ready ? 'ready' : 'pending'}>
      <div className="relative" style={frame}>
        <div className="absolute" style={art}>
          <Image ref={ref} src={src} alt={alt} fill sizes="240px" onLoad={onLoad}
            className="object-contain" unoptimized={src.endsWith('.svg')} />
        </div>
      </div>
    </div>
  )
}
