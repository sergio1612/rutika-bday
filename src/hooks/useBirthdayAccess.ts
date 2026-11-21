import { useEffect, useState } from 'react'
import { accessNow, accessPreviewActive, isUnlocked, remainingUntil, setAccessPreview, unlockInstant } from '../config/birthdayAccess'

export function useBirthdayAccess() {
  const target = unlockInstant()
  const [now, setNow] = useState(() => accessNow())
  const [preview, setPreview] = useState(() => accessPreviewActive())

  useEffect(() => {
    const tick = () => setNow(accessNow())
    const id = window.setInterval(tick, 1000)
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [preview])

  const choosePreview = (iso: string | null) => {
    setAccessPreview(iso)
    setPreview(accessPreviewActive())
    setNow(accessNow())
  }

  return {
    unlocked: isUnlocked(now, target),
    remaining: remainingUntil(target, now),
    now,
    preview,
    choosePreview,
  }
}
