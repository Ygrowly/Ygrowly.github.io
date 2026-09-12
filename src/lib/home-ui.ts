export type MobileMenuAction = 'toggle' | 'escape' | 'scrim' | 'link'

interface MobileMenuLabels {
  open: string
  close: string
}

export interface MobileMenuState {
  expanded: boolean
  ariaExpanded: 'true' | 'false'
  ariaHidden: 'true' | 'false'
  buttonLabel: string
  locksDocument: boolean
}

export function nextMobileMenuExpanded(current: boolean, action: MobileMenuAction) {
  return action === 'toggle' ? !current : false
}

export function getMobileMenuState(expanded: boolean, labels: MobileMenuLabels): MobileMenuState {
  return {
    expanded,
    ariaExpanded: String(expanded) as MobileMenuState['ariaExpanded'],
    ariaHidden: String(!expanded) as MobileMenuState['ariaHidden'],
    buttonLabel: expanded ? labels.close : labels.open,
    locksDocument: expanded
  }
}

export function getTheaterHeaderState(isIntersecting: boolean) {
  return {
    attribute: 'data-over-theater' as const,
    enabled: isIntersecting
  }
}

/**
 * Scroll progress across the sticky SystemEchoes chapter: 0 when the section
 * top reaches the viewport top, 1 when its bottom reaches the viewport bottom.
 * This is what GSAP's ScrollTrigger supplied as `start: 'top top'` /
 * `end: 'bottom bottom'`, recomputed from the live rect.
 */
export function echoScrollProgress(
  sectionTop: number,
  sectionHeight: number,
  viewportHeight: number
) {
  const travel = Math.max(1, sectionHeight - viewportHeight)
  return Math.min(1, Math.max(0, -sectionTop / travel))
}

/**
 * Which echo card the ring has rotated into view. One full turn spans the whole
 * section, so the active card advances every `360 / count` degrees — the ring
 * turning clockwise walks the cards backwards, hence the negation.
 */
export function echoActiveIndex(progress: number, count: number) {
  if (count <= 0) return 0
  const step = 360 / count
  const rotation = progress * 360
  return Math.round(((-rotation / step) % count) + count) % count
}

/**
 * Fraction of the remaining distance to close this frame, for an exponential
 * catch-up with the given time constant in seconds. Matches the `scrub` value
 * the ScrollTrigger used, without the library.
 */
export function scrubEase(deltaSeconds: number, scrubSeconds = 0.6) {
  return 1 - Math.exp(-Math.max(0, deltaSeconds) / scrubSeconds)
}
