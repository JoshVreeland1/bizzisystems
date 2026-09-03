#!/usr/bin/env node
/**
 * Removes metadata from every image under public/.
 *
 * Phone photographs carry EXIF, and EXIF carries GPS. The field site is
 * anonymous on this website — no host name, no address, no coordinates — and a
 * lat/long riding along inside a JPEG would undo all of that silently.
 *
 * This rewrites container segments only. Pixel data is copied verbatim, so it
 * is lossless and safe to re-run.
 *
 *   JPEG — drops every APPn (0xFFE0–0xFFEF) and COM segment before the scan.
 *   PNG  — keeps only the chunks needed to decode the image.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, extname } from 'node:path'

const PNG_KEEP = new Set(['IHDR', 'PLTE', 'tRNS', 'IDAT', 'IEND'])

function stripJpeg(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null
  const out = [buf.subarray(0, 2)]
  let i = 2

  while (i < buf.length - 1) {
    if (buf[i] !== 0xff) break
    const marker = buf[i + 1]

    // Start of scan: everything from here to the end is entropy-coded data.
    if (marker === 0xda) {
      out.push(buf.subarray(i))
      break
    }
    // Standalone markers carry no payload.
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      out.push(buf.subarray(i, i + 2))
      i += 2
      continue
    }

    const length = buf.readUInt16BE(i + 2)
    const isApp = marker >= 0xe0 && marker <= 0xef
    const isComment = marker === 0xfe
    if (!isApp && !isComment) out.push(buf.subarray(i, i + 2 + length))
    i += 2 + length
  }

  return Buffer.concat(out)
}

function stripPng(buf) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  if (!buf.subarray(0, 8).equals(signature)) return null

  const out = [signature]
  let i = 8
  while (i < buf.length) {
    const length = buf.readUInt32BE(i)
    const type = buf.toString('ascii', i + 4, i + 8)
    const end = i + 12 + length
    if (PNG_KEEP.has(type)) out.push(buf.subarray(i, end))
    i = end
    if (type === 'IEND') break
  }
  return Buffer.concat(out)
}

function walk(dir, found = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) walk(path, found)
    else if (['.jpg', '.jpeg', '.png'].includes(extname(entry).toLowerCase())) found.push(path)
  }
  return found
}

let changed = 0
for (const path of walk('public')) {
  const before = readFileSync(path)
  const after = extname(path).toLowerCase() === '.png' ? stripPng(before) : stripJpeg(before)
  if (!after || after.length === before.length) continue
  writeFileSync(path, after)
  changed++
  console.log(
    `stripped ${path}  ${before.length.toLocaleString()} → ${after.length.toLocaleString()} bytes`
  )
}
console.log(changed === 0 ? 'Nothing to strip.' : `\n${changed} file(s) stripped.`)
