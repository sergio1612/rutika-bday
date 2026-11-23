/// <reference types="vitest/globals" />
import { reasons } from './reasons'

describe('24 reasons', () => {
  it('has one stable card for every reason', () => {
    expect(reasons).toHaveLength(24)
    expect(reasons.map((reason) => reason.number)).toEqual(Array.from({ length: 24 }, (_, index) => index + 1))
    expect(new Set(reasons.map((reason) => reason.reasonId)).size).toBe(24)
    expect(reasons.every((reason) => reason.emoji && reason.title && reason.description)).toBe(true)
    expect(reasons.filter((reason) => reason.special)).toEqual([reasons[23]])
  })
})
