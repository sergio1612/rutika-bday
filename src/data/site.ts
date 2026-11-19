/** Change this if the date ever needs to move. Month is 1–12. */
export const birthday = {
  year: 2026,
  month: 11,
  day: 24,
} as const

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

export function birthdayLabel() {
  return `${birthday.day} ${MONTHS[birthday.month - 1]} ${birthday.year}`
}

export type BirthdayPhase = {
  phase: 'before' | 'today' | 'after'
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function getBirthdayPhase(now = new Date()): BirthdayPhase {
  const target = new Date(birthday.year, birthday.month - 1, birthday.day)
  const diff = target.getTime() - now.getTime()

  if (diff > 0) {
    return {
      phase: 'before',
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1000),
    }
  }

  const sameDay =
    now.getFullYear() === birthday.year &&
    now.getMonth() === birthday.month - 1 &&
    now.getDate() === birthday.day

  return {
    phase: sameDay ? 'today' : 'after',
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  }
}
