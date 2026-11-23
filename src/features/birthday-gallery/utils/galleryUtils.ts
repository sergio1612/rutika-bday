import type { BirthdayPhoto } from '../data/birthdayPhotos'

export function sortedBirthdayPhotos(photos: readonly BirthdayPhoto[]): BirthdayPhoto[] {
  return [...photos].sort(
    (a, b) => a.birthdayNumber - b.birthdayNumber || a.photoId.localeCompare(b.photoId),
  )
}

export function birthdayGalleryWarnings(photos: readonly BirthdayPhoto[]): string[] {
  const warnings: string[] = []
  const ids = new Set<string>()
  const numbers = new Set<number>()

  for (const photo of photos) {
    if (!photo.photoId.trim()) {
      warnings.push('A birthday photo is missing its photoId.')
    } else if (ids.has(photo.photoId)) {
      warnings.push(`Duplicate photoId "${photo.photoId}".`)
    } else {
      ids.add(photo.photoId)
    }

    if (!Number.isInteger(photo.birthdayNumber) || photo.birthdayNumber < 1) {
      warnings.push(`"${photo.photoId}" needs a birthday number of 1 or more.`)
    } else if (numbers.has(photo.birthdayNumber)) {
      warnings.push(`Two photos share birthday ${photo.birthdayNumber}.`)
    } else {
      numbers.add(photo.birthdayNumber)
    }

    if (!photo.label.trim()) warnings.push(`"${photo.photoId}" has no label.`)
    if (!photo.image.trim()) warnings.push(`"${photo.photoId}" has no image path.`)
  }

  return warnings
}

export function warnIfBirthdayGalleryInvalid(photos: readonly BirthdayPhoto[]): void {
  if (!import.meta.env.DEV) return
  for (const warning of birthdayGalleryWarnings(photos)) {
    console.warn(`[birthday-gallery] ${warning}`)
  }
}
