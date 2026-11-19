import { useReducedMotion } from '../hooks/useReducedMotion'

const PETALS = [
  { id: 'p1', left: '8%', delay: '0s', duration: '13s', drift: '28px', color: '#e7cfc8' },
  { id: 'p2', left: '22%', delay: '2s', duration: '16s', drift: '-18px', color: '#c48984' },
  { id: 'p3', left: '40%', delay: '0.8s', duration: '14s', drift: '22px', color: '#eadcc8' },
  { id: 'p4', left: '57%', delay: '3.4s', duration: '15s', drift: '-26px', color: '#edd5cf' },
  { id: 'p5', left: '73%', delay: '1.6s', duration: '17s', drift: '16px', color: '#c48984' },
  { id: 'p6', left: '88%', delay: '4.2s', duration: '13.5s', drift: '-12px', color: '#e7d3b1' },
]

export function Petals() {
  const reduced = useReducedMotion()
  if (reduced) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {PETALS.map((petal) => (
        <span
          key={petal.id}
          className="petal absolute top-0 block h-3.5 w-2.5 opacity-80"
          style={{
            left: petal.left,
            background: petal.color,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            ['--drift' as string]: petal.drift,
          }}
        />
      ))}
    </div>
  )
}
