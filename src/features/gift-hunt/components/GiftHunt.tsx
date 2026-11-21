import { MusicPlayer } from '../../../components/MusicPlayer'
import { SectionHeading } from '../../../components/SectionHeading'
import { useGiftHunt } from '../hooks/useGiftHunt'
import { DevClock } from './DevClock'
import { FinalLetter } from './FinalLetter'
import { GiftTimeline } from './GiftTimeline'
import { HuntIntroduction } from './HuntIntroduction'

export function GiftHunt({
  onBack,
  playing,
  missing,
  onToggleMusic,
}: {
  onBack: () => void
  playing: boolean
  missing: boolean
  onToggleMusic: () => void
}) {
  const hunt = useGiftHunt()

  return (
    <div
      className="min-h-svh text-ink"
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

      {hunt.started ? (
        <div className="px-5 pb-28 pt-6">
          <SectionHeading eyebrow="For Rutu" title={hunt.intro.title} subtitle={hunt.intro.subtitle} />
          <GiftTimeline
            views={hunt.views}
            now={hunt.now}
            attemptsByPinId={hunt.attemptsByPinId}
            revealedHintIds={hunt.revealedHintIds}
            onVerify={hunt.verifyPin}
            onRevealHint={hunt.revealHint}
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
              <FinalLetter letter={hunt.letter} opened={hunt.letterOpened} onOpen={hunt.openLetter} />
            ) : (
              <p className="mx-auto max-w-sm text-center font-serif text-2xl italic text-cream/80">
                One last letter is waiting until every surprise has been found.
              </p>
            )}
          </div>
        </div>
      ) : (
        <HuntIntroduction intro={hunt.intro} onBegin={hunt.start} />
      )}

      <MusicPlayer playing={playing} missing={missing} onToggle={onToggleMusic} />
      <DevClock now={hunt.now} active={hunt.clockOn} onPreview={hunt.previewTime} onReset={hunt.resetProgress} />
    </div>
  )
}
