/// <reference types="vitest/globals" />
import { birthdayPhotos } from './data/birthdayPhotos'
import { birthdayGalleryWarnings, sortedBirthdayPhotos } from './utils/galleryUtils'

describe('25 years of Rutu', () => {
  it('keeps one stable photo for every birthday from 1 to 25', () => {
    const numbers = birthdayPhotos.map((photo) => photo.birthdayNumber)
    expect(numbers).toEqual(Array.from({ length: 25 }, (_, index) => index + 1))
    expect(new Set(birthdayPhotos.map((photo) => photo.photoId)).size).toBe(birthdayPhotos.length)
    expect(birthdayGalleryWarnings(birthdayPhotos)).toEqual([])
  })

  it('uses the spoken birthday labels', () => {
    const label = (n: number) => birthdayPhotos.find((photo) => photo.birthdayNumber === n)?.label
    expect(label(1)).toBe('1st Birthday')
    expect(label(2)).toBe('2nd Birthday')
    expect(label(3)).toBe('3rd Birthday')
    expect(label(11)).toBe('11th Birthday')
    expect(label(21)).toBe('21st Birthday')
    expect(label(22)).toBe('22nd Birthday')
    expect(label(23)).toBe('23rd Birthday')
    expect(label(25)).toBe('25th Birthday')
  })

  it('sorts by birthday number without losing a photo id', () => {
    const shuffled = [birthdayPhotos[24]!, birthdayPhotos[0]!, birthdayPhotos[10]!]
    const sorted = sortedBirthdayPhotos(shuffled)
    expect(sorted.map((photo) => photo.birthdayNumber)).toEqual([1, 11, 25])
    expect(sorted[0]?.photoId).toBe('birthday-photo-001')
  })

  it('warns about a repeated id and an unusable birthday number', () => {
    const broken = [
      { ...birthdayPhotos[0]!, birthdayNumber: 0 },
      { ...birthdayPhotos[1]!, photoId: birthdayPhotos[0]!.photoId },
    ]
    const warnings = birthdayGalleryWarnings(broken)
    expect(warnings.some((warning) => warning.includes('birthday number'))).toBe(true)
    expect(warnings.some((warning) => warning.includes('Duplicate photoId'))).toBe(true)
  })
})
