import { useEffect } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function Loader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion()

  useEffect(() => {
    const id = window.setTimeout(onDone, reduced ? 0 : 1500)
    return () => window.clearTimeout(id)
  }, [onDone, reduced])

  if (reduced) return null

  return (
    <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-night px-6 text-center text-cream">
      <p className="font-script text-5xl text-gold-bright md:text-6xl">For Rutu</p>
      <div className="mt-8 h-px w-40 overflow-hidden bg-white/15">
        <div className="loader-bar h-full bg-gold-bright" />
      </div>
    </div>
  )
}
