import { birthdayGalleryCopy } from '../data/galleryCopy'

export function GalleryClosing() {
  return (
    <div className="mx-auto mt-16 max-w-2xl rounded-[2rem] bg-paper px-6 py-14 text-center shadow-sm ring-1 ring-rose/25 md:mt-24 md:px-12 md:py-16">
      <h3 className="font-serif text-4xl italic leading-tight text-ink md:text-5xl">{birthdayGalleryCopy.closingTitle}</h3>
      <p className="mx-auto mt-6 max-w-lg font-serif text-xl leading-relaxed text-ink-soft md:text-2xl">
        {birthdayGalleryCopy.closingMessage}
      </p>
    </div>
  )
}
