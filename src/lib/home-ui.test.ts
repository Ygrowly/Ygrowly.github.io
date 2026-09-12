import { describe, expect, test } from 'bun:test'

import {
  echoActiveIndex,
  echoScrollProgress,
  getMobileMenuState,
  getTheaterHeaderState,
  nextMobileMenuExpanded,
  scrubEase
} from './home-ui'

describe('homepage interaction state', () => {
  test('mobile menu exposes matching aria and document-lock state', () => {
    expect(getMobileMenuState(true, { open: 'Open menu', close: 'Close menu' })).toEqual({
      expanded: true,
      ariaExpanded: 'true',
      ariaHidden: 'false',
      buttonLabel: 'Close menu',
      locksDocument: true
    })
    expect(getMobileMenuState(false, { open: '打开菜单', close: '关闭菜单' })).toEqual({
      expanded: false,
      ariaExpanded: 'false',
      ariaHidden: 'true',
      buttonLabel: '打开菜单',
      locksDocument: false
    })
  })

  test('toggle opens or closes while escape, scrim, and navigation links always close', () => {
    expect(nextMobileMenuExpanded(false, 'toggle')).toBe(true)
    expect(nextMobileMenuExpanded(true, 'toggle')).toBe(false)
    expect(nextMobileMenuExpanded(true, 'escape')).toBe(false)
    expect(nextMobileMenuExpanded(true, 'scrim')).toBe(false)
    expect(nextMobileMenuExpanded(true, 'link')).toBe(false)
  })

  test('theater state changes only the header foreground attribute contract', () => {
    expect(getTheaterHeaderState(true)).toEqual({
      attribute: 'data-over-theater',
      enabled: true
    })
    expect(getTheaterHeaderState(false)).toEqual({
      attribute: 'data-over-theater',
      enabled: false
    })
  })
})

// The SystemEchoes chapter drove these with GSAP ScrollTrigger until it was
// replaced with plain scroll accounting. These pin the replacement to the
// behaviour the trigger had: start 'top top', end 'bottom bottom', and a card
// advancing every 360/count degrees of ring rotation.
describe('system echoes scroll accounting', () => {
  const VIEWPORT = 900
  const SECTION = VIEWPORT * 3.2 // 320vh chapter

  test('progress runs 0 to 1 as the section passes the viewport', () => {
    // Section top at the viewport top.
    expect(echoScrollProgress(0, SECTION, VIEWPORT)).toBe(0)
    // Section bottom at the viewport bottom.
    expect(echoScrollProgress(-(SECTION - VIEWPORT), SECTION, VIEWPORT)).toBe(1)
    // Halfway through the travel.
    expect(echoScrollProgress(-(SECTION - VIEWPORT) / 2, SECTION, VIEWPORT)).toBeCloseTo(0.5, 5)
  })

  test('progress clamps outside the section', () => {
    expect(echoScrollProgress(500, SECTION, VIEWPORT)).toBe(0)
    expect(echoScrollProgress(-5000, SECTION, VIEWPORT)).toBe(1)
  })

  test('a section shorter than the viewport cannot divide by zero', () => {
    expect(echoScrollProgress(0, 400, VIEWPORT)).toBe(0)
    expect(Number.isFinite(echoScrollProgress(-400, 400, VIEWPORT))).toBe(true)
  })

  test('cards advance one per 360/count of rotation', () => {
    const count = 6
    expect(echoActiveIndex(0, count)).toBe(0)
    // A sixth of the way round is exactly one card along.
    expect(echoActiveIndex(1 / 6, count)).toBe(5)
    expect(echoActiveIndex(2 / 6, count)).toBe(4)
    // A full turn is back to the start.
    expect(echoActiveIndex(1, count)).toBe(0)
  })

  test('the active index is always a valid card slot', () => {
    for (const count of [2, 4, 6, 7]) {
      for (let p = 0; p <= 1; p += 0.01) {
        const index = echoActiveIndex(p, count)
        expect(index).toBeGreaterThanOrEqual(0)
        expect(index).toBeLessThan(count)
        expect(Number.isInteger(index)).toBe(true)
      }
    }
  })

  test('an empty deck resolves to slot 0 instead of NaN', () => {
    expect(echoActiveIndex(0.5, 0)).toBe(0)
  })

  test('scrub easing converges without overshooting', () => {
    expect(scrubEase(0)).toBe(0)
    expect(scrubEase(0.6)).toBeCloseTo(1 - Math.exp(-1), 5)
    expect(scrubEase(10)).toBeGreaterThan(0.99)
    expect(scrubEase(10)).toBeLessThanOrEqual(1)
    // A negative frame delta (clock skew) must not move backwards.
    expect(scrubEase(-1)).toBe(0)
  })
})
