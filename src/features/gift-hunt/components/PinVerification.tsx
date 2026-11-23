import { useRef, useState } from 'react'
import type { PinConfig, PinOutcome } from '../data/types'
import { PIN_LENGTH, isCompletePin, sanitizePin } from '../utils/pinInput'

export function PinVerification({
  pinConfig,
  attemptsUsed,
  onVerify,
  label = 'The code with the gift',
  placeholder,
  helper,
  buttonLabel = 'Verify',
  incorrectMessage = "Oops! That's not the right PIN. Try again ❤️",
  stacked = false,
}: {
  pinConfig: PinConfig
  attemptsUsed: number
  onVerify: (pin: string) => PinOutcome
  label?: string
  placeholder?: string
  helper?: string
  buttonLabel?: string
  incorrectMessage?: string
  stacked?: boolean
}) {
  const [value, setValue] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const pending = useRef(false)
  const remaining = Math.max(0, pinConfig.maxAttempts - attemptsUsed)
  const lockedOut = remaining === 0
  const ready = isCompletePin(value)

  const applyDigits = (next: string) => {
    setValue(sanitizePin(next))
    setMessage('')
  }

  const submit = () => {
    if (pending.current || busy || lockedOut || !isCompletePin(value)) return
    pending.current = true
    setBusy(true)
    const outcome = onVerify(value)
    if (outcome === 'success') {
      setMessage('')
    } else if (outcome === 'locked-out') {
      setValue('')
      setMessage('Those tries are used up. Manav can start them again for you.')
    } else if (outcome === 'incorrect') {
      const left = remaining - 1
      setValue('')
      setMessage(
        left <= 0
          ? 'Those tries are used up. Manav can start them again for you.'
          : incorrectMessage,
      )
    } else if (outcome === 'empty') {
      setMessage('Enter the 4-digit code you found with the gift.')
    }
    pending.current = false
    setBusy(false)
  }

  return (
    <form
      className={stacked ? 'mt-8' : 'mt-6'}
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <label
        className={
          stacked
            ? 'block font-serif text-xl text-rose-deep'
            : 'block text-left text-[0.68rem] uppercase tracking-[0.2em] text-gold'
        }
        htmlFor={pinConfig.pinId}
      >
        {label}
      </label>
      <div className={stacked ? 'mt-4' : 'mt-2 flex gap-2'}>
        <input
          id={pinConfig.pinId}
          value={value}
          type="text"
          inputMode="numeric"
          maxLength={PIN_LENGTH}
          pattern="[0-9]*"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="done"
          placeholder={placeholder}
          disabled={lockedOut}
          aria-invalid={message ? true : undefined}
          onChange={(event) => applyDigits(event.target.value)}
          onPaste={(event) => {
            event.preventDefault()
            const pasted = event.clipboardData.getData('text')
            const start = event.currentTarget.selectionStart ?? value.length
            const end = event.currentTarget.selectionEnd ?? value.length
            applyDigits(value.slice(0, start) + pasted + value.slice(end))
          }}
          className={
            stacked
              ? 'w-full rounded-2xl border border-rose/25 bg-cream px-4 py-3 text-center font-serif text-lg tracking-[0.28em] text-ink outline-none placeholder:font-sans placeholder:text-sm placeholder:tracking-normal placeholder:text-ink-soft/70'
              : 'min-w-0 flex-1 rounded-full border border-gold/30 bg-paper px-4 py-3 text-center font-sans tracking-[0.2em] text-ink outline-none'
          }
        />
        {stacked ? null : (
          <button
            type="submit"
            disabled={lockedOut || busy || !ready}
            className="rounded-full bg-wine px-4 py-3 text-[0.68rem] uppercase tracking-[0.18em] text-cream disabled:opacity-50"
          >
            {buttonLabel}
          </button>
        )}
      </div>
      {helper ? <p className="mt-3 text-sm font-light text-ink-soft">{helper}</p> : null}
      {message ? (
        <p className="mt-3 text-sm text-rose-deep" role="alert">
          {message}
        </p>
      ) : null}
      {stacked ? (
        <button
          type="submit"
          disabled={lockedOut || busy || !ready}
          className="mt-6 w-full rounded-full bg-wine px-6 py-3.5 text-[0.72rem] uppercase tracking-[0.22em] text-cream disabled:cursor-not-allowed disabled:opacity-40"
        >
          {buttonLabel}
        </button>
      ) : null}
      {!stacked && attemptsUsed > 0 && !lockedOut ? (
        <p className="mt-2 text-xs text-ink-soft">
          {remaining} {remaining === 1 ? 'try' : 'tries'} left
        </p>
      ) : null}
    </form>
  )
}
