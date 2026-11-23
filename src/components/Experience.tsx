import { birthdayConfig } from '../config/birthdayConfig'
import { BirthdayGallery } from '../features/birthday-gallery/components/BirthdayGallery'
import { FirstGiftGate } from '../features/gift-hunt/components/FirstGiftGate'
import { useGiftHunt } from '../features/gift-hunt/hooks/useGiftHunt'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { BirthdayHero } from './BirthdayHero'
import { CursorGlow } from './CursorGlow'
import { FloatingHearts } from './FloatingHearts'
import { LoveLetter } from './LoveLetter'
import { LoveReasons } from './LoveReasons'
import { MusicPlayer } from './MusicPlayer'
import { PhotoGallery } from './PhotoGallery'
import { Portal } from './Portal'
import { SectionProgress } from './SectionProgress'

export function Experience({
  onOpenGifts,
  playing,
  missing,
  onToggleMusic,
}: {
  onOpenGifts: () => void
  playing: boolean
  missing: boolean
  onToggleMusic: () => void
}) {
  const hunt = useGiftHunt()
  const reduced = useReducedMotion()
  const openHunt = () => {
    if (!hunt.gateCleared) {
      document.getElementById('gift')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
      return
    }
    hunt.start()
    onOpenGifts()
  }

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
        <SectionProgress onOpenGifts={openHunt} />
        <MusicPlayer playing={playing} missing={missing} onToggle={onToggleMusic} />
        <CursorGlow />
      </Portal>
      <main>
        <BirthdayHero />
        <BirthdayGallery />
        {birthdayConfig.showMoments ? <PhotoGallery /> : null}
        <LoveReasons />
        <LoveLetter />
        <FirstGiftGate onContinue={openHunt} />
      </main>
    </div>
  )
}
