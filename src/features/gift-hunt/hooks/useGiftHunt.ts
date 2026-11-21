import { useEffect, useMemo, useReducer, useState } from 'react'
import { giftConfig } from '../data/giftData'
import { huntLetter } from '../data/letterData'
import type { GiftDefinition, LockReason, PinOutcome } from '../data/types'
import { giftReducer } from '../state/giftReducer'
import { effectiveNow, setDevClock, simulatedClockActive } from '../utils/dateUtils'
import { warnIfGiftConfigInvalid } from '../utils/configValidator'
import { evaluatePin, finaleUnlocked, lockReasonFor, statusFor } from '../utils/giftRules'
import { clearProgress, loadProgress, saveProgress } from '../utils/storageUtils'

export type HuntGiftView = {
  gift: GiftDefinition
  status: 'locked' | 'available' | 'completed'
  lockReason: LockReason
}

export function useGiftHunt() {
  const gifts = giftConfig.gifts
  const [state, dispatch] = useReducer(giftReducer, undefined, loadProgress)
  const [now, setNow] = useState(() => effectiveNow())
  const [clockOn, setClockOn] = useState(() => simulatedClockActive())

  useEffect(() => {
    warnIfGiftConfigInvalid(giftConfig, huntLetter)
  }, [])

  useEffect(() => {
    saveProgress(state)
  }, [state])

  useEffect(() => {
    const tick = () => setNow(effectiveNow())
    const id = window.setInterval(tick, 1000)
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [clockOn])

  const completed = useMemo(() => new Set(state.completedGiftIds), [state.completedGiftIds])

  const views = useMemo<HuntGiftView[]>(
    () =>
      gifts
        .filter((gift) => gift.enabled)
        .sort((a, b) => a.order - b.order)
        .map((gift) => ({
          gift,
          status: statusFor(gift, gifts, completed, now),
          lockReason: lockReasonFor(gift, gifts, completed, now),
        })),
    [completed, gifts, now],
  )

  const letterReady = finaleUnlocked(gifts, completed)

  const verifyPin = (giftId: string, pin: string): PinOutcome => {
    const outcome = evaluatePin(state, gifts, giftId, pin, now)
    if (outcome === 'success' || outcome === 'incorrect') {
      dispatch({ type: 'verify-pin', giftId, pin, now, gifts })
    }
    return outcome
  }

  return {
    intro: giftConfig.intro,
    letter: huntLetter,
    started: state.started,
    now,
    views,
    letterReady,
    letterOpened: state.letterOpened && letterReady,
    revealedHintIds: state.revealedHintIds,
    attemptsByPinId: state.attemptsByPinId,
    clockOn,
    start: () => dispatch({ type: 'start' }),
    verifyPin,
    markFound: (giftId: string) => dispatch({ type: 'complete-without-pin', giftId, now, gifts }),
    revealHint: (hintId: string) => dispatch({ type: 'reveal-hint', hintId }),
    openLetter: () => {
      if (letterReady) dispatch({ type: 'open-letter' })
    },
    resetProgress: () => {
      clearProgress()
      dispatch({ type: 'reset' })
    },
    previewTime: (iso: string | null) => {
      setDevClock(iso)
      setClockOn(simulatedClockActive())
      setNow(effectiveNow())
    },
  }
}
