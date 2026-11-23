import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { giftConfig } from '../data/giftData'
import { useGiftHunt } from '../hooks/useGiftHunt'
import { parseSchedule } from '../utils/dateUtils'
import { ClueCardSheet } from './ClueCardSheet'
import { CountdownTimer } from './CountdownTimer'
import { DevClock } from './DevClock'
import { useReducedMotion } from '../../../hooks/useReducedMotion'
import { PinVerification } from './PinVerification'

export function FirstGiftGate({ onContinue }: { onContinue: () => void }) {
  const hunt = useGiftHunt()
  const reduced = useReducedMotion()
  const [printing, setPrinting] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const continueRef = useRef(onContinue)
  const gate = hunt.views.find((view) => view.isOpeningClue)

  useEffect(() => {
    continueRef.current = onContinue
  }, [onContinue])

  useEffect(() => {
    if (!leaving) return
    const id = window.setTimeout(() => continueRef.current(), 1500)
    return () => window.clearTimeout(id)
  }, [leaving])

  if (!gate) return null

  const clue = gate.gift.clues[0]
  const locked = gate.status === 'locked'
  const found = gate.status === 'completed'
  const attempts = gate.gift.pinConfig ? (hunt.attemptsByPinId[gate.gift.pinConfig.pinId] ?? 0) : 0

  return (
    <>
      <section
        id="gift"
        className="relative scroll-mt-20 overflow-hidden px-5 py-28 md:py-36"
        style={{
          background:
            'radial-gradient(800px 420px at 50% 0%, rgba(143,78,86,0.55), transparent 60%), #140e10',
          paddingBottom: 'calc(7rem + env(safe-area-inset-bottom))',
        }}
      >
        <div className="mx-auto max-w-xl text-center">
          {locked ? (
            <>
              <p className="font-serif text-3xl italic leading-relaxed text-cream md:text-4xl">{giftConfig.intro.waiting}</p>
              <div className="mx-auto mt-10 max-w-sm rounded-[2rem] bg-paper px-6 py-8 text-ink">
                <CountdownTimer targetMs={parseSchedule(gate.gift.unlockAt)} nowMs={hunt.now} />
              </div>
            </>
          ) : (
            <div className="rounded-[2rem] bg-paper px-6 py-10 text-ink shadow-xl md:px-10">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-gold">Gift</p>
              <h2 className="mt-4 font-serif text-4xl italic leading-tight">{clue?.title}</h2>
              <p className="mt-6 whitespace-pre-line text-left font-serif text-xl leading-relaxed text-ink-soft">
                {clue?.description}
              </p>
              {found ? (
                <motion.div
                  initial={{ opacity: 0, y: reduced ? 0 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0 : 0.45 }}
                  className="mt-8"
                >
                  <p className="font-serif text-2xl text-rose-deep">You found your first surprise! 💗</p>
                  <button
                    type="button"
                    onClick={onContinue}
                    className="mt-6 w-full rounded-full bg-wine px-6 py-3.5 text-[0.72rem] uppercase tracking-[0.22em] text-cream"
                  >
                    Let's continue ♡
                  </button>
                </motion.div>
              ) : gate.gift.pinConfig ? (
                <PinVerification
                  pinConfig={gate.gift.pinConfig}
                  attemptsUsed={attempts}
                  stacked
                  label="Enter the secret code from your gift"
                  placeholder="Enter 4-digit code"
                  helper="You'll find the code with your first surprise. ❤️"
                  buttonLabel="Unlock my surprise ♡"
                  incorrectMessage="Oops! That's not the right code. Try again ❤️"
                  onVerify={(pin) => {
                    const outcome = hunt.verifyPin(gate.gift.giftId, pin)
                    if (outcome === 'success') setLeaving(true)
                    return outcome
                  }}
                />
              ) : null}
            </div>
          )}
        </div>
      </section>
      <DevClock
        now={hunt.now}
        active={hunt.clockOn}
        onPreview={hunt.previewTime}
        onReset={hunt.resetProgress}
        onPrint={() => setPrinting(true)}
      />
      {printing ? <ClueCardSheet onClose={() => setPrinting(false)} /> : null}
    </>
  )
}
