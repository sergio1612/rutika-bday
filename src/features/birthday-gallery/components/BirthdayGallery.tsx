import { useCallback, useEffect, useMemo, useState } from 'react'
import { SectionHeading } from '../../../components/SectionHeading'
import { Portal } from '../../../components/Portal'
import { birthdayPhotos } from '../data/birthdayPhotos'
import { birthdayGalleryCopy } from '../data/galleryCopy'
import { sortedBirthdayPhotos, warnIfBirthdayGalleryInvalid } from '../utils/galleryUtils'
import { BirthdayLightbox } from './BirthdayLightbox'
import { BirthdayPhotoCard } from './BirthdayPhotoCard'
import { GalleryClosing } from './GalleryClosing'

export function BirthdayGallery() {
  const photos = useMemo(() => sortedBirthdayPhotos(birthdayPhotos), [])
  const [openId, setOpenId] = useState<string | null>(null)
  const [failed, setFailed] = useState<Record<string, boolean>>({})

  useEffect(() => {
    warnIfBirthdayGalleryInvalid(birthdayPhotos)
  }, [])

  const markFailed = useCallback((photoId: string) => {
    setFailed((current) => (current[photoId] ? current : { ...current, [photoId]: true }))
  }, [])

  const close = useCallback(() => setOpenId(null), [])
  const showPrevious = useCallback(() => {
    setOpenId((current) => {
      if (!current) return current
      const index = photos.findIndex((photo) => photo.photoId === current)
      const previous = photos[(index - 1 + photos.length) % photos.length]
      return previous?.photoId ?? current
    })
  }, [photos])
  const showNext = useCallback(() => {
    setOpenId((current) => {
      if (!current) return current
      const index = photos.findIndex((photo) => photo.photoId === current)
      const next = photos[(index + 1) % photos.length]
      return next?.photoId ?? current
    })
  }, [photos])

  const openIndex = photos.findIndex((photo) => photo.photoId === openId)
  const openPhoto = openIndex >= 0 ? photos[openIndex] : null

  return (
    <section id="years" className="scroll-mt-20 overflow-x-clip px-5 py-24 md:px-8 md:py-32">
      <SectionHeading
        eyebrow={birthdayGalleryCopy.eyebrow}
        title={birthdayGalleryCopy.title}
        subtitle={birthdayGalleryCopy.subtitle}
      />

      <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {photos.map((photo) => (
          <li key={photo.photoId}>
            <BirthdayPhotoCard
              photo={photo}
              failed={Boolean(failed[photo.photoId])}
              onOpen={setOpenId}
              onFail={markFailed}
            />
          </li>
        ))}
      </ul>

      <GalleryClosing />

      {openPhoto ? (
        <Portal>
          <BirthdayLightbox
            photo={openPhoto}
            position={openIndex + 1}
            total={photos.length}
            failed={Boolean(failed[openPhoto.photoId])}
            onClose={close}
            onPrev={showPrevious}
            onNext={showNext}
            onFail={markFailed}
          />
        </Portal>
      ) : null}
    </section>
  )
}
