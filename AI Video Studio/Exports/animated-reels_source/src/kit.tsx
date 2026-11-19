// Shared look for the animated reels: palette, fonts, word-by-word captions,
// scene switching and a few drawn props. Style follows made-by-claude
// (off-white grid, bold ink captions, blue serif-italic emphasis).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, delayRender, continueRender} from 'remotion';

export const C = {
  bg: '#F6F5F1', ink: '#141414', mute: '#8E8C86', line: '#E6E3DC', blue: '#2F5BFF', blueSoft: '#DCE4FF',
  coral: '#E0663F', gold: '#E9B949', green: '#1FA45B', red: '#E5484D', sea: '#3BA7D9', sand: '#F1D9A7', leaf: '#2E8B57',
};
export const SANS = 'ReelSans';
export const SERIF = 'ReelSerif';
export const ML = 'ReelMalayalam';

if (typeof document !== 'undefined') {
  const h = delayRender('fonts');
  const faces = [
    new FontFace(SANS, `url(${staticFile('fonts/inter-latin-500-normal.woff2')})`, {weight: '500'}),
    new FontFace(SANS, `url(${staticFile('fonts/inter-latin-700-normal.woff2')})`, {weight: '700'}),
    new FontFace(SANS, `url(${staticFile('fonts/inter-latin-800-normal.woff2')})`, {weight: '800'}),
    new FontFace(SERIF, `url(${staticFile('fonts/instrument-serif-latin-400-italic.woff2')})`, {style: 'italic'}),
    new FontFace(ML, `url(${staticFile('fonts/noto-sans-malayalam-malayalam-700-normal.woff2')})`, {weight: '700'}),
  ];
  Promise.all(faces.map((f) => f.load().then((ff) => (document as any).fonts.add(ff))))
    .then(() => continueRender(h))
    .catch((e) => { console.error(e); continueRender(h); });
}

export type Word = {w: string; s: number; e: number; line: number};
export type Timing = {words: Word[]; lineStarts: number[]; end: number; lines: string[]};

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = Easing.bezier(0.16, 1, 0.3, 1);

/** seconds since composition start */
export const useT = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / fps;
};

/** springy 0→1 starting at time `at` (seconds) */
export const pop = (t: number, at: number, fps = 30, damping = 13) =>
  spring({frame: Math.max(0, (t - at) * fps), fps, config: {damping, stiffness: 170, mass: 0.7}});

export const lin = (t: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(t, [a, b], [from, to], {...clamp, easing: ease});

/** Off-white canvas with a faint grid */
export const Canvas: React.FC<{children?: React.ReactNode; tint?: string}> = ({children, tint = C.bg}) => (
  <AbsoluteFill style={{backgroundColor: tint}}>
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${C.line} 2px, transparent 2px), linear-gradient(90deg, ${C.line} 2px, transparent 2px)`,
        backgroundSize: '90px 90px',
        opacity: 0.55,
      }}
    />
    {children}
  </AbsoluteFill>
);

/** Shows `children` for line `from` (through line `to`): pops in at the line start, fades as the next line begins. */
export const Scene: React.FC<{timing: Timing; from: number; to?: number; children: (local: number) => React.ReactNode}> = ({timing, from, to, children}) => {
  const t = useT();
  const start = timing.lineStarts[from] - 0.12;
  const endLine = (to ?? from) + 1;
  const end = endLine < timing.lineStarts.length ? timing.lineStarts[endLine] - 0.12 : timing.end + 1;
  if (t < start - 0.05 || t > end + 0.25) return null;
  const inK = pop(t, start, 30, 15);
  const out = lin(t, end, end + 0.22);
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(1, inK * 1.4) * (1 - out),
        scale: String(interpolate(inK, [0, 1], [0.94, 1]) * interpolate(out, [0, 1], [1, 1.04])),
        translate: `0px ${interpolate(inK, [0, 1], [40, 0])}px`,
      }}
    >
      {children(t - timing.lineStarts[from])}
    </AbsoluteFill>
  );
};

/** Word-by-word kinetic captions for the current line. Key words in blue serif italic. */
export const Captions: React.FC<{timing: Timing; emphasis: string[]; y?: number}> = ({timing, emphasis, y = 1265}) => {
  const t = useT();
  const cur = timing.words.filter((w) => w.s - 0.05 <= t).pop();
  if (!cur) return null;
  const lineWords = timing.words.filter((w) => w.line === cur.line);
  const lineEnd = lineWords[lineWords.length - 1].e;
  if (t > lineEnd + 0.6) return null;
  const clean = (w: string) => w.toLowerCase().replace(/[^a-z']/g, '');
  return (
    <div style={{position: 'absolute', left: 90, right: 90, top: y, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 18px'}}>
      {lineWords.map((w, i) => {
        const k = pop(t, w.s - 0.04, 30, 14);
        const on = t >= w.s - 0.04;
        const em = emphasis.includes(clean(w.w));
        return (
          <span
            key={i}
            style={{
              fontFamily: em ? SERIF : SANS,
              fontStyle: em ? 'italic' : 'normal',
              fontWeight: em ? 400 : 800,
              fontSize: em ? 82 : 66,
              lineHeight: 1.1,
              color: em ? C.blue : C.ink,
              opacity: on ? 1 : 0.16,
              translate: `0px ${interpolate(k, [0, 1], [18, 0])}px`,
              letterSpacing: em ? 0 : -1.5,
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

/** Small label pill above the illustration */
export const Pill: React.FC<{text: string; color?: string; t: number; at?: number; top?: number}> = ({text, color = C.ink, t, at = 0, top = 300}) => {
  const k = pop(t, at);
  return (
    <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          fontFamily: SANS, fontWeight: 800, fontSize: 44, letterSpacing: 3, color: '#fff', background: color,
          padding: '16px 34px', borderRadius: 999, scale: String(interpolate(k, [0, 1], [0.6, 1])), opacity: k,
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const Centre: React.FC<{children: React.ReactNode; top?: number; height?: number}> = ({children, top = 400, height = 820}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, height, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
);

/** Thick hand-drawn style tick */
export const Tick: React.FC<{size: number; k: number; color?: string}> = ({size, k, color = C.green}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M18 54 L42 76 L84 26" fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
  </svg>
);

export const Cross: React.FC<{size: number; k: number; color?: string}> = ({size, k, color = C.red}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M24 24 L76 76" stroke={color} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, k * 2)} />
    <path d="M76 24 L24 76" stroke={color} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, k * 2 - 1)} />
  </svg>
);

/** Simple person: head + body. `kid` adds a cap. */
export const Person: React.FC<{x: number; y: number; scale?: number; color?: string; kid?: boolean; bob?: number}> = ({x, y, scale = 1, color = C.ink, kid, bob = 0}) => (
  <g transform={`translate(${x} ${y + bob}) scale(${scale})`}>
    <rect x={-42} y={-20} width={84} height={120} rx={40} fill={color} />
    <circle cx={0} cy={-62} r={38} fill="#C98B5E" />
    {kid ? <path d="M-40 -74 Q0 -122 40 -74 L52 -70 L-40 -70 Z" fill={C.coral} /> : <path d="M-38 -70 Q-30 -106 0 -104 Q32 -106 38 -70 Q20 -86 -38 -70Z" fill="#2A1C14" />}
    <circle cx={-13} cy={-62} r={4.5} fill={C.ink} />
    <circle cx={13} cy={-62} r={4.5} fill={C.ink} />
    <path d="M-12 -44 Q0 -36 12 -44" stroke={C.ink} strokeWidth={4} fill="none" strokeLinecap="round" />
  </g>
);

/** Speech bubble */
export const Bubble: React.FC<{k: number; children: React.ReactNode; color?: string; ink?: string; tail?: 'left' | 'right'; style?: React.CSSProperties}> = ({k, children, color = '#fff', ink = C.ink, tail = 'left', style}) => (
  <div
    style={{
      position: 'relative', background: color, color: ink, borderRadius: 44, padding: '30px 44px', border: `5px solid ${C.ink}`,
      fontFamily: SANS, fontWeight: 800, fontSize: 64, boxShadow: `0 10px 0 ${C.ink}`,
      scale: String(interpolate(k, [0, 1], [0.3, 1])), opacity: Math.min(1, k * 1.5), transformOrigin: tail === 'left' ? '10% 100%' : '90% 100%', ...style,
    }}
  >
    {children}
    <div
      style={{
        position: 'absolute', bottom: -34, [tail === 'left' ? 'left' : 'right']: 60, width: 0, height: 0,
        borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: `36px solid ${C.ink}`,
      } as React.CSSProperties}
    />
  </div>
);

export const Footer: React.FC = () => (
  <div style={{position: 'absolute', top: 236, left: 0, right: 0, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 28, color: C.mute, letterSpacing: 1}}>
    @bigishbalan
  </div>
);
