import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function CursorGlow() {
  const reduced = useReducedMotion()
  const ringRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setEnabled(media.matches && !reduced)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [reduced])

  useEffect(() => {
    if (!enabled) return
    const ring = ringRef.current
    if (!ring) return

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let cx = x
    let cy = y
    let frame = 0
    let hideTimer = 0
    ring.style.opacity = '0'

    const onMove = (event: MouseEvent) => {
      x = event.clientX
      y = event.clientY
      ring.style.opacity = '1'
      window.clearTimeout(hideTimer)
      hideTimer = window.setTimeout(() => {
        ring.style.opacity = '0'
      }, 700)
    }

    const tick = () => {
      cx += (x - cx) * 0.18
      cy += (y - cy) * 0.18
      ring.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    frame = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(frame)
      window.clearTimeout(hideTimer)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={ringRef}
      className="pointer-events-none fixed left-0 top-0 z-[55] hidden opacity-0 transition-opacity duration-500 md:block"
      aria-hidden="true"
    >
      <div className="h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/60 transition-opacity duration-500" />
    </div>
  )
}
