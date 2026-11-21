import type { Remaining } from '../config/birthdayAccess'
import { FloatingHearts } from './FloatingHearts'
import { useReducedMotion } from '../hooks/useReducedMotion'

const UNITS = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
] as const

const SPARKLES = [
  { id: 's1', top: '12%', left: '14%', delay: '0s' },
  { id: 's2', top: '22%', left: '78%', delay: '1.2s' },
  { id: 's3', top: '70%', left: '10%', delay: '0.6s' },
  { id: 's4', top: '78%', left: '84%', delay: '1.8s' },
  { id: 's5', top: '40%', left: '90%', delay: '0.4s' },
  { id: 's6', top: '86%', left: '42%', delay: '1.4s' },
]

function pad(value: number) {
  return String(value).padStart(2, '0')
}

export function BirthdayAccessLock({ remaining }: { remaining: Remaining }) {
  const reduced = useReducedMotion()
  const spoken = `${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes, ${remaining.seconds} seconds`

  return (
    <section className="relative flex min-h-svh flex-col overflow-x-clip px-6 pb-8 pt-16 text-center text-ink">
      <style>{`
        @keyframes lock-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes lock-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 0.9; transform: scale(1); }
        }
      `}</style>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(900px 520px at 50% 18%, rgba(237,213,207,0.95), transparent 62%), radial-gradient(700px 420px at 50% 100%, rgba(234,220,200,0.85), transparent 60%), #f7f1ea',
        }}
      />
      <FloatingHearts />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {SPARKLES.map((sparkle) => (
          <span
            key={sparkle.id}
            className="absolute h-1.5 w-1.5 rounded-full bg-gold"
            style={{
              top: sparkle.top,
              left: sparkle.left,
              animation: reduced ? undefined : 'lock-twinkle 3.4s ease-in-out infinite',
              animationDelay: sparkle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center">
        <div
          className="mb-8"
          style={{ animation: reduced ? undefined : 'lock-float 5.5s ease-in-out infinite' }}
          aria-hidden="true"
        >
          <SealedEnvelope />
        </div>

        <h1 className="font-serif text-4xl italic leading-tight text-ink sm:text-5xl">
          Something special is on its way...
        </h1>
        <p className="mt-6 font-serif text-2xl tracking-wide text-rose-deep sm:text-3xl">24 November 2026</p>
        <p className="mt-1 text-[0.72rem] uppercase tracking-[0.28em] text-gold">12:00 AM IST</p>

        <div
          className="mt-8 grid w-full max-w-md grid-cols-4 gap-2 sm:gap-3"
          role="timer"
          aria-label={`Countdown to 24 November 2026, 12:00 AM IST. ${spoken}`}
        >
          {UNITS.map((unit) => (
            <div key={unit.key} className="rounded-2xl bg-paper/80 px-1 py-3 shadow-sm ring-1 ring-gold/20 sm:py-4">
              <div className="font-sans text-3xl font-light tabular-nums text-ink sm:text-5xl">{pad(remaining[unit.key])}</div>
              <div className="mt-1 text-[0.58rem] uppercase tracking-[0.14em] text-gold sm:text-[0.62rem]">{unit.label}</div>
            </div>
          ))}
        </div>

        <p className="mt-8 font-serif text-xl italic text-ink-soft sm:text-2xl">Until then, keep this little secret safe. ♡</p>
      </div>

      <p className="relative z-10 mt-8 font-serif text-lg italic text-ink-soft">Made with love, by Manav</p>
    </section>
  )
}

function SealedEnvelope() {
  return (
    <svg width="168" height="132" viewBox="0 0 168 132" fill="none" role="img" aria-label="A sealed envelope">
      <rect x="8" y="28" width="152" height="96" rx="14" fill="#fbf7f1" stroke="#8a6840" strokeWidth="1.4" />
      <path d="M8 42 L84 88 L160 42" stroke="#c48984" strokeWidth="1.4" fill="none" />
      <path d="M8 124 L64 78" stroke="#eadcc8" strokeWidth="1.2" />
      <path d="M160 124 L104 78" stroke="#eadcc8" strokeWidth="1.2" />
      <path d="M16 30 L84 74 L152 30" fill="#edd5cf" stroke="#8a6840" strokeWidth="1.2" />
      <circle cx="84" cy="70" r="16" fill="#8f4e56" />
      <path
        d="M84 78s-6.2-3.9-6.2-8a3.6 3.6 0 0 1 6.2-1.8 3.6 3.6 0 0 1 6.2 1.8c0 4.1-6.2 8-6.2 8z"
        fill="#f7f1ea"
      />
    </svg>
  )
}
