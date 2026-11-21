import { remainingUntil } from '../utils/dateUtils'

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-12 px-1">
      <div className="font-sans text-xl font-light tabular-nums text-ink">{String(value).padStart(2, '0')}</div>
      <div className="mt-1 text-[0.58rem] uppercase tracking-[0.16em] text-gold">{label}</div>
    </div>
  )
}

export function CountdownTimer({ targetMs, nowMs }: { targetMs: number; nowMs: number }) {
  const left = remainingUntil(targetMs, nowMs)
  if (left.total <= 0) return null

  return (
    <div className="mt-4 flex items-start justify-center divide-x divide-gold/30" aria-hidden="true">
      {left.days > 0 ? <Unit value={left.days} label="Days" /> : null}
      <Unit value={left.hours} label="Hours" />
      <Unit value={left.minutes} label="Min" />
      <Unit value={left.seconds} label="Sec" />
    </div>
  )
}
