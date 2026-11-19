import { useState } from 'react'
import { motion } from 'framer-motion'
import { memories } from '../data/memories'
import { SectionHeading } from './SectionHeading'

export function Timeline() {
  const [failed, setFailed] = useState<Record<string, boolean>>({})

  return (
    <section id="story" className="scroll-mt-20 px-5 py-24 md:px-8 md:py-32">
      <SectionHeading
        eyebrow="Our story"
        title="Every love story has its little moments. Here's ours."
      />

      <ol className="relative mx-auto max-w-4xl">
        <div className="absolute bottom-0 left-[7px] top-0 w-px -translate-x-1/2 bg-gold/35 md:left-1/2" aria-hidden="true" />
        {memories.map((memory, index) => {
          const onLeft = index % 2 === 0
          return (
            <motion.li
              key={memory.id}
              className="relative pb-16"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              <span className="absolute left-[7px] top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-gold ring-4 ring-cream md:left-1/2" />
              <div
                className={`pl-10 md:w-1/2 ${onLeft ? 'md:pr-14 md:text-right' : 'md:ml-auto md:pl-14'}`}
              >
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-gold">{memory.date}</p>
                <h3 className="mt-2 font-serif text-3xl text-ink md:text-4xl">{memory.title}</h3>
                <p className="mt-3 font-light leading-relaxed text-ink-soft">{memory.description}</p>
                {memory.image && !failed[memory.id] ? (
                  <img
                    src={memory.image}
                    alt={memory.imageAlt}
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailed((current) => ({ ...current, [memory.id]: true }))}
                    className="mt-5 aspect-[4/3] w-full rounded-2xl object-cover"
                  />
                ) : null}
              </div>
            </motion.li>
          )
        })}
      </ol>
    </section>
  )
}
