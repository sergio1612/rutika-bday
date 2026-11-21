import { lazy, Suspense, useEffect } from 'react'
import { birthdayConfig } from '../config/birthdayConfig'
import { unlockInstant } from '../config/birthdayAccess'
import { useBirthdayAccess } from '../hooks/useBirthdayAccess'
import { BirthdayAccessLock } from './BirthdayAccessLock'

const App = lazy(() => import('../App.tsx'))
const SOON_MS = 10_000

export function BirthdayGate() {
  const access = useBirthdayAccess()

  useEffect(() => {
    if (access.unlocked) return
    const meta = document.querySelector('meta[name="theme-color"]')
    const previousColor = meta?.getAttribute('content')
    const previousTitle = document.title
    const root = document.documentElement
    const previousBackground = root.style.backgroundColor
    meta?.setAttribute('content', '#f7f1ea')
    document.title = 'Something special'
    root.style.backgroundColor = '#f7f1ea'
    return () => {
      if (previousColor) meta?.setAttribute('content', previousColor)
      document.title = previousTitle
      root.style.backgroundColor = previousBackground
    }
  }, [access.unlocked])

  return (
    <>
      {access.unlocked ? (
        <Suspense fallback={<div className="min-h-svh bg-cream" />}>
          <App />
        </Suspense>
      ) : (
        <BirthdayAccessLock remaining={access.remaining} />
      )}
      {import.meta.env.DEV ? (
        <AccessDevTools now={access.now} preview={access.preview} onChoose={access.choosePreview} />
      ) : null}
    </>
  )
}

function AccessDevTools({
  now,
  preview,
  onChoose,
}: {
  now: number
  preview: boolean
  onChoose: (iso: string | null) => void
}) {
  const clock = new Intl.DateTimeFormat('en-IN', {
    timeZone: birthdayConfig.timezone,
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }).format(now)

  const soon = () => new Date(unlockInstant() - SOON_MS).toISOString()

  return (
    <aside className="fixed left-3 top-3 z-[60] max-w-[13rem] rounded-2xl bg-night/90 p-3 text-left text-cream shadow-lg">
      <p className="text-[0.62rem] uppercase tracking-[0.16em] text-gold-bright">Access preview</p>
      <p className="mt-1 text-[0.68rem] text-cream/80">
        {clock}
        {preview ? ' · simulated' : ''}
      </p>
      <div className="mt-2 flex flex-col gap-1">
        <DevButton label="Real time" onClick={() => onChoose(null)} />
        <DevButton label="Stay locked" onClick={() => onChoose('2026-11-23T18:00:00+05:30')} />
        <DevButton label="Unlock in 10 seconds" onClick={() => onChoose(soon())} />
        <DevButton label="Already unlocked" onClick={() => onChoose('2026-11-24T09:00:00+05:30')} />
      </div>
    </aside>
  )
}

function DevButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded-full px-2 py-1 text-left text-[0.68rem] text-cream/90 hover:bg-white/10">
      {label}
    </button>
  )
}
