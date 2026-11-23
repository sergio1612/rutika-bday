import { useCallback, useRef, useState } from 'react'

/** Place the song at public/audio/birthday-music.mp3. A missing file only disables the button. */
const SRC = '/audio/birthday-music.mp3'
const VOLUME = 0.28

export function useMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeRef = useRef(0)
  const missingRef = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [missing, setMissing] = useState(false)

  const markMissing = useCallback(() => {
    missingRef.current = true
    setMissing(true)
    setPlaying(false)
  }, [])

  const stopFade = useCallback(() => {
    cancelAnimationFrame(fadeRef.current)
  }, [])

  const getAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current
    const audio = new Audio(SRC)
    audio.loop = true
    audio.preload = 'auto'
    audio.setAttribute('playsinline', '')
    audio.addEventListener('error', markMissing)
    audioRef.current = audio
    return audio
  }, [markMissing])

  const fadeIn = useCallback(
    (audio: HTMLAudioElement) => {
      stopFade()
      const start = performance.now()
      const step = (now: number) => {
        if (audio.paused) return
        const t = Math.min(1, (now - start) / 1400)
        audio.volume = t * VOLUME
        if (t < 1) fadeRef.current = requestAnimationFrame(step)
      }
      audio.volume = 0
      fadeRef.current = requestAnimationFrame(step)
    },
    [stopFade],
  )

  const play = useCallback(() => {
    if (missingRef.current) return
    const audio = getAudio()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    audio.volume = reduced ? VOLUME : 0
    audio
      .play()
      .then(() => {
        setPlaying(true)
        if (!reduced) fadeIn(audio)
      })
      .catch((error: unknown) => {
        const name = error instanceof DOMException ? error.name : ''
        if (name === 'NotAllowedError' || name === 'AbortError') {
          setPlaying(false)
          return
        }
        markMissing()
      })
  }, [fadeIn, getAudio, markMissing])

  const pause = useCallback(() => {
    stopFade()
    audioRef.current?.pause()
    setPlaying(false)
  }, [stopFade])

  const reset = useCallback(() => {
    stopFade()
    const audio = audioRef.current
    if (!audio) {
      setPlaying(false)
      return
    }
    audio.pause()
    audio.currentTime = 0
    setPlaying(false)
  }, [stopFade])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (audio && !audio.paused) {
      pause()
      return
    }
    play()
  }, [pause, play])

  return { play, pause, reset, toggle, playing, missing }
}
