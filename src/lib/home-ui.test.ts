import { describe, expect, test } from 'bun:test'

import { getMobileMenuState, getTheaterHeaderState, nextMobileMenuExpanded } from './home-ui'

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
