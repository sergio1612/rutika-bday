import { Ornament } from './Ornament'

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light = false,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  light?: boolean
}) {
  return (
    <header className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
      {eyebrow ? (
        <p
          className={`text-[0.72rem] uppercase tracking-[0.32em] ${light ? 'text-gold-bright' : 'text-gold'}`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`text-balance font-serif text-4xl leading-tight md:text-6xl ${eyebrow ? 'mt-4' : ''} ${light ? 'text-cream' : 'text-ink'}`}
      >
        {title}
      </h2>
      <Ornament className={light ? 'text-gold-bright' : ''} />
      {subtitle ? (
        <p
          className={`mx-auto mt-5 max-w-md text-base font-light leading-relaxed md:text-lg ${light ? 'text-cream/75' : 'text-ink-soft'}`}
        >
          {subtitle}
        </p>
      ) : null}
    </header>
  )
}
