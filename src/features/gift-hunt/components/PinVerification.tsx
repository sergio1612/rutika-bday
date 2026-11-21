import { useState } from 'react'
import type { PinConfig, PinOutcome } from '../data/types'

export function PinVerification({
  pinConfig,
  attemptsUsed,
  onVerify,
}: {
  pinConfig: PinConfig
  attemptsUsed: number
  onVerify: (pin: string) => PinOutcome
}) {
  const [value, setValue] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const remaining = Math.max(0, pinConfig.maxAttempts - attemptsUsed)
  const lockedOut = remaining === 0

  const submit = () => {
    if (busy || lockedOut) return
    setBusy(true)
    const outcome = onVerify(value)
    if (outcome === 'success') {
      setMessage('')
    } else if (outcome === 'locked-out') {
      setMessage('Those tries are used up. Manav can start them again for you.')
    } else if (outcome === 'incorrect') {
      const left = remaining - 1
      setMessage(
        left <= 0
          ? 'Those tries are used up. Manav can start them again for you.'
          : 'That is not the little code on the gift.',
      )
    } else if (outcome === 'empty') {
      setMessage('Enter the code you found with the gift.')
    }
    setBusy(false)
  }

  return (
    <form
      className="mt-6"
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <label className="block text-left text-[0.68rem] uppercase tracking-[0.2em] text-gold" htmlFor={pinConfig.pinId}>
        The code with the gift
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id={pinConfig.pinId}
          value={value}
          disabled={lockedOut}
          autoComplete="off"
          inputMode="text"
          onChange={(event) => setValue(event.target.value)}
          className="min-w-0 flex-1 rounded-full border border-gold/30 bg-paper px-4 py-3 text-center font-sans tracking-[0.2em] text-ink outline-none"
        />
        <button
          type="submit"
          disabled={lockedOut || busy}
          className="rounded-full bg-wine px-4 py-3 text-[0.68rem] uppercase tracking-[0.18em] text-cream disabled:opacity-50"
        >
          Verify
        </button>
      </div>
      {message ? (
        <p className="mt-3 text-sm text-rose-deep" role="alert">
          {message}
        </p>
      ) : null}
      {attemptsUsed > 0 && !lockedOut ? (
        <p className="mt-2 text-xs text-ink-soft">
          {remaining} {remaining === 1 ? 'try' : 'tries'} left
        </p>
      ) : null}
    </form>
  )
}
