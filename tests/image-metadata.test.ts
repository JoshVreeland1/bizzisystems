import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * The field site is anonymous on this website. A phone photograph carries EXIF,
 * and EXIF carries GPS, so an un-stripped image would publish the coordinates
 * of the site whose name and address were deliberately withheld.
 *
 * `npm run images:strip` removes it. This makes sure nobody forgets.
 */
function images(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) images(path, found)
    else if (['.jpg', '.jpeg', '.png'].includes(extname(entry).toLowerCase())) found.push(path)
  }
  return found
}

// Everything under public/ is served, so everything under public/ is checked.
// Unedited originals live in assets/photo-originals/ and are not deployed.
const SERVED = images('public')

describe('published images', () => {
  it('finds images to check', () => {
    expect(SERVED.length).toBeGreaterThan(4)
  })

  it.each(SERVED)('%s carries no EXIF or GPS metadata', (path) => {
    const buf = readFileSync(path)

    if (extname(path).toLowerCase() === '.png') {
      for (const chunk of ['eXIf', 'tEXt', 'iTXt', 'zTXt']) {
        expect(buf.includes(Buffer.from(chunk, 'ascii'))).toBe(false)
      }
      return
    }

    // No APP1 segment, which is where Exif/XMP live.
    let index = 2
    while (index < buf.length - 1 && buf[index] === 0xff) {
      const marker = buf[index + 1]
      if (marker === 0xda) break
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
        index += 2
        continue
      }
      expect(marker >= 0xe0 && marker <= 0xef).toBe(false)
      expect(marker).not.toBe(0xfe)
      index += 2 + buf.readUInt16BE(index + 2)
    }

    expect(buf.includes(Buffer.from('Exif', 'ascii'))).toBe(false)
    expect(buf.includes(Buffer.from('GPS', 'ascii'))).toBe(false)
  })
})
