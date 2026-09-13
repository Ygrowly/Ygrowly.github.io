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
