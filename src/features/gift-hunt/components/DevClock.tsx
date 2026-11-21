import { formatInKolkata } from '../utils/dateUtils'

const PRESETS = [
  { label: 'Real time', iso: null },
  { label: 'Before the first', iso: '2026-11-24T08:00:00+05:30' },
  { label: 'First gift', iso: '2026-11-24T09:05:00+05:30' },
  { label: 'All hours open', iso: '2026-11-24T21:30:00+05:30' },
] as const

export function DevClock({
  now,
  active,
  onPreview,
  onReset,
}: {
  now: number
  active: boolean
  onPreview: (iso: string | null) => void
  onReset: () => void
}) {
  if (!import.meta.env.DEV) return null

  return (
    <aside className="fixed bottom-4 left-4 z-50 max-w-[16rem] rounded-2xl bg-night/90 p-3 text-left text-cream shadow-lg">
      <p className="text-[0.62rem] uppercase tracking-[0.16em] text-gold-bright">Preview clock</p>
      <p className="mt-1 text-xs text-cream/80">{formatInKolkata(now)}{active ? ' · simulated' : ''}</p>
      <div className="mt-2 flex flex-col gap-1">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onPreview(preset.iso)}
            className="rounded-full px-2 py-1 text-left text-[0.68rem] text-cream/90 hover:bg-white/10"
          >
            {preset.label}
          </button>
        ))}
        <button type="button" onClick={onReset} className="rounded-full px-2 py-1 text-left text-[0.68rem] text-gold-bright">
          Clear hunt progress
        </button>
      </div>
    </aside>
  )
}
