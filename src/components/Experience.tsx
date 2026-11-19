import { BirthdayHero } from './BirthdayHero'
import { CursorGlow } from './CursorGlow'
import { FinalSurprise } from './FinalSurprise'
import { FloatingHearts } from './FloatingHearts'
import { LoveLetter } from './LoveLetter'
import { LoveReasons } from './LoveReasons'
import { MusicPlayer } from './MusicPlayer'
import { PhotoGallery } from './PhotoGallery'
import { Portal } from './Portal'
import { SectionProgress } from './SectionProgress'
import { Timeline } from './Timeline'

export function Experience({
  onReplay,
  playing,
  missing,
  onToggleMusic,
}: {
  onReplay: () => void
  playing: boolean
  missing: boolean
  onToggleMusic: () => void
}) {
  return (
    <div
      className="relative min-h-svh text-ink"
      style={{
        background:
          'radial-gradient(1000px 520px at 0% -10%, rgba(237,213,207,0.85), transparent 58%), radial-gradient(820px 480px at 100% 8%, rgba(234,220,200,0.7), transparent 52%), #f7f1ea',
      }}
    >
      <Portal>
        <div className="grain pointer-events-none fixed inset-0 z-[1]" aria-hidden="true" />
        <FloatingHearts />
        <SectionProgress />
        <MusicPlayer playing={playing} missing={missing} onToggle={onToggleMusic} />
        <CursorGlow />
      </Portal>
      <main>
        <BirthdayHero />
        <PhotoGallery />
        <Timeline />
        <LoveReasons />
        <LoveLetter />
        <FinalSurprise onReplay={onReplay} />
      </main>
    </div>
  )
}
