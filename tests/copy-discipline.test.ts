import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * A regression test for the claims, not the code.
 *
 * Every phrase below was either removed from the previous site because nothing
 * currently supports it, is a pipeline account that must not read as a
 * customer, or is marketing filler the company does not write. If one comes
 * back, this fails and someone has to justify it.
 */

function sourceFiles(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) sourceFiles(path, found)
    else if (/\.(tsx?|mdx?)$/.test(entry) && !path.includes('/tests/')) found.push(path)
  }
  return found
}

const FILES = [...sourceFiles('app'), ...sourceFiles('lib')].map((path) => ({
  path,
  text: readFileSync(path, 'utf8'),
}))

const UNSUPPORTED_CLAIMS = [
  'no permit required',
  'single technician',
  'permit type',
  'unauthorized vehicle',
  'unauthorised vehicle',
  'requires no tools',
  'no tools required',
  'detention recovery',
  'recover detention',
  'recovered detention',
  'proven roi',
  'guaranteed savings',
  'installs in a day',
  'no procurement',
  'no rfp',
  'buyboard',
  'sourcewell',
]

const OFF_LIMITS_NAMES = [
  'city of austin',
  'city of san antonio',
  'city of glendale',
  'h-e-b',
  'heb distribution',
  'ben e. keith',
  'ryker',
  // The field site's host is anonymous on the public site.
  'honest mary',
  'burnet rd',
  'burnet road',
  // Not on the website, by instruction.
  'alex gilbert',
  'whoop',
  'mass product development',
]

const MARKETING_FILLER = [
  'revolutionary',
  'transformative',
  'game-changing',
  'cutting-edge',
  'best-in-class',
  'world-class',
  'seamless',
  'holistic',
  'leveraging',
  'unlocking',
  'empowering',
  'mission-critical',
  'next-generation',
  'the future of',
  'reimagine',
  'redefine',
  'powerful platform',
  'innovative solution',
  'actionable insights',
  'unparalleled',
  'gold standard',
  'smart city',
  'smart parking',
  'end-to-end solution',
  'turnkey',
  'best in class',
  // Rhetorical tics that read as machine-written.
  'we are not describing',
  'rather than falling back',
  'worth stating plainly',
  'not to score you',
  'the useful result',
  'would rather scope',
  'noise rather than evidence',
]

function offenders(phrase: string) {
  return FILES.filter((file) => file.text.toLowerCase().includes(phrase)).map((f) => f.path)
}

describe('claim discipline', () => {
  it.each(UNSUPPORTED_CLAIMS)('does not claim "%s"', (phrase) => {
    expect(offenders(phrase)).toEqual([])
  })

  it.each(OFF_LIMITS_NAMES)('does not name "%s"', (phrase) => {
    expect(offenders(phrase)).toEqual([])
  })

  it.each(MARKETING_FILLER)('does not reach for "%s"', (phrase) => {
    expect(offenders(phrase)).toEqual([])
  })

  it('keeps the field site anonymous', () => {
    const site = FILES.find((file) => file.path === 'lib/site.ts')!
    expect(site.text).not.toMatch(/^\s*address:/m)
    // The display name comes from the database, not from the codebase.
    const validation = FILES.find((file) => file.path === 'app/validation/page.tsx')!
    expect(validation.text).toContain('snapshot?.site.name')
  })

  it('may name UT Austin in the founder story but never as a site or client', () => {
    const mentions = FILES.filter((file) => file.text.toLowerCase().includes('ut austin'))
    expect(mentions.map((file) => file.path)).toEqual(['app/team/page.tsx'])

    // Anything tying the university to a deployment, pilot or customer.
    const forbidden = [
      /ut austin[^.]{0,40}(pilot|deployment|site|customer|client|campus deployment)/i,
      /(pilot|deployment|site|customer|client)[^.]{0,40}ut austin/i,
    ]
    for (const file of mentions) {
      for (const pattern of forbidden) {
        expect(file.text).not.toMatch(pattern)
      }
    }
  })

  it('says plainly that it does not issue citations', () => {
    const platform = FILES.find((file) => file.path === 'app/platform/page.tsx')!
    expect(platform.text).toContain('No automatic citations.')
    expect(platform.text).toContain('go to the staff who make enforcement decisions')
  })

  it('states the accuracy denominator wherever accuracy is shown', () => {
    const panel = FILES.find(
      (file) => file.path === 'app/components/field/AccuracyPanel.tsx'
    )!
    expect(panel.text).toContain('validated observations')
    expect(panel.text).toContain('No validated observations yet')
  })
})
