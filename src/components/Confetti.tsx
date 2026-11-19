import { useEffect, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

const COLORS = ['#e7cfc8', '#eadcc8', '#c48984', '#fbf7f1', '#8f4e56', '#e7d3b1']

const PIECES = Array.from({ length: 34 }, (_, index) => ({
  id: `c${index}`,
  left: `${(index * 29) % 100}%`,
  delay: `${(index % 8) * 0.07}s`,
  duration: `${3.1 + (index % 5) * 0.28}s`,
  drift: `${(index % 2 === 0 ? -1 : 1) * (10 + (index % 6) * 7)}px`,
  spin: `${140 + (index % 7) * 36}deg`,
  color: COLORS[index % COLORS.length],
  width: 6 + (index % 4) * 2,
  height: index % 3 === 0 ? 6 : 11,
  radius: index % 5 === 0 ? 99 : 1,
}))

export function Confetti() {
  const reduced = useReducedMotion()
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (reduced) return
    const id = window.setTimeout(() => setDone(true), 5600)
    return () => window.clearTimeout(id)
  }, [reduced])

  if (reduced || done) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {PIECES.map((piece) => (
        <span
          key={piece.id}
          className="confetti-piece absolute top-0 block"
          style={{
            left: piece.left,
            width: piece.width,
            height: piece.height,
            background: piece.color,
            borderRadius: piece.radius,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            ['--drift' as string]: piece.drift,
            ['--spin' as string]: piece.spin,
          }}
        />
      ))}
    </div>
  )
}
