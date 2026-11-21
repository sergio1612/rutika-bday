import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { Experience } from './components/Experience'
import { GiftHunt } from './features/gift-hunt/components/GiftHunt'
import { IntroScreen } from './components/IntroScreen'
import { Loader } from './components/Loader'
import { useMusic } from './hooks/useMusic'
import { useReducedMotion } from './hooks/useReducedMotion'

export default function App() {
  const music = useMusic()
  const reduced = useReducedMotion()
  const [loaded, setLoaded] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [started, setStarted] = useState(false)
  const [huntOpen, setHuntOpen] = useState(false)
  const finishLoading = useCallback(() => setLoaded(true), [])
  const opening = useRef(false)

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    const color = started ? '#f7f1ea' : '#140e10'
    meta?.setAttribute('content', color)
    document.documentElement.style.backgroundColor = color
  }, [started])

  const begin = () => {
    if (opening.current) return
    opening.current = true
    music.play()
    setStarted(true)
  }

  const replay = () => {
    opening.current = false
    setHuntOpen(false)
    music.reset()
    setStarted(false)
    window.scrollTo(0, 0)
  }

  return (
    <MotionConfig reducedMotion="user">
      {!loaded ? <Loader onDone={finishLoading} /> : null}
      {loaded ? (
        <AnimatePresence mode="wait">
          {started ? (
            <motion.div
              key="experience"
              initial={{ opacity: reduced ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.8 }}
            >
              {huntOpen ? (
                <GiftHunt
                  onBack={() => {
                    setHuntOpen(false)
                    window.scrollTo(0, 0)
                  }}
                  playing={music.playing}
                  missing={music.missing}
                  onToggleMusic={music.toggle}
                />
              ) : (
                <Experience
                  onReplay={replay}
                  onOpenGifts={() => {
                    setHuntOpen(true)
                    window.scrollTo(0, 0)
                  }}
                  playing={music.playing}
                  missing={music.missing}
                  onToggleMusic={music.toggle}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="intro"
              initial={{ opacity: reduced ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.55 }}
            >
              <IntroScreen onOpen={begin} />
            </motion.div>
          )}
        </AnimatePresence>
      ) : null}
    </MotionConfig>
  )
}
