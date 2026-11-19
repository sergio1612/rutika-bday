import { useReducedMotion } from '../hooks/useReducedMotion'

const HEARTS = [
  { id: 'a', left: '6%', delay: '0s', duration: '16s', size: 12, opacity: 0.28, drift: '10px' },
  { id: 'b', left: '18%', delay: '3s', duration: '18s', size: 16, opacity: 0.2, drift: '-14px' },
  { id: 'c', left: '34%', delay: '1.2s', duration: '15s', size: 10, opacity: 0.32, drift: '8px' },
  { id: 'd', left: '52%', delay: '5s', duration: '19s', size: 14, opacity: 0.22, drift: '-10px' },
  { id: 'e', left: '68%', delay: '2.4s', duration: '17s', size: 11, opacity: 0.3, drift: '16px' },
  { id: 'f', left: '82%', delay: '6s', duration: '16s', size: 15, opacity: 0.18, drift: '-8px' },
  { id: 'g', left: '92%', delay: '4s', duration: '20s', size: 9, opacity: 0.26, drift: '12px' },
]

export function FloatingHearts({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const reduced = useReducedMotion()
  if (reduced) return null

  const color = tone === 'dark' ? 'text-gold-bright' : 'text-rose'

  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden" aria-hidden="true">
      {HEARTS.map((heart) => (
        <span
          key={heart.id}
          className={`heart absolute bottom-0 ${color}`}
          style={{
            left: heart.left,
            animationDelay: heart.delay,
            animationDuration: heart.duration,
            ['--heart-opacity' as string]: heart.opacity,
            ['--drift' as string]: heart.drift,
          }}
        >
          <svg width={heart.size} height={heart.size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" />
          </svg>
        </span>
      ))}
    </div>
  )
}
