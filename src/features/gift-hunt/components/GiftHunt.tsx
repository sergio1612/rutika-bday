import { useState } from 'react'
import { FinalSurprise } from '../../../components/FinalSurprise'
import { MusicPlayer } from '../../../components/MusicPlayer'
import { SectionHeading } from '../../../components/SectionHeading'
import { useGiftHunt } from '../hooks/useGiftHunt'
import { ClueCardSheet } from './ClueCardSheet'
import { DevClock } from './DevClock'
import { GiftTimeline } from './GiftTimeline'
import { HuntIntroduction } from './HuntIntroduction'

export function GiftHunt({
  onBack,
  onNeedGate,
  onReplay,
  playing,
  missing,
  onToggleMusic,
}: {
  onBack: () => void
  onNeedGate: () => void
  onReplay: () => void
  playing: boolean
  missing: boolean
  onToggleMusic: () => void
}) {
  const hunt = useGiftHunt()
  const [printing, setPrinting] = useState(false)

  return (
    <>
    <div
      className={`min-h-svh text-ink ${printing ? 'print:hidden' : ''}`}
      style={{
        background:
          'radial-gradient(900px 480px at 10% -10%, rgba(237,213,207,0.9), transparent 55%), #f7f1ea',
      }}
    >
      <header className="flex items-center justify-between px-4 pt-5">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full px-3 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-ink-soft"
        >
          Back to our story
        </button>
      </header>

      {!hunt.gateCleared ? (
        <section className="mx-auto max-w-xl px-5 py-24 text-center">
          <h1 className="font-serif text-4xl italic text-ink md:text-5xl">Gift comes first</h1>
          <p className="mx-auto mt-6 max-w-md font-light leading-relaxed text-ink-soft">
            The first little code is waiting in Gift. This hunt begins after that surprise is found.
          </p>
          <button
            type="button"
            onClick={onNeedGate}
            className="mt-10 inline-flex rounded-full bg-wine px-8 py-3.5 text-[0.72rem] uppercase tracking-[0.26em] text-cream"
          >
            Go to Gift
          </button>
        </section>
      ) : hunt.started ? (
        <div className="px-5 pb-28 pt-6">
          <SectionHeading eyebrow="For Rutu" title={hunt.intro.title} />
          <GiftTimeline
            views={hunt.views}
            now={hunt.now}
            attemptsByPinId={hunt.attemptsByPinId}
            onVerify={hunt.verifyPin}
            onFound={hunt.markFound}
          />
          <div
            className="mt-16 rounded-[2rem] px-2 py-12"
            style={{
              background:
                'radial-gradient(700px 320px at 50% 0%, rgba(143,78,86,0.45), transparent 70%), #140e10',
            }}
          >
            {hunt.letterReady ? (
              <FinalSurprise onReplay={onReplay} />
            ) : (
              <p className="mx-auto max-w-sm text-center font-serif text-2xl italic text-cream/80">
                One last surprise is waiting until every gift has been found.
              </p>
            )}
          </div>
        </div>
      ) : (
        <HuntIntroduction intro={hunt.intro} onBegin={hunt.start} />
      )}

      <MusicPlayer playing={playing} missing={missing} onToggle={onToggleMusic} />
      <DevClock
        now={hunt.now}
        active={hunt.clockOn}
        onPreview={hunt.previewTime}
        onReset={hunt.resetProgress}
        onPrint={() => setPrinting(true)}
      />
    </div>
    {printing ? <ClueCardSheet onClose={() => setPrinting(false)} /> : null}
    </>
  )
}
