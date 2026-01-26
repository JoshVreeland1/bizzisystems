// components/DemoLoop.tsx
"use client";

import React, { useEffect, useMemo, useRef } from "react";

type Stall = { x: number; y: number; w: number; h: number; faint: boolean };
type Pt = { x: number; y: number };

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function cubicBezier(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y
  };
}

function dist(a: Pt, b: Pt) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.hypot(dx, dy);
}

type Bezier = { p0: Pt; p1: Pt; p2: Pt; p3: Pt };
type LUT = {
  ts: number[];
  ss: number[]; // cumulative distance normalized 0..1
};

function buildArcLengthLUT(curve: Bezier, samples = 240): LUT {
  const ts: number[] = [];
  const ss: number[] = [];

  let prev = cubicBezier(curve.p0, curve.p1, curve.p2, curve.p3, 0);
  let acc = 0;

  ts.push(0);
  ss.push(0);

  for (let i = 1; i <= samples; i++) {
    const t = i / samples;
    const pt = cubicBezier(curve.p0, curve.p1, curve.p2, curve.p3, t);
    acc += dist(prev, pt);
    prev = pt;
    ts.push(t);
    ss.push(acc);
  }

  const total = ss[ss.length - 1] || 1;
  for (let i = 0; i < ss.length; i++) {
    ss[i] = ss[i] / total;
  }

  return { ts, ss };
}

function mapS_toT(lut: LUT, s: number): number {
  const target = clamp(s, 0, 1);

  // Binary search on ss
  let lo = 0;
  let hi = lut.ss.length - 1;

  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (lut.ss[mid] < target) lo = mid;
    else hi = mid;
  }

  const s0 = lut.ss[lo];
  const s1 = lut.ss[hi];
  const t0 = lut.ts[lo];
  const t1 = lut.ts[hi];

  const span = s1 - s0;
  if (span <= 1e-9) return t0;

  const alpha = (target - s0) / span;
  return t0 + (t1 - t0) * alpha;
}

export default function DemoLoop() {
  const styles: Record<string, React.CSSProperties> = {
    wrap: {
      border: "1px solid #eee",
      borderRadius: 18,
      overflow: "hidden",
      background: "#fff"
    },
    stage: {
      position: "relative",
      width: "100%",
      aspectRatio: "16 / 9",
      minHeight: 320
    },
    svg: { width: "100%", height: "100%", display: "block" },
    captionBar: {
      display: "flex",
      justifyContent: "space-between",
      gap: 12,
      padding: "12px 14px",
      borderTop: "1px solid #eee",
      background: "#fff",
      flexWrap: "wrap"
    },
    captionLeft: { fontSize: 13, color: "#333", lineHeight: 1.5 },
    captionRight: {
      fontSize: 12,
      color: "#666",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      fontWeight: 800
    }
  };

  const sidewalkW = 520;
  const curbW = 12;

  const stallW = 128;
  const stallH = 196;

  const stallX = sidewalkW + curbW + 42;
  const stallYs = [110, 365, 620];
  const heroIndex = 1;

  const stalls: Stall[] = stallYs.map((y, i) => ({
    x: stallX,
    y,
    w: stallW,
    h: stallH,
    faint: i !== heroIndex
  }));

  const hero = stalls[heroIndex];

  const heroFill = {
    x: hero.x + 4,
    y: hero.y + 4,
    w: hero.w - 8,
    h: hero.h - 8
  };

  const curbStrip = {
    x: sidewalkW + 2,
    y: hero.y - 10,
    w: 14,
    h: hero.h + 20
  };

  const laneDividerX = 1060;

  // Centered between lane divider and far edge of stall
  const stallOuterEdgeX = hero.x + hero.w;
  const laneX = (laneDividerX + stallOuterEdgeX) / 2;

  // Park dead center
  const park: Pt = useMemo(
    () => ({
      x: hero.x + hero.w * 0.5,
      y: hero.y + hero.h * 0.5
    }),
    [hero.x, hero.y, hero.w, hero.h]
  );

  // Timing: same speed in/out outside the stop
  const DURATION_MS = 8000;
  const tArrive = 0.40;
  const tDepart = 0.60;

  const carTranslateRef = useRef<SVGGElement | null>(null);
  const carRotateRef = useRef<SVGGElement | null>(null);
  const stallFillRef = useRef<SVGRectElement | null>(null);
  const stripGlowRef = useRef<SVGRectElement | null>(null);

  const glowBlue = "#2f6bff";

  // Curves: no pre-drift right. Inbound starts straight, then arcs into stall.
  // Outbound arcs out then straightens continuously (still one curve).
  const motion = useMemo(() => {
    const inCurve: Bezier = {
      p0: { x: laneX, y: -140 },
      // keep it straight early (p1 aligned with laneX)
      p1: { x: laneX, y: hero.y - 210 },
      // start moving toward stall (left) while continuing forward
      p2: { x: laneX - 320, y: hero.y + 10 },
      p3: { x: park.x, y: park.y }
    };

    const outCurve: Bezier = {
      p0: { x: park.x, y: park.y },
      // pull out with opposite steering while moving forward
      p1: { x: laneX - 320, y: park.y + 90 },
      // straighten into lane while still moving forward
      p2: { x: laneX, y: park.y + 260 },
      p3: { x: laneX, y: 940 }
    };

    const inLUT = buildArcLengthLUT(inCurve, 260);
    const outLUT = buildArcLengthLUT(outCurve, 260);

    return { inCurve, outCurve, inLUT, outLUT };
  }, [laneX, hero.y, park.x, park.y]);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();

    const vacant = "rgba(0, 210, 120, 0.22)";
    const occupied = "rgba(255, 60, 60, 0.22)";

    const maxTurnDeg = 38;

    function tick(now: number) {
      const elapsed = (now - start) % DURATION_MS;
      const t = elapsed / DURATION_MS; // 0..1

      let pos: Pt = { x: laneX, y: -140 };

      // Use arc-length mapping so speed is visually constant along the curve
      if (t < tArrive) {
        const s = clamp(t / tArrive, 0, 1); // distance fraction
        const u = mapS_toT(motion.inLUT, s);
        pos = cubicBezier(motion.inCurve.p0, motion.inCurve.p1, motion.inCurve.p2, motion.inCurve.p3, u);
      } else if (t < tDepart) {
        pos = { x: park.x, y: park.y };
      } else {
        const s = clamp((t - tDepart) / (1 - tDepart), 0, 1);
        const u = mapS_toT(motion.outLUT, s);
        pos = cubicBezier(motion.outCurve.p0, motion.outCurve.p1, motion.outCurve.p2, motion.outCurve.p3, u);
      }

      // Rotation: opposite steering in/out, no extra “wobble”
      // Use smooth sinusoid across each maneuver window.
      let rot = 0;
      if (t < tArrive) {
        const u = clamp(t / tArrive, 0, 1);
        rot = maxTurnDeg * Math.sin(Math.PI * u); // 0..peak..0
      } else if (t < tDepart) {
        rot = 0;
      } else {
        const u = clamp((t - tDepart) / (1 - tDepart), 0, 1);
        rot = -maxTurnDeg * Math.sin(Math.PI * u);
      }

      if (carTranslateRef.current) {
        carTranslateRef.current.setAttribute("transform", `translate(${pos.x.toFixed(2)} ${pos.y.toFixed(2)})`);
      }
      if (carRotateRef.current) {
        carRotateRef.current.setAttribute("transform", `rotate(${rot.toFixed(2)} 0 0)`);
      }

      // Stall state exact sync
      const isOccupied = t >= tArrive && t < tDepart;
      if (stallFillRef.current) {
        stallFillRef.current.setAttribute("fill", isOccupied ? occupied : vacant);
      }

      // Strip glow only, no beam
      const pulse = isOccupied ? 0.20 + 0.28 * Math.sin((elapsed / 1000) * Math.PI * 2) : 0;
      if (stripGlowRef.current) {
        stripGlowRef.current.setAttribute("opacity", isOccupied ? String(clamp(pulse, 0, 0.55)) : "0");
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [laneX, park.x, park.y, motion]);

  return (
    <div style={styles.wrap}>
      <div style={styles.stage}>
        <svg
          style={styles.svg}
          viewBox="0 0 1600 900"
          role="img"
          aria-label="Bird’s-eye demo: a vehicle approaches vertically, turns smoothly into the exact center of a curbside stall, the stall switches green to red on arrival, then the vehicle pulls out forward with opposite steering and the stall returns to green on departure."
        >
          <defs>
            <linearGradient id="asphalt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f0f10" />
              <stop offset="100%" stopColor="#141416" />
            </linearGradient>

            <linearGradient id="sidewalk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f7f7f7" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>

            <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#000" floodOpacity="0.18" />
            </filter>

            <filter id="blueGlow" x="-90%" y="-90%" width="280%" height="280%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="
                  0 0 0 0 0
                  0 0 0 0 0.35
                  0 0 0 0 1
                  0 0 0 0.9 0"
                result="blue"
              />
              <feMerge>
                <feMergeNode in="blue" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <clipPath id="clip">
              <rect x="0" y="0" width="1600" height="900" rx="18" ry="18" />
            </clipPath>
          </defs>

          <g clipPath="url(#clip)">
            <rect x="0" y="0" width="1600" height="900" fill="#ffffff" />

            {/* Sidewalk */}
            <rect x="0" y="0" width={sidewalkW} height="900" fill="url(#sidewalk)" />
            <g opacity="0.22">
              {Array.from({ length: 10 }).map((_, i) => (
                <line key={`tileH-${i}`} x1={0} y1={i * 90} x2={sidewalkW} y2={i * 90} stroke="#111" strokeWidth="1" />
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <line key={`tileV-${i}`} x1={i * 80} y1={0} x2={i * 80} y2={900} stroke="#111" strokeWidth="1" />
              ))}
            </g>

            <Storefront x={40} y={90} w={440} h={120} label="CAFE" />
            <Storefront x={40} y={250} w={440} h={140} label="MARKET" />
            <Storefront x={40} y={430} w={440} h={160} label="STUDIO" />
            <Storefront x={40} y={630} w={440} h={170} label="DELI" />

            {/* Road */}
            <rect x={sidewalkW} y="0" width={1600 - sidewalkW} height="900" fill="url(#asphalt)" />

            {/* Lane divider */}
            <g opacity="0.18">
              <line x1="1060" y1="0" x2="1060" y2="900" stroke="#fff" strokeWidth="4" strokeDasharray="18 22" />
            </g>

            {/* Curb edge */}
            <rect x={sidewalkW} y="0" width={curbW} height="900" fill="#ffffff" opacity="0.18" />

            {/* Stalls */}
            <g>
              {stalls.map((s, idx) => (
                <StallOutline key={idx} x={s.x} y={s.y} w={s.w} h={s.h} faint={s.faint} />
              ))}

              <rect
                ref={stallFillRef}
                x={heroFill.x}
                y={heroFill.y}
                width={heroFill.w}
                height={heroFill.h}
                rx="16"
                ry="16"
                fill="rgba(0, 210, 120, 0.22)"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="1"
              />
            </g>

            {/* Bizzi CurbStrip (no beam/line) */}
            <g>
              <rect
                ref={stripGlowRef}
                x={curbStrip.x}
                y={curbStrip.y}
                width={curbStrip.w}
                height={curbStrip.h}
                rx="8"
                ry="8"
                fill={glowBlue}
                opacity="0"
                filter="url(#blueGlow)"
              />
              <rect
                x={curbStrip.x}
                y={curbStrip.y}
                width={curbStrip.w}
                height={curbStrip.h}
                rx="8"
                ry="8"
                fill={glowBlue}
                opacity="0.92"
              />
            </g>

            {/* Car */}
            <g filter="url(#softShadow)">
              <g ref={carTranslateRef} transform={`translate(${laneX} -140)`}>
                <g ref={carRotateRef} transform="rotate(0 0 0)">
                  <rect x="-32" y="-70" width="64" height="140" rx="18" ry="18" fill="#ffffff" stroke="#111" strokeWidth="2" />
                  <rect x="-21" y="-44" width="42" height="88" rx="14" ry="14" fill="#f4f4f4" stroke="#111" strokeWidth="1" opacity="0.92" />
                  <circle cx="-18" cy="-54" r="5" fill="#111" opacity="0.14" />
                  <circle cx="18" cy="-54" r="5" fill="#111" opacity="0.14" />
                  <circle cx="-18" cy="54" r="5" fill="#111" opacity="0.14" />
                  <circle cx="18" cy="54" r="5" fill="#111" opacity="0.14" />
                </g>
              </g>
            </g>

            {/* Subtle vignette */}
            <rect x="0" y="0" width="1600" height="900" fill="#000" opacity="0.03" />
          </g>
        </svg>
      </div>

      <div style={styles.captionBar}>
        <div style={styles.captionLeft}>
          <b>Bizzi CurbStrip</b> detection flips the stall <b>green → red</b> on arrival and <b>red → green</b> on departure. No personal data, no vehicle identification, no individual tracking. All analytics are aggregated, anonymized, and curb-level.
        </div>
      </div>
    </div>
  );
}

function Storefront(props: { x: number; y: number; w: number; h: number; label: string }) {
  const { x, y, w, h, label } = props;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="18" ry="18" fill="#ffffff" stroke="#e9e9e9" />
      <rect x={x + 14} y={y + 14} width={w - 28} height={h - 28} rx="14" ry="14" fill="#fbfbfb" stroke="#efefef" />
      <text
        x={x + 22}
        y={y + 46}
        fontSize="18"
        fontWeight="800"
        fill="#111"
        opacity="0.25"
        style={{ letterSpacing: "0.08em" } as any}
      >
        {label}
      </text>
    </g>
  );
}

function StallOutline(props: { x: number; y: number; w: number; h: number; faint?: boolean }) {
  const { x, y, w, h, faint } = props;
  return (
    <g opacity={faint ? 0.18 : 0.62}>
      <rect x={x} y={y} width={w} height={h} rx="18" ry="18" fill="none" stroke="#ffffff" strokeWidth="2" />
      <rect x={x + 10} y={y + 10} width={w - 20} height={h - 20} rx="14" ry="14" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
    </g>
  );
}
