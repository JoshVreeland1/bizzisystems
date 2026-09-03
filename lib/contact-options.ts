/** Shared by the contact form and the route that validates it. */

export const MARKETS = ['City / Public sector', 'Warehouse / Logistics', 'Other'] as const

export const SPACE_COUNTS = [
  'Under 50',
  '50 to 250',
  '250 to 1,000',
  'More than 1,000',
  'Not sure yet',
] as const

export type Market = (typeof MARKETS)[number]
export type SpaceCount = (typeof SPACE_COUNTS)[number]
