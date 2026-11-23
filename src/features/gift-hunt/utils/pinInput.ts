export const PIN_LENGTH = 4

/** Keep digits only, as a string, and never more than four. */
export function sanitizePin(value: string): string {
  return value.replace(/\D/g, '').slice(0, PIN_LENGTH)
}

export function isCompletePin(value: string): boolean {
  return new RegExp(`^\\d{${PIN_LENGTH}}$`).test(value)
}
