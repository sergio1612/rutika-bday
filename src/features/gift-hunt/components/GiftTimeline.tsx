import type { HuntGiftView } from '../hooks/useGiftHunt'
import type { PinOutcome } from '../data/types'
import { GiftCard } from './GiftCard'

export function GiftTimeline({
  views,
  now,
  attemptsByPinId,
  revealedHintIds,
  onVerify,
  onRevealHint,
  onFound,
}: {
  views: HuntGiftView[]
  now: number
  attemptsByPinId: Record<string, number>
  revealedHintIds: string[]
  onVerify: (giftId: string, pin: string) => PinOutcome
  onRevealHint: (hintId: string) => void
  onFound: (giftId: string) => void
}) {
  return (
    <ol className="relative mx-auto max-w-xl space-y-6">
      <div className="absolute bottom-0 left-[7px] top-0 w-px bg-gold/30 md:left-1/2" aria-hidden="true" />
      {views.map((view) => (
        <li key={view.gift.giftId} className="relative pl-8 md:pl-0">
          <span
            className={`absolute left-[7px] top-8 h-2.5 w-2.5 -translate-x-1/2 rounded-full ring-4 ring-cream md:left-1/2 ${
              view.status === 'completed' ? 'bg-gold' : view.status === 'available' ? 'bg-rose-deep' : 'bg-gold/30'
            }`}
          />
          <div className={`md:w-[calc(50%-2rem)] ${view.gift.order % 2 === 1 ? 'md:mr-auto' : 'md:ml-auto'}`}>
            <GiftCard
              view={view}
              now={now}
              attemptsUsed={view.gift.pinConfig ? (attemptsByPinId[view.gift.pinConfig.pinId] ?? 0) : 0}
              revealedHintIds={revealedHintIds}
              onVerify={(pin) => onVerify(view.gift.giftId, pin)}
              onRevealHint={onRevealHint}
              onFound={() => onFound(view.gift.giftId)}
            />
          </div>
        </li>
      ))}
    </ol>
  )
}
