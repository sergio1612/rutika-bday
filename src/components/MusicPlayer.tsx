import { Pause, Play } from 'lucide-react'

export function MusicPlayer({
  playing,
  missing,
  onToggle,
}: {
  playing: boolean
  missing: boolean
  onToggle: () => void
}) {
  const label = missing ? 'Music is not available yet' : playing ? 'Pause music' : 'Play music'

  return (
    <div
      className="fixed z-50"
      style={{
        right: '1.25rem',
        bottom: 'calc(1.25rem + env(safe-area-inset-bottom))',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        disabled={missing}
        aria-pressed={playing}
        aria-label={label}
        title={missing ? 'A song will be here soon' : label}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-wine text-cream shadow-lg shadow-wine/25 ring-1 ring-gold-bright/50 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {playing ? (
          <span className="play-ring pointer-events-none absolute -inset-1 rounded-full border border-dashed border-gold-bright/70" />
        ) : null}
        {playing ? (
          <Pause className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Play className="h-5 w-5 translate-x-px" fill="currentColor" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
