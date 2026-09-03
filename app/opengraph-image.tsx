import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Bizzi Systems — per-space occupancy data'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// The real logo mark, inlined so the edge renderer never has to fetch it.
// Recreating the mark as a styled letter would not be the Bizzi logo.
const LOGO_MARK = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABCGVYSWZNTQAqAAAACAAHARIAAwAAAAEAAQAAARoABQAAAAEAAABiARsABQAAAAEAAABqASgAAwAAAAEAAgAAATEAAgAAADkAAAByATsAAgAAAA4AAACsh2kABAAAAAEAAAC6AAAAAAAAAGAAAAABAAAAYAAAAAFDYW52YSBkb2M9REFIQlZYQlhibUkgdXNlcj1VQUhBWGcwRzY3SSBicmFuZD1CQUhBWG5ZYlFPUQAASm9zaCBWcmVlbGFuZAAABpAAAAcAAAAEMDIxMJEBAAcAAAAEAQIDAKAAAAcAAAAEMDEwMKABAAMAAAABAAEAAKACAAQAAAABAAAASKADAAQAAAABAAAASAAAAABhZDlGAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAGN2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4yNTY8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpFeGlmVmVyc2lvbj4wMjEwPC9leGlmOkV4aWZWZXJzaW9uPgogICAgICAgICA8ZXhpZjpGbGFzaFBpeFZlcnNpb24+MDEwMDwvZXhpZjpGbGFzaFBpeFZlcnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4yNTY8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpDb21wb25lbnRzQ29uZmlndXJhdGlvbj4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGk+MTwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpPjI8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaT4zPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGk+MDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwvZXhpZjpDb21wb25lbnRzQ29uZmlndXJhdGlvbj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5DYW52YSBkb2M9REFIQlZYQlhibUkgdXNlcj1VQUhBWGcwRzY3SSBicmFuZD1CQUhBWG5ZYlFPUTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj45NjwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+OTY8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDxkYzp0aXRsZT4KICAgICAgICAgICAgPHJkZjpBbHQ+CiAgICAgICAgICAgICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+VW50aXRsZWQgZGVzaWduIC0gMTwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpBbHQ+CiAgICAgICAgIDwvZGM6dGl0bGU+CiAgICAgICAgIDxkYzpjcmVhdG9yPgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaT5Kb3NoIFZyZWVsYW5kPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC9kYzpjcmVhdG9yPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4K57zmvwAACtJJREFUeAHtXA2MVNUV/u7M7A+7W6iUVeTPtSpBQVhAa8FAaAv+lFJtLFDSNm3Syo8LVWtoS2LNJjaVNiFNZUGxFTXRYiBpLJb4U0OVP2uUsrusVVEWXHYpC661W2B/mH2333kzb3Zm9s28mffeLDPJHpidee/dd+493z3n3HPOuzPAEA0hMIRADhFQOeRty/rqNbqkTGNMALgCClWGgcuVQqXWKOWx5j8eooufz2gDJ7XC8RDwce9p/PvdHarXlmkOTw4KQNX36Sp9AXMo+dc0MJOdTuD78EAwKpmMgieSSU7pPvPsZ/z7MdscJJCvGcC+ps3qRHL7XBznDKDrV+lLCMBCdrCMgs5WQXzexIHSUUhbQFIKyBtFrRTVzrzXQAc1bB817E/dXXjpg63qfynv9XhBxuwrXbtcX15chLsp0PcRwNUimCFaYKMhbjs2waL2RcF6j3yeDvZi68En1Cdueaa6zzeAJt+jK0IhLIeB+6g54zm7kFeuSbTK1CwDR+nPNnSew1PHn1bdfvXrC0DVNXqBDmB9IIAZgwVMMgBxQO3nvKxr3Kj2Jrdxc+wJoJnLdVm4BA+RyU/pE4qiDtXNOHy7Rxw/Ta+Lr0dCvVhPs7vghblrgKbX6Cu4BP+Rzne+3z7Gi0DmvZTKBMrAXy70YeW7m9UptzxdATRltb6BE/UcBzHRCLvtOvf3BYqoTWHU06l/99BG9S83PWYNUPVqPY8dbqP2jM4Hk3ISWjHK5MJxHH1YUr9Zve3UPvl6VgARnJvpa17ga1QhgGMJSzdAVUIrQVpEkOqt85m8ZwzQtBo9mXHNy9SecYUEjgWC+CSGAUcYjt3WWKeOWeed3hlFONPUlfpSAvMcl/GCBEcklIVEfKbSePamNXq4s9SRFs4A1eoA7fhRqum0fHbImQgs46fjnt1t4LeZtJc2jiZGv7OcQdgWcynPlCvbUZ3BJTZjooaiWBwqSVKIcPReg5/lFeD1EM0k6DylESZp/nKyDbqJZQ2b1PY0zcxLaQGqXqGv0cXYz0aV2aQNFzhTN00ClsxhHxTOkdjBaebrG3cC3QzrRpQBD9zFdH9Y5Lj9P8B7J4D6ZqCV2ZaAJGC5JYm6Oa4WhgCzGx5Xben4ROfMrolWuggP0+9UZmtafdSe8aPoDWfa8bU/d7ID2PTXiPaUFgO3TAfKSxPbfsqc/W+HgK2vAi1ngBLGOW5IJpumNoGa+kvevzIdj5QKO7UGXyXSd2VrWlZnAlI21BOXEIiJxR9bfEZ+Dlg6F3jmAWDuFPs2Vlund3PSFX5QfY++MV1bW4AWL9ZBeqdf0C+EMjKRdD3k4NroS4ANPwa+NBHodRvJi18LotRQ+Fm6IdoCdKQSc+kUv5KtaaXryO9rFfRP65YC8i5O3A2JfFSCRVNr9IxU99sCxIBwBc3LgxtM1Z2/5yeNA+bR1FxrEYdDLSohSHenGtkAgKau1lfSrG5z63tSdZSr8zdfl0GskqZzMyvQuHPKvfoyu2YDAFIGFgZCGJGPvsdOgPGVkfjJpZWZMRe1aHSwDwvs+CcBxBxd4Zt2DfP1HOvfYCiSWbyVSohINGgrdwJA0+7HGAI0s1DMS+Q9x+qzRN0SibslMwjW+LI8iUnmkQCQCqOaHY0sFPMSYY63Z5fSJAMgxyZACmO5ck9Ovp4AEJfLG83aSXKrPD7e00QT82F89EMBOpgBy30Cb2rplELSnn+8DxxgIbUoTcKUDXb0Zdcnt48BNK9WSzdXSphfCCSm9fA2xkAe/Y8lq8hNC7qGBpfgzWIAnTkBKSJdyvpt3tPuBmaYdcAxglTkVzhLgIjMZbPu5yaKOIopZ2kFKrgaVOSbAsnMSl3pk06WO44CO9+iWfFhs9SbrPpRnDzuP0YEH957DuVk0mUxigEUDpvbT0qsCxfz3ZokAed91oFe+Sfw8kHgSFukDjSMo/RSD7KTLdpnWfcwsBrVTzGAmNXSkXuLt/rZevtkOQGJbSaNB64aA9w5C3j9MLB9D9BM05JakNXOW29xd2uEmEmQcz/FfBCX97z0zwKSmFIVM6UfzgeeXQt8b14kOByMAccAwqDv3eqfpWw+SdHswWXA6kX9dets7ndoG9Y9iCvdxcVYRcWmY+pxYJA3l1d9HbiDZic1bD/INFeF81zCzsfzi2lQdwBneeGsl5wmnvFgfK5ZyKcJDE5kRfNMEYfWWVyOc/G8YgBVjgAXUpz23/PFd+fv57GjIrVpLwWz2IgIEFey9jd/h4TNVzGAXq9lqsrcr5A0SISbda23TN4CSOTm/4/414oyzEsxgMwjjaZC0iAZszxekppQglSmMNn/IQ8GEomUCBDwdqFtTChj0GimGx4Roh8zuPuDIWkiJQLUh0OMLT4tJC0K00F7ddLmk1YDbcS4KRGeuGVeLjQ8jpN8e8csYSa3zNPjU3ws3RN5fON6hCZACgcOP6bILZESNUgclIEXC0mDJIG1NjokipbFEVWHTvpFuzuSAKKzC2AXa9KdhQCS1KN3N3orecjqRRNtDwfwWkYARXdfvWRmrnZ35NG57Xu5LtMpeMnszRKzxgtNv1dMgQfSAA0ymxjYwkI2qzD5S2+y3PrYLm/aI9LRWnqMIP6QSlJbgCaewR4C9Ea+apFUFNc+yaSJmaOXBYUPSIV2HX5UsdpkT7YA7dih+ui3fs1X2K0vynbg8aVTugXbQvyxU8CvnufmKs73Z8yYvJiWyEXt6Wb9Z709NJGzsYJZcqPGTdg9rQZ/JspLst3lIdvlOpjZNR6j0yfKjsT2soFKdmmI05RCvKxOZUyt/0sgpPZ88MPIDjPZRCXFspDt1Dr2FGsg1kG5nnHaO83hpCZu/Z3IAR8g2l8wH66lbprySib4WDcnD0YA6yNYshlLgJPHOwK+V5K4hxPXyucXs/ill9Z0/NLOAzc5yr7iB2VwbsgLOHKvgCGgyJY80Ro/wDFdhqKyaqx1AkdkTguQNGgYhSeoPduiDk1OZUyCa6avZKYu5ySZzYBjU44+bGncpOjNnMkRINQqI1iCnzCJrXcDkvMQBq+FjJ+OeV9XOX6eaa8ZT9T0Nfo6+oRXaW5j3fqjTAeVi3amUzbwIU33Vt+/iiADNr9OZOA7LLx0FNoGBxkvJ7WNQcvSbMARuZ1NTFpFqWGzkm8aLyZI7YUCUjSVaGES/i1uGucu6+woK4CENUH6O5O7OwjS0Xz3SeYX6lglZdT7Dad4JxVsWQMkjLgCvNUXxi10eLtNkDL2ZKmG4fN5jkfGxYVlZ0Dj1sN1akApNdMeXQEkzFlcauaXZhdRm37DwKs3X0xOnDEXkvOcvIeCPfj2oTolRUDX5MvcT1+l53N30SME6gZZ4S7GKifRsbw4YXtZ9ltXX6f2u0Yl7kZfABJ+5g8LBLGCvulezuKg/7AANaaZS/iG8wpPfrRR+faE2DeALNAJ1OiQ4i8w8IsinNEvSprCwVOtrBbe34WnuXSTJ1OGD6gxW/P+pymSxZ78Iz2yqAy3U4alBGcOBfL1x03I9w3i9PxZhVeoMfJUOCfkuwbZjbJ6pa4yijCXM72A12cQsAnUsApxqGayZqddMjKeF+3jx05+bOHxO6yZ89ti2JtJosl2nmlQAIofZVWtLi0/jXH81uAEZudXMX0Zy0GMZJsSASRK3QxhOxjctdKcmlnyaOkKoc1P32J1NPQ+hMAQAhcVgf8DIDdShsRvqK8AAAAASUVORK5CYII='

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0A162B',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_MARK} width={48} height={48} alt="" />
          <div style={{ color: '#fff', fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>
            Bizzi Systems
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            color: '#fff',
            fontSize: 68,
            lineHeight: 1.1,
            fontWeight: 600,
            letterSpacing: -1.5,
            maxWidth: 900,
          }}
        >
          Measure occupancy at the stall or bay.
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: '1px solid #2A3A54',
            paddingTop: 28,
          }}
        >
          <div style={{ color: '#A9B9D1', fontSize: 26, maxWidth: 720, lineHeight: 1.4 }}>
            Surface-mounted, camera-free sensors. Live status, dwell and history.
          </div>
          <div style={{ color: '#7FA5FF', fontSize: 24 }}>bizzisystems.com</div>
        </div>
      </div>
    ),
    size
  )
}
