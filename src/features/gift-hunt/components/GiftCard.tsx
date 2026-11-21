import { useState } from 'react'
import { Lock } from 'lucide-react'
import type { HuntGiftView } from '../hooks/useGiftHunt'
import type { PinOutcome } from '../data/types'
import { formatInKolkata, parseSchedule } from '../utils/dateUtils'
import { CountdownTimer } from './CountdownTimer'
import { PinVerification } from './PinVerification'

export function GiftCard({
  view,
  now,
  attemptsUsed,
  revealedHintIds,
  onVerify,
  onRevealHint,
  onFound,
}: {
  view: HuntGiftView
  now: number
  attemptsUsed: number
  revealedHintIds: string[]
  onVerify: (pin: string) => PinOutcome
  onRevealHint: (hintId: string) => void
  onFound: () => void
}) {
  const { gift, status, lockReason } = view
  const [reread, setReread] = useState(false)
  const opens = formatInKolkata(parseSchedule(gift.unlockAt))

  if (status === 'locked') {
    return (
      <article className="rounded-3xl bg-paper/80 px-5 py-6 text-center shadow-sm ring-1 ring-gold/15">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cream-2 text-gold">
          <Lock className="h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="mt-4 font-serif text-2xl text-ink">A sealed surprise</h3>
        <p className="mt-2 text-sm font-light text-ink-soft">
          {lockReason === 'previous'
            ? 'This one stays closed until the surprise before it has been found.'
            : `It opens ${opens}.`}
        </p>
        {lockReason === 'time' ? <CountdownTimer targetMs={parseSchedule(gift.unlockAt)} nowMs={now} /> : null}
        {lockReason === 'previous' ? (
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-gold">Opens {opens}</p>
        ) : null}
      </article>
    )
  }

  if (status === 'completed') {
    return (
      <article className="rounded-3xl bg-paper px-5 py-6 text-center shadow-sm ring-1 ring-gold/25">
        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-gold">Found</p>
        <h3 className="mt-2 font-serif text-3xl text-ink">{gift.name}</h3>
        {gift.image ? (
          <img src={gift.image} alt="" className="mx-auto mt-4 max-h-48 rounded-2xl object-cover" />
        ) : null}
        <p className="mt-4 font-serif text-xl leading-relaxed text-ink/90">{gift.completionMessage.text}</p>
        <button
          type="button"
          onClick={() => setReread((open) => !open)}
          className="mt-4 text-[0.68rem] uppercase tracking-[0.18em] text-rose-deep"
          aria-expanded={reread}
        >
          {reread ? 'Hide the clue' : 'Read the clue again'}
        </button>
        {reread ? <Clues gift={gift} revealedHintIds={revealedHintIds} onRevealHint={onRevealHint} /> : null}
      </article>
    )
  }

  return (
    <article className="rounded-3xl bg-gradient-to-b from-paper to-blush/40 px-5 py-6 text-center shadow-md ring-1 ring-rose/20">
      <p className="text-[0.68rem] uppercase tracking-[0.22em] text-rose-deep">This one is ready</p>
      <h3 className="mt-2 font-serif text-3xl italic text-ink">Follow the clue</h3>
      <Clues gift={gift} revealedHintIds={revealedHintIds} onRevealHint={onRevealHint} />
      {gift.requiresPin && gift.pinConfig ? (
        <PinVerification pinConfig={gift.pinConfig} attemptsUsed={attemptsUsed} onVerify={onVerify} />
      ) : (
        <button
          type="button"
          onClick={onFound}
          className="mt-6 rounded-full bg-wine px-6 py-3 text-[0.68rem] uppercase tracking-[0.18em] text-cream"
        >
          I found it
        </button>
      )}
    </article>
  )
}

function Clues({
  gift,
  revealedHintIds,
  onRevealHint,
}: {
  gift: HuntGiftView['gift']
  revealedHintIds: string[]
  onRevealHint: (hintId: string) => void
}) {
  return (
    <div className="mt-4 space-y-4 text-left">
      {gift.clues.map((clue) => (
        <div key={clue.clueId}>
          <p className="font-serif text-lg text-ink">{clue.title}</p>
          <p className="mt-1 font-light leading-relaxed text-ink-soft">{clue.description}</p>
          {clue.hints.map((hint) => {
            const shown = revealedHintIds.includes(hint.hintId)
            return shown ? (
              <p key={hint.hintId} className="mt-3 rounded-2xl bg-cream/80 px-4 py-3 text-sm text-ink">
                {hint.text}
              </p>
            ) : (
              <button
                key={hint.hintId}
                type="button"
                onClick={() => onRevealHint(hint.hintId)}
                className="mt-3 text-[0.68rem] uppercase tracking-[0.16em] text-gold"
              >
                A little nudge
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
