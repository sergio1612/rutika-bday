export type BirthdayPhoto = {
  photoId: string
  birthdayNumber: number
  label: string
  image: string
  caption: string
  alt: string
}

/**
 * One photograph for each birthday from 1 to 25.
 * Put the file in `public/images/birthdays/`, then change `image` if the name differs.
 * Set `caption` when you want a line under that year. Leave it empty until then.
 * Change `birthdayNumber` to reorder. Keep `photoId` the same once she has seen the album.
 */
function photo(birthdayNumber: number, label: string, caption = '', extension = 'jpg'): BirthdayPhoto {
  const file = String(birthdayNumber).padStart(2, '0')
  const id = String(birthdayNumber).padStart(3, '0')
  return {
    photoId: `birthday-photo-${id}`,
    birthdayNumber,
    label,
    image: `/images/birthdays/${file}.${extension}`,
    caption,
    alt: `Photograph from Rutu's ${label.toLowerCase()}`,
  }
}

export const birthdayPhotos: BirthdayPhoto[] = [
  photo(1, '1st Birthday'),
  photo(2, '2nd Birthday'),
  photo(3, '3rd Birthday'),
  photo(4, '4th Birthday'),
  photo(5, '5th Birthday'),
  photo(6, '6th Birthday'),
  photo(7, '7th Birthday'),
  photo(8, '8th Birthday'),
  photo(9, '9th Birthday'),
  photo(10, '10th Birthday'),
  photo(11, '11th Birthday'),
  photo(12, '12th Birthday'),
  photo(13, '13th Birthday'),
  photo(14, '14th Birthday'),
  photo(15, '15th Birthday'),
  photo(16, '16th Birthday'),
  photo(17, '17th Birthday'),
  photo(18, '18th Birthday'),
  photo(19, '19th Birthday'),
  photo(20, '20th Birthday'),
  photo(21, '21st Birthday'),
  photo(22, '22nd Birthday'),
  photo(23, '23rd Birthday'),
  photo(24, '24th Birthday', '', 'jpeg'),
  photo(25, '25th Birthday', '', 'jpeg'),
]
