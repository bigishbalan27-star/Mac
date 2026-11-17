import React from 'react';
import {AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, Easing, delayRender, continueRender} from 'remotion';
import WORDS from './words.json';

const SANS = 'ReelSans';
const SERIF = 'ReelSerif';
const MONO = 'ReelMono';
if (typeof document !== 'undefined') {
  const h = delayRender('fonts');
  const faces = [
    new FontFace(SANS, `url(${staticFile('fonts/Inter-500-normal.woff2')})`, {weight: '100 900'}),
    new FontFace(SERIF, `url(${staticFile('fonts/InstrumentSerif-400-italic.woff2')})`, {style: 'italic', weight: '400'}),
    new FontFace(MONO, `url(${staticFile('fonts/JetBrainsMono-500-normal.woff2')})`, {weight: '100 800'}),
  ];
  Promise.all(faces.map((f) => f.load().then((ff) => (document as any).fonts.add(ff)))).then(() => continueRender(h)).catch((e) => { console.error(e); continueRender(h); });
}

export const FPS = 30;
export const TOTAL_FRAMES = Math.round(41.2 * FPS);

// ---------- palette ----------
const BG = '#F6F5F1';
const INK = '#141414';
const MUTE = '#8E8C86';
const LINE = '#E6E3DC';
const BLUE = '#2F5BFF';
const BLUE_SOFT = '#DCE4FF';
const CORAL = '#E0663F';
const GOLD = '#E9B949';
const GREEN = '#1FA45B';
const RED = '#E5484D';
const NIGHT = '#0E0E10';

type W = {w: string; s: number; e: number};
const words = WORDS as W[];

// ---------- helpers ----------
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const sp = (t: number, at: number, cfg: Partial<{damping: number; stiffness: number; mass: number}> = {}) =>
  spring({frame: Math.max(0, (t - at) * FPS), fps: FPS, config: {damping: 14, stiffness: 180, mass: 0.7, ...cfg}});
const lin = (t: number, a: number, b: number, from = 0, to = 1, ease = Easing.out(Easing.cubic)) =>
  interpolate(t, [a, b], [from, to], {...clamp, easing: ease});
const typed = (text: string, t: number, t0: number, t1: number) => {
  const n = Math.floor(interpolate(t, [t0, t1], [0, text.length], clamp));
  return text.slice(0, n);
};
const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * k)).join(',')})`;
};

// ---------- shared drawings ----------
const Asterisk: React.FC<{size: number; color?: string; rot?: number; style?: React.CSSProperties}> = ({size, color = CORAL, rot = 0, style}) => {
  const rays = 12;
  const lens = [1, 0.78, 0.94, 0.72, 1, 0.84, 0.92, 0.74, 0.98, 0.8, 0.9, 0.76];
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" style={{transform: `rotate(${rot}deg)`, overflow: 'visible', ...style}}>
      {Array.from({length: rays}).map((_, i) => {
        const a = (i / rays) * Math.PI * 2;
        const L = 44 * lens[i];
        return <line key={i} x1={Math.cos(a) * 9} y1={Math.sin(a) * 9} x2={Math.cos(a) * L} y2={Math.sin(a) * L} stroke={color} strokeWidth={9} strokeLinecap="round" />;
      })}
    </svg>
  );
};

const Card: React.FC<{style?: React.CSSProperties; children?: React.ReactNode; dark?: boolean}> = ({style, children, dark}) => (
  <div
    style={{
      position: 'absolute',
      background: dark ? '#1A1A1E' : '#FFFFFF',
      border: `2px solid ${dark ? '#2C2C33' : LINE}`,
      borderRadius: 28,
      boxShadow: dark ? '0 30px 60px rgba(0,0,0,0.45)' : '0 24px 50px rgba(20,20,20,0.08), 0 2px 6px rgba(20,20,20,0.05)',
      ...style,
    }}
  >
    {children}
  </div>
);

const Pill: React.FC<{children: React.ReactNode; bg?: string; color?: string; style?: React.CSSProperties}> = ({children, bg = BLUE, color = '#fff', style}) => (
  <div style={{position: 'absolute', background: bg, color, fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 2, padding: '10px 20px', borderRadius: 999, whiteSpace: 'nowrap', ...style}}>
    {children}
  </div>
);

const Check: React.FC<{size?: number; color?: string; draw?: number}> = ({size = 44, color = GREEN, draw = 1}) => (
  <svg width={size} height={size} viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="22" fill={color} />
    <path d="M12 23 L19 30 L32 15" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={40} strokeDashoffset={40 * (1 - draw)} />
  </svg>
);

const Wave: React.FC<{t: number; width: number; height: number; bars?: number; color?: string; from?: number; seed?: number}> = ({t, width, height, bars = 48, color = BLUE, from = 0, seed = 1}) => {
  const bw = width / bars;
  return (
    <svg width={width} height={height}>
      {Array.from({length: bars}).map((_, i) => {
        const base = 0.25 + 0.75 * Math.abs(Math.sin(i * 1.7 * seed + 0.6) * Math.cos(i * 0.43 + seed));
        const live = 0.85 + 0.15 * Math.sin(t * 9 + i);
        const grow = lin(t, from + i * 0.012, from + i * 0.012 + 0.25);
        const h = Math.max(6, height * base * live * grow);
        return <rect key={i} x={i * bw + bw * 0.18} y={(height - h) / 2} width={bw * 0.64} height={h} rx={bw * 0.32} fill={color} />;
      })}
    </svg>
  );
};

// mini reel thumbnails standing for the three references (abstracted, not copies)
const MiniRef: React.FC<{kind: 0 | 1 | 2; w: number; h: number}> = ({kind, w, h}) => {
  if (kind === 0)
    return (
      <div style={{width: w, height: h, background: '#FBF6EC', borderRadius: 20, overflow: 'hidden', position: 'relative'}}>
        <div style={{position: 'absolute', left: w * 0.12, top: h * 0.3, width: w * 0.76, height: h * 0.26, background: GOLD, borderRadius: 10, border: `3px solid ${INK}`, transform: 'rotate(-6deg)'}} />
        <div style={{position: 'absolute', left: w * 0.2, top: h * 0.36, width: w * 0.38, height: h * 0.05, background: INK, borderRadius: 4, transform: 'rotate(-6deg)'}} />
        <div style={{position: 'absolute', left: w * 0.2, top: h * 0.44, width: w * 0.22, height: h * 0.05, background: CORAL, borderRadius: 4, transform: 'rotate(-6deg)'}} />
        <div style={{position: 'absolute', left: w * 0.12, top: h * 0.72, width: w * 0.76, height: h * 0.08, border: `3px solid ${INK}`, borderRadius: 4, background: '#fff'}} />
      </div>
    );
  if (kind === 1)
    return (
      <div style={{width: w, height: h, background: '#FAFAF8', borderRadius: 20, overflow: 'hidden', position: 'relative'}}>
        {Array.from({length: 6}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: w * (0.12 + (i % 3) * 0.27), top: h * (0.3 + Math.floor(i / 3) * 0.2), width: w * 0.22, height: h * 0.16, border: `3px solid ${BLUE}`, borderRadius: 8, background: i === 1 ? BLUE_SOFT : '#fff'}} />
        ))}
        <Asterisk size={w * 0.2} style={{position: 'absolute', left: w * 0.4, top: h * 0.08}} />
      </div>
    );
  return (
    <div style={{width: w, height: h, background: '#F1F2F5', borderRadius: 20, overflow: 'hidden', position: 'relative'}}>
      <div style={{position: 'absolute', left: w * 0.15, top: h * 0.14, width: w * 0.7, height: h * 0.26, background: '#fff', borderRadius: 10}} />
      <div style={{position: 'absolute', left: w * 0.3, top: h * 0.55, width: w * 0.4, height: w * 0.4, background: '#C9A07D', borderRadius: '50%'}} />
      <div style={{position: 'absolute', left: w * 0.18, top: h * 0.8, width: w * 0.64, height: h * 0.3, background: '#2A2A2E', borderRadius: '40% 40% 0 0'}} />
    </div>
  );
};

// ---------- captions ----------
type Style = 'k' | 'e' | 'c' | 'm' | 's' | 'p';
const STYLE: Record<number, Style> = {
  3: 'k', 5: 'c', 7: 's', 8: 'e', 12: 'k', 13: 'e', 17: 'k', 18: 'k', 20: 'k', 24: 'e', 27: 'k', 31: 'e', 32: 'k', 34: 'k', 36: 'k', 41: 'e',
  44: 'k', 46: 'e', 48: 'k', 53: 'e', 54: 'k', 59: 'k', 62: 'e', 65: 'e', 66: 'e', 67: 'e', 71: 'k', 75: 'k', 78: 'e', 82: 'k', 83: 'e',
  86: 'k', 87: 'k', 89: 'k', 91: 'k', 95: 'm', 96: 'c', 99: 'k', 101: 'k', 103: 'e', 109: 'k', 111: 'e', 114: 'k', 117: 'k', 120: 'k',
  121: 'e', 124: 'k', 125: 'k', 126: 'k', 127: 'p', 133: 'e',
};
const PAGES: [number, number][] = [
  [0, 5], [6, 8], [9, 18], [19, 24], [25, 28], [29, 32], [33, 36], [37, 41], [42, 46], [47, 54], [55, 59], [60, 67], [68, 71], [72, 78],
  [79, 83], [84, 87], [88, 89], [90, 95], [96, 99], [100, 103], [104, 109], [110, 114], [115, 121], [122, 125], [126, 133],
];

const Captions: React.FC<{t: number; dark: number}> = ({t, dark}) => {
  let pi = 0;
  PAGES.forEach(([a], i) => {
    if (t >= words[a].s - 0.08) pi = i;
  });
  const [a, b] = PAGES[pi];
  const next = PAGES[pi + 1];
  const outK = next ? lin(t, words[next[0]].s - 0.16, words[next[0]].s - 0.04) : 0;
  const ink = mix(INK, '#FFFFFF', dark);
  const mute = mix('#7D7B76', '#9A9AA2', dark);
  return (
    <div
      style={{
        position: 'absolute', top: 268, left: 70, right: 70, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexWrap: 'wrap', alignContent: 'center', textAlign: 'center', opacity: 1 - outK, filter: `blur(${outK * 8}px)`,
      }}
    >
      {words.slice(a, b + 1).map((wd, j) => {
        const i = a + j;
        const st = STYLE[i];
        if (t < wd.s - 0.07) return null;
        const k = i === 0 ? 1 : sp(t, wd.s - 0.06, {damping: 16, stiffness: 220});
        const raw = wd.w;
        const text = st === 'p' ? 'STUDIO' : raw;
        const base: React.CSSProperties = {
          display: 'inline-block', margin: '0 10px', fontSize: 70, lineHeight: 1.18, opacity: k, transform: `translateY(${(1 - k) * 18}px)`,
          filter: `blur(${(1 - k) * 8}px)`, fontFamily: SANS, fontWeight: 500, color: mute, letterSpacing: -1, position: 'relative',
        };
        if (st === 'k') Object.assign(base, {fontWeight: 800, color: ink});
        if (st === 'e') Object.assign(base, {fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: 84, color: BLUE, letterSpacing: 0});
        if (st === 'c') Object.assign(base, {fontWeight: 800, color: CORAL});
        if (st === 'm') Object.assign(base, {fontFamily: MONO, fontWeight: 700, color: BLUE, fontSize: 60, background: mix(BLUE_SOFT, '#1D2550', dark), padding: '0 14px', borderRadius: 10});
        if (st === 'p') Object.assign(base, {fontFamily: MONO, fontWeight: 800, color: '#fff', background: BLUE, padding: '2px 18px', borderRadius: 12, fontSize: 58});
        const strike = st === 's' ? lin(t, wd.e + 0.05, wd.e + 0.35) : 0;
        return (
          <span key={i} style={base}>
            {text}
            {st === 's' && <span style={{position: 'absolute', left: -4, top: '52%', height: 7, width: `${strike * 104}%`, background: RED, borderRadius: 4}} />}
          </span>
        );
      })}
    </div>
  );
};

// ---------- chapter tracker ----------
const CHAPTERS: {label: string; a: number; b: number}[] = [
  {label: 'WATCH', a: 7.94, b: 17.6},
  {label: 'WRITE', a: 17.6, b: 20.72},
  {label: 'VOICE', a: 20.72, b: 23.84},
  {label: 'BUILD', a: 24.96, b: 32.46},
  {label: 'FIX', a: 32.46, b: 35.2},
  {label: 'SHIP', a: 35.2, b: 99},
];
const Tracker: React.FC<{t: number; dark: number}> = ({t, dark}) => {
  const show = sp(t, 7.7);
  return (
    <div style={{position: 'absolute', top: 178, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 12, opacity: show, transform: `translateY(${(1 - show) * -30}px)`}}>
      {CHAPTERS.map((c, i) => {
        const active = t >= c.a && t < c.b;
        const done = t >= c.b;
        const on = sp(t, c.a, {damping: 12});
        const bg = active ? BLUE : done ? mix('#FFFFFF', '#1C1C21', dark) : 'transparent';
        const col = active ? '#fff' : done ? mix(INK, '#fff', dark) : mix('#B4B1AA', '#55555C', dark);
        return (
          <div key={i} style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, letterSpacing: 2, padding: '9px 16px', borderRadius: 999, background: bg, color: col,
            border: `2px solid ${active ? BLUE : mix('#DDD9D0', '#2D2D34', dark)}`, transform: `scale(${active ? 1 + 0.06 * on : 1})`, display: 'flex', alignItems: 'center', gap: 8}}>
            {done && <span style={{color: GREEN}}>✓</span>}
            {c.label}
          </div>
        );
      })}
    </div>
  );
};

// ---------- scenes ----------
// each scene receives absolute time t and its own local time lt
type SP = {t: number; lt: number};
const CX = 540; // stage centre x
const CY = 470; // stage centre y (stage is 940 tall)

const S_Made: React.FC<SP> = ({t}) => {
  const phone = 0.75 + 0.25 * sp(t, 0, {damping: 13});
  const claude = sp(t, 1.12, {damping: 10, stiffness: 160});
  const glow = lin(t, 1.2, 1.6);
  return (
    <>
      <div style={{position: 'absolute', left: CX - 230, top: CY - 380, width: 460, height: 780, transform: `scale(${0.7 + 0.3 * phone}) rotate(${(1 - phone) * -8}deg)`, opacity: phone}}>
        <div style={{position: 'absolute', inset: -60, borderRadius: 120, background: `radial-gradient(closest-side, rgba(47,91,255,${0.28 * glow}), transparent)`}} />
        <div style={{position: 'absolute', inset: 0, borderRadius: 64, background: '#fff', border: `6px solid ${INK}`, boxShadow: '0 40px 80px rgba(0,0,0,0.12)'}}>
          <div style={{position: 'absolute', top: 22, left: '50%', marginLeft: -50, width: 100, height: 26, borderRadius: 20, background: INK}} />
          <div style={{position: 'absolute', top: 80, left: 36, fontFamily: MONO, fontSize: 26, fontWeight: 700, color: MUTE, letterSpacing: 3}}>REEL · 0:42</div>
          <svg width={120} height={120} viewBox="0 0 120 120" style={{position: 'absolute', left: 170, top: 310, opacity: 1 - claude}}>
            <circle cx="60" cy="60" r="58" fill={BLUE_SOFT} />
            <path d="M48 38 L86 60 L48 82 Z" fill={BLUE} />
          </svg>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{position: 'absolute', left: 36, right: 36 + i * 90, bottom: 120 - i * 34, height: 16, borderRadius: 8, background: LINE}} />
          ))}
        </div>
      </div>
      <Asterisk size={230} rot={claude * 200 + t * 20} style={{position: 'absolute', left: CX - 115 + (1 - claude) * 380, top: CY - 115 - (1 - claude) * 520, opacity: Math.min(1, claude * 2)}} />
    </>
  );
};

const S_NotEdited: React.FC<SP> = ({t}) => {
  const c1 = sp(t, 1.94);
  const strike = lin(t, 2.4, 2.7);
  const fall = lin(t, 2.86, 3.2);
  const stamp = sp(t, 2.84, {damping: 9, stiffness: 260});
  const shake = t > 2.84 && t < 3.1 ? Math.sin(t * 120) * 6 * (1 - lin(t, 2.84, 3.1)) : 0;
  return (
    <div style={{position: 'absolute', inset: 0, transform: `translateX(${shake}px)`}}>
      <Card style={{left: CX - 300, top: CY - 260 + fall * 160, width: 600, height: 300, opacity: c1 * (1 - fall * 0.75), transform: `scale(${0.85 + 0.15 * c1}) rotate(${-3 - fall * 10}deg)`, filter: `grayscale(${strike})`}}>
        <svg width={130} height={130} viewBox="0 0 100 100" style={{position: 'absolute', left: 50, top: 85}}>
          <circle cx="28" cy="72" r="15" fill="none" stroke={INK} strokeWidth="7" />
          <circle cx="72" cy="72" r="15" fill="none" stroke={INK} strokeWidth="7" />
          <path d="M38 61 L78 10 M62 61 L22 10" stroke={INK} strokeWidth="7" strokeLinecap="round" />
        </svg>
        <div style={{position: 'absolute', left: 210, top: 92, fontFamily: SANS, fontWeight: 900, fontSize: 96, letterSpacing: -3, color: INK}}>EDITED</div>
        <div style={{position: 'absolute', left: 214, top: 200, fontFamily: MONO, fontSize: 24, color: MUTE, letterSpacing: 2}}>cut · trim · export</div>
        <div style={{position: 'absolute', left: 30, top: 146, height: 12, width: 540 * strike, background: RED, borderRadius: 6, transform: 'rotate(-4deg)'}} />
      </Card>
      <div style={{position: 'absolute', left: CX - 280, top: CY - 40, width: 560, height: 280, opacity: Math.min(1, stamp * 3), transform: `scale(${2.2 - 1.2 * stamp}) rotate(${-6}deg)`}}>
        <div style={{position: 'absolute', inset: 0, background: BLUE, borderRadius: 30, boxShadow: '0 30px 60px rgba(47,91,255,0.35)'}} />
        <div style={{position: 'absolute', inset: 14, border: '4px dashed rgba(255,255,255,0.55)', borderRadius: 22}} />
        <div style={{position: 'absolute', left: 60, top: 64, fontFamily: SANS, fontWeight: 900, fontSize: 140, letterSpacing: -5, color: '#fff'}}>MADE</div>
        <Asterisk size={110} color="#fff" rot={t * 60} style={{position: 'absolute', right: 40, top: 30}} />
      </div>
    </div>
  );
};

const REF_POS = [
  {x: -300, r: -9},
  {x: 0, r: 0},
  {x: 300, r: 9},
];
const S_Refs: React.FC<SP> = ({t}) => {
  const lbl = sp(t, 3.6);
  return (
    <>
      <Pill bg={INK} style={{left: CX - 170, top: 20, opacity: lbl, transform: `translateY(${(1 - lbl) * 20}px)`}}>📁 References/</Pill>
      {REF_POS.map((p, i) => {
        const k = sp(t, 3.92 + i * 0.12, {damping: 12});
        const liked = sp(t, 4.6 + i * 0.08, {damping: 9});
        return (
          <div key={i} style={{position: 'absolute', left: CX - 140 + p.x * k, top: CY - 260 + Math.abs(p.r) * 4, width: 280, height: 500, transform: `rotate(${p.r * k}deg) scale(${0.6 + 0.4 * k})`, opacity: k,
            borderRadius: 26, background: '#fff', border: `5px solid ${INK}`, padding: 10, boxShadow: '0 30px 60px rgba(0,0,0,0.12)', zIndex: i === 1 ? 2 : 1}}>
            <MiniRef kind={i as 0 | 1 | 2} w={250} h={470} />
            <div style={{position: 'absolute', right: -24, bottom: -24, width: 76, height: 76, borderRadius: 38, background: CORAL, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${liked})`, boxShadow: '0 10px 20px rgba(224,102,63,0.4)'}}>
              <svg width="40" height="40" viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 5 6.4 5c2.1 0 3.6 1.3 4.4 2.6h2.4C14 6.3 15.5 5 17.6 5 21 5 23.1 8.4 21.6 11.8 19.5 16.4 12 21 12 21z" fill="#fff" /></svg>
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: -64, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 24, color: MUTE, letterSpacing: 3}}>REF {i + 1}</div>
          </div>
        );
      })}
    </>
  );
};

const PROMPT = 'make another one, just as good.';
const S_Prompt: React.FC<SP> = ({t}) => {
  const bar = sp(t, 5.2);
  const txt = typed(PROMPT, t, 6.08, 7.45);
  const sent = sp(t, 7.55, {damping: 10});
  const caret = Math.floor(t * 2.5) % 2 === 0 && t < 7.55;
  return (
    <>
      {REF_POS.map((p, i) => (
        <div key={i} style={{position: 'absolute', left: CX - 70 + p.x * 0.55, top: 40, width: 140, height: 250, transform: `rotate(${p.r}deg)`, borderRadius: 16, background: '#fff', border: `4px solid ${INK}`, padding: 6, opacity: 0.9}}>
          <MiniRef kind={i as 0 | 1 | 2} w={124} h={234} />
        </div>
      ))}
      <svg width={40} height={120} style={{position: 'absolute', left: CX - 20, top: 330, opacity: bar}}>
        <path d="M20 0 L20 100" stroke={MUTE} strokeWidth={4} strokeDasharray="8 10" />
        <path d="M8 90 L20 110 L32 90" fill="none" stroke={MUTE} strokeWidth={4} strokeLinecap="round" />
      </svg>
      <Card style={{left: 70, top: 480 + (1 - bar) * 40, width: 940, height: 200, opacity: bar, borderRadius: 40, border: `3px solid ${INK}`}}>
        <Asterisk size={64} rot={t * 40} style={{position: 'absolute', left: 36, top: 36}} />
        <div style={{position: 'absolute', left: 124, top: 40, fontFamily: MONO, fontSize: 22, color: MUTE, letterSpacing: 2}}>ONE LINE</div>
        <div style={{position: 'absolute', left: 124, top: 82, right: 150, fontFamily: SANS, fontWeight: 600, fontSize: 44, color: INK, letterSpacing: -0.5}}>
          {txt}
          <span style={{display: 'inline-block', width: 4, height: 46, background: BLUE, marginLeft: 4, verticalAlign: -8, opacity: caret ? 1 : 0}} />
        </div>
        <div style={{position: 'absolute', right: 34, top: 60, width: 84, height: 84, borderRadius: 42, background: t > 7.5 ? BLUE : INK, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + 0.18 * Math.sin(Math.min(1, sent) * Math.PI)})`}}>
          <svg width="40" height="40" viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </Card>
    </>
  );
};

const S_Watch: React.FC<SP> = ({t}) => {
  const eye = sp(t, 7.9, {damping: 11});
  const blink = t > 8.5 && t < 8.62 ? 0.1 : 1;
  const scan = (t - 8.1) / 0.9;
  return (
    <>
      <div style={{position: 'absolute', left: CX - 150, top: 30, width: 300, height: 300, transform: `scale(${eye})`}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 150, background: BLUE_SOFT}} />
        <svg width={300} height={300} viewBox="0 0 100 100" style={{position: 'absolute', inset: 0, transform: `scaleY(${blink})`}}>
          <path d="M14 50 Q50 18 86 50 Q50 82 14 50 Z" fill="#fff" stroke={INK} strokeWidth={4} />
          <circle cx={50 + Math.sin(t * 4) * 8} cy={50} r={13} fill={BLUE} />
          <circle cx={54 + Math.sin(t * 4) * 8} cy={45} r={4} fill="#fff" />
        </svg>
      </div>
      {REF_POS.map((p, i) => {
        const k = sp(t, 8.0 + i * 0.07);
        return (
          <div key={i} style={{position: 'absolute', left: CX - 110 + p.x * 0.85, top: 400, width: 220, height: 390, borderRadius: 22, background: '#fff', border: `4px solid ${INK}`, padding: 8, overflow: 'hidden', opacity: k, transform: `translateY(${(1 - k) * 60}px)`}}>
            <MiniRef kind={i as 0 | 1 | 2} w={196} h={366} />
            <div style={{position: 'absolute', left: 0, right: 0, top: `${((scan + i * 0.25) % 1) * 100}%`, height: 50, background: 'linear-gradient(180deg, rgba(47,91,255,0), rgba(47,91,255,0.35))', borderBottom: `4px solid ${BLUE}`}} />
          </div>
        );
      })}
    </>
  );
};

const S_Frames: React.FC<SP> = ({t}) => {
  const cols = 10, rows = 14, total = 141;
  const shown = Math.floor(interpolate(t, [9.06, 10.2], [0, total], {...clamp, easing: Easing.inOut(Easing.quad)}));
  const cw = 56, ch = 46, gap = 8;
  const W0 = cols * (cw + gap) - gap;
  const palette = ['#F3E3B8', '#DCE4FF', '#E2E4EA'];
  return (
    <>
      <div style={{position: 'absolute', left: CX - W0 / 2 - 200, top: 40, width: W0, height: rows * (ch + gap)}}>
        {Array.from({length: Math.min(shown, cols * rows)}).map((_, i) => {
          const ref = Math.floor(i / 47) % 3;
          return (
            <div key={i} style={{position: 'absolute', left: (i % cols) * (cw + gap), top: Math.floor(i / cols) * (ch + gap), width: cw, height: ch, borderRadius: 8, background: palette[ref], border: `2px solid ${ref === 1 ? BLUE : ref === 0 ? '#C9A43A' : '#B9BCC6'}`}} />
          );
        })}
      </div>
      <div style={{position: 'absolute', right: 70, top: 260, width: 300, textAlign: 'right'}}>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 170, letterSpacing: -8, color: INK, lineHeight: 1}}>{shown}</div>
        <div style={{fontFamily: MONO, fontSize: 26, color: MUTE, letterSpacing: 3, marginTop: 10}}>FRAMES PULLED</div>
        <div style={{fontFamily: MONO, fontSize: 22, color: BLUE, letterSpacing: 2, marginTop: 24}}>3 REELS · 1 FPS</div>
      </div>
    </>
  );
};

const CHIPS = ['this', 'reel', 'was', 'made'];
const S_WordCut: React.FC<SP> = ({t}) => {
  const top = sp(t, 10.56);
  const bot = sp(t, 11.44);
  return (
    <>
      <div style={{position: 'absolute', left: 90, top: 60, opacity: top, transform: `translateY(${(1 - top) * 40}px)`}}>
        <div style={{display: 'flex', gap: 14, marginBottom: 20}}>
          {CHIPS.map((c, i) => {
            const k = sp(t, 10.7 + i * 0.07, {damping: 10});
            return <div key={i} style={{fontFamily: MONO, fontSize: 30, fontWeight: 700, color: '#fff', background: INK, padding: '10px 20px', borderRadius: 12, transform: `scale(${k})`}}>{c}</div>;
          })}
        </div>
        <Wave t={t} width={900} height={170} bars={56} from={10.56} />
        <div style={{fontFamily: MONO, fontSize: 24, color: MUTE, letterSpacing: 3, marginTop: 10}}>EVERY WORD · TIMESTAMPED</div>
      </div>
      <div style={{position: 'absolute', left: 90, top: 470, width: 900, height: 200, opacity: bot, transform: `translateY(${(1 - bot) * 40}px)`}}>
        <div style={{position: 'absolute', inset: 0, background: INK, borderRadius: 18}} />
        {Array.from({length: 9}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 16 + i * 98, top: 36, width: 86, height: 128, borderRadius: 8, background: ['#F3E3B8', '#DCE4FF', '#E2E4EA'][i % 3]}} />
        ))}
        {Array.from({length: 18}).map((_, i) => (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: 14 + i * 50, top: 10, width: 20, height: 14, borderRadius: 3, background: '#3A3A40'}} />
            <div style={{position: 'absolute', left: 14 + i * 50, bottom: 10, width: 20, height: 14, borderRadius: 3, background: '#3A3A40'}} />
          </React.Fragment>
        ))}
        {[1, 2, 3, 5, 6, 8].map((c, i) => {
          const k = sp(t, 11.68 + i * 0.06, {damping: 9});
          return (
            <div key={c} style={{position: 'absolute', left: 8 + c * 98 - 3, top: -30, width: 6, height: 260, background: RED, borderRadius: 3, transform: `scaleY(${k})`, transformOrigin: 'top'}}>
              <div style={{position: 'absolute', top: -18, left: -16, width: 38, height: 38, borderRadius: 19, background: RED, color: '#fff', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>✂</div>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 0, bottom: -50, fontFamily: MONO, fontSize: 24, color: MUTE, letterSpacing: 3}}>EVERY CUT · MAPPED</div>
      </div>
    </>
  );
};

const S_Pattern: React.FC<SP> = ({t}) => {
  const head = sp(t, 12.4, {damping: 10});
  const ruler = lin(t, 12.6, 13.3);
  const lower = sp(t, 14.9);
  const X0 = 110, X1 = 970, secs = 8;
  const px = (s: number) => X0 + ((X1 - X0) * s) / secs;
  const capWords = ['captions', 'that', 'land', 'on', 'the', 'exact', 'word'];
  return (
    <>
      <div style={{position: 'absolute', left: CX - 210, top: 10, width: 420, height: 76, borderRadius: 38, background: INK, color: '#fff', fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 3,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, transform: `scale(${head})`}}>
        <Asterisk size={36} rot={t * 90} /> PATTERN FOUND
      </div>
      {/* ruler */}
      <div style={{position: 'absolute', left: X0, top: 330, width: (X1 - X0) * ruler, height: 4, background: INK, borderRadius: 2}} />
      {Array.from({length: secs + 1}).map((_, s) => (
        <React.Fragment key={s}>
          <div style={{position: 'absolute', left: px(s) - 2, top: 318, width: 4, height: 28, background: INK, opacity: lin(t, 12.6 + s * 0.06, 12.7 + s * 0.06)}} />
          <div style={{position: 'absolute', left: px(s) - 30, top: 356, width: 60, textAlign: 'center', fontFamily: MONO, fontSize: 22, color: MUTE, opacity: lin(t, 12.6 + s * 0.06, 12.7 + s * 0.06)}}>{s}s</div>
        </React.Fragment>
      ))}
      {Array.from({length: secs}).map((_, s) => {
        const k = sp(t, 13.85 + s * 0.11, {damping: 9, stiffness: 220});
        return (
          <div key={s} style={{position: 'absolute', left: px(s) + 8, top: 150 + (1 - k) * -120, width: px(1) - px(0) - 16, height: 150, borderRadius: 14, opacity: Math.min(1, k * 2),
            background: ['#F3E3B8', '#DCE4FF', '#E2E4EA', '#FFFFFF'][s % 4], border: `3px solid ${s % 4 === 1 ? BLUE : INK}`}}>
            {s % 4 === 1 && <Asterisk size={50} style={{position: 'absolute', left: 16, top: 46}} />}
            {s % 4 !== 1 && <div style={{position: 'absolute', left: 14, right: 14, top: 60, height: 14, borderRadius: 7, background: s % 4 === 0 ? GOLD : '#A8ACB8'}} />}
          </div>
        );
      })}
      <Pill bg={BLUE} style={{left: CX - 170, top: 420, transform: `scale(${sp(t, 14.5, {damping: 10})})`}}>1 PICTURE / SECOND</Pill>
      {/* captions on waveform */}
      <div style={{position: 'absolute', left: 90, top: 560, width: 900, height: 330, opacity: lower, transform: `translateY(${(1 - lower) * 50}px)`}}>
        <div style={{position: 'absolute', left: 0, top: 170}}>
          <Wave t={t} width={900} height={130} bars={60} color={BLUE} from={14.9} seed={2} />
        </div>
        {capWords.map((c, i) => {
          const at = 15.2 + i * 0.22;
          const k = sp(t, at, {damping: 11});
          const x = 10 + capWords.slice(0, i).reduce((acc, w) => acc + w.length * 15.5 + 46, 0);
          const hot = c === 'exact' && t > 16.35;
          return (
            <React.Fragment key={i}>
              <div style={{position: 'absolute', left: x + 50, top: 70, width: 3, height: 140 * k, borderLeft: `3px dashed ${hot ? BLUE : '#BDB9B0'}`}} />
              <div style={{position: 'absolute', left: x, top: 20 - (1 - k) * 60, opacity: k, fontFamily: MONO, fontWeight: 700, fontSize: 24, padding: '8px 12px', borderRadius: 10,
                background: hot ? BLUE : '#fff', color: hot ? '#fff' : INK, border: `2px solid ${hot ? BLUE : INK}`, transform: hot ? 'scale(1.15)' : undefined}}>{c}</div>
            </React.Fragment>
          );
        })}
        <div style={{position: 'absolute', right: 0, top: 0, transform: `scale(${sp(t, 16.8, {damping: 8})})`}}><Check size={64} /></div>
      </div>
    </>
  );
};

const SCRIPT_LINES = [
  'This reel was made by Claude.',
  'Not edited. Made.',
  'I gave it three reels I liked…',
  'So it watched them.',
  'And it found the pattern…',
  'Then it wrote this script.',
  'Comment STUDIO…',
];
const S_Script: React.FC<SP> = ({t}) => {
  const doc = sp(t, 17.6);
  const hook = sp(t, 19.06, {damping: 10});
  const cta = sp(t, 19.64, {damping: 10});
  return (
    <>
      <Card style={{left: 150, top: 30, width: 780, height: 820, opacity: doc, transform: `translateY(${(1 - doc) * 80}px) rotate(${(1 - doc) * 4}deg)`}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 80, borderBottom: `2px solid ${LINE}`, display: 'flex', alignItems: 'center', paddingLeft: 40, gap: 14}}>
          {[0, 1, 2].map((i) => <div key={i} style={{width: 16, height: 16, borderRadius: 8, background: LINE}} />)}
          <div style={{fontFamily: MONO, fontSize: 24, color: MUTE, marginLeft: 20, letterSpacing: 1}}>script.md</div>
        </div>
        {SCRIPT_LINES.map((l, i) => {
          const s0 = 17.85 + i * 0.22;
          const txt = typed(l, t, s0, s0 + 0.3);
          const isHook = i === 0, isCta = i === SCRIPT_LINES.length - 1;
          return (
            <div key={i} style={{position: 'absolute', left: 120, right: 40, top: 120 + i * 100, fontFamily: SANS, fontWeight: i === 0 ? 800 : 500, fontSize: 36, color: i === 0 ? INK : '#55534E',
              background: (isHook && hook > 0.5) || (isCta && cta > 0.5) ? 'rgba(47,91,255,0.08)' : 'transparent', borderRadius: 10, padding: '6px 10px'}}>
              {txt}
              {t > s0 && t < s0 + 0.34 && <span style={{display: 'inline-block', width: 3, height: 36, background: BLUE, marginLeft: 3, verticalAlign: -6}} />}
            </div>
          );
        })}
      </Card>
      <Pill bg={BLUE} style={{left: 40 + (1 - hook) * -200, top: 152, opacity: hook}}>HOOK</Pill>
      <Pill bg={CORAL} style={{left: 60 + (1 - cta) * -200, top: 752, opacity: cta}}>CTA</Pill>
      <svg width={40} height={620} style={{position: 'absolute', left: 120, top: 170, opacity: cta}}>
        <path d={`M30 10 L12 10 L12 ${10 + 590 * cta} L30 ${10 + 590 * cta}`} fill="none" stroke={BLUE} strokeWidth={4} strokeLinecap="round" />
      </svg>
    </>
  );
};

const VOICES = [
  {n: 'Bright', g: ['#2F5BFF', '#8EA6FF']},
  {n: 'Warm', g: ['#E0663F', '#F3B49C']},
  {n: 'Deep', g: ['#141414', '#6C6C72']},
];
const S_Voice: React.FC<SP> = ({t}) => {
  const pick = lin(t, 20.95, 21.2);
  const panel = 1 - lin(t, 21.4, 21.7);
  const wave = sp(t, 21.5);
  const sylls = ['syl', 'la', 'ble'];
  return (
    <>
      <div style={{position: 'absolute', left: 140, top: 40, width: 800, opacity: panel, transform: `translateY(${(1 - panel) * -60}px)`}}>
        {VOICES.map((v, i) => {
          const k = sp(t, 20.72 + i * 0.08);
          const sel = i === 0 && pick > 0.5;
          return (
            <Card key={i} style={{position: 'relative', height: 150, marginBottom: 26, opacity: k, transform: `translateX(${(1 - k) * 80}px) scale(${sel ? 1.04 : 1})`, border: `3px solid ${sel ? BLUE : LINE}`}}>
              <div style={{position: 'absolute', left: 30, top: 25, width: 100, height: 100, borderRadius: 50, background: `radial-gradient(circle at 35% 30%, ${v.g[1]}, ${v.g[0]})`, transform: `scale(${1 + 0.06 * Math.sin(t * 10 + i)})`}} />
              <div style={{position: 'absolute', left: 160, top: 34, fontFamily: SANS, fontWeight: 800, fontSize: 44, color: INK}}>{v.n}</div>
              <div style={{position: 'absolute', left: 160, top: 90, fontFamily: MONO, fontSize: 22, color: MUTE, letterSpacing: 2}}>VOICE 0{i + 1}</div>
              <div style={{position: 'absolute', right: 30, top: 50}}>{sel ? <Check size={52} color={BLUE} draw={pick} /> : <div style={{width: 48, height: 48, borderRadius: 24, border: `3px solid ${LINE}`}} />}</div>
            </Card>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 90, top: 280, width: 900, opacity: wave, transform: `translateY(${(1 - wave) * 80}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
          <div style={{width: 90, height: 90, borderRadius: 45, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="44" height="44" viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="12" rx="3" fill="#fff" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
          </div>
          <Wave t={t} width={780} height={150} bars={52} from={21.5} seed={3} />
        </div>
        <div style={{position: 'absolute', left: 114, top: 180, width: 780, height: 4, background: INK}} />
        {Array.from({length: 27}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 114 + i * 30, top: 172, width: 3, height: i % 3 === 0 ? 22 : 12, background: INK, opacity: lin(t, 21.6 + i * 0.015, 21.7 + i * 0.015)}} />
        ))}
        {['timed', 'every', 'caption'].map((w, i) => {
          const k = sp(t, 21.68 + i * 0.32, {damping: 11});
          return <div key={w} style={{position: 'absolute', left: 130 + i * 190, top: 240, fontFamily: MONO, fontWeight: 700, fontSize: 30, background: '#fff', border: `2px solid ${INK}`, color: INK, padding: '8px 16px', borderRadius: 10, opacity: k, transform: `translateY(${(1 - k) * 40}px)`}}>{w}</div>;
        })}
        {sylls.map((s, i) => {
          const k = sp(t, 23.0 + i * 0.1, {damping: 9});
          return <div key={s} style={{position: 'absolute', left: 520 + i * 125, top: 360, fontFamily: MONO, fontWeight: 800, fontSize: 40, background: BLUE, color: '#fff', padding: '10px 20px', borderRadius: 12, opacity: k, transform: `scale(${k}) translateY(${(1 - k) * 40}px)`}}>{s}</div>;
        })}
        <div style={{position: 'absolute', left: 520, top: 340, width: 360, opacity: lin(t, 23.0, 23.3), fontFamily: MONO, fontSize: 20, color: MUTE, letterSpacing: 2, transform: 'translateY(110px)'}}>SYLLABLE-LEVEL SYNC</div>
      </div>
    </>
  );
};

const S_Best: React.FC<SP> = ({t}) => {
  const k = sp(t, 23.84, {damping: 8, stiffness: 120});
  const ring = lin(t, 24.2, 24.9);
  return (
    <>
      <div style={{position: 'absolute', left: CX - 360, top: CY - 360, width: 720, height: 720, borderRadius: 360, background: `radial-gradient(closest-side, rgba(224,102,63,0.45), transparent)`, transform: `scale(${0.4 + 0.8 * k})`}} />
      <div style={{position: 'absolute', left: CX - 260, top: CY - 260, width: 520, height: 520, borderRadius: 260, border: `3px solid rgba(255,255,255,${0.5 * (1 - ring)})`, transform: `scale(${0.6 + ring * 0.9})`}} />
      <Asterisk size={340} rot={k * 180 + t * 30} style={{position: 'absolute', left: CX - 170, top: CY - 170, transform: `scale(${k})`}} />
    </>
  );
};

const S_NoApp: React.FC<SP> = ({t}) => {
  const app = sp(t, 24.96, {damping: 11});
  const x = lin(t, 25.6, 25.85);
  const tl = sp(t, 26.1);
  const tlx = lin(t, 26.3, 26.55);
  return (
    <>
      <div style={{position: 'absolute', left: CX - 170, top: 40, width: 340, height: 340, transform: `scale(${app}) rotate(${(1 - app) * 20}deg)`}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 80, background: 'linear-gradient(160deg, #3A3A44, #1E1E24)', border: '3px solid #44444E', opacity: 1 - 0.5 * x}}>
          {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 60, right: 60 + i * 50, top: 110 + i * 50, height: 26, borderRadius: 13, background: ['#2F5BFF', '#E0663F', '#E9B949'][i]}} />)}
          <div style={{position: 'absolute', left: 150, top: 80, width: 6, height: 190, background: '#fff', borderRadius: 3}} />
        </div>
        <svg width={340} height={340} style={{position: 'absolute', inset: 0}}>
          <path d="M40 40 L300 300" stroke={RED} strokeWidth={22} strokeLinecap="round" strokeDasharray={370} strokeDashoffset={370 * (1 - x)} />
          <path d="M300 40 L40 300" stroke={RED} strokeWidth={22} strokeLinecap="round" strokeDasharray={370} strokeDashoffset={370 * (1 - Math.max(0, x * 2 - 1))} />
        </svg>
        <div style={{position: 'absolute', left: 0, right: 0, top: 370, textAlign: 'center', fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: '#8A8A93'}}>EDITING APP</div>
      </div>
      <div style={{position: 'absolute', left: 90, top: 520, width: 900, height: 300, opacity: tl * (1 - 0.6 * tlx), transform: `translateY(${(1 - tl) * 60 + tlx * 40}px) rotate(${tlx * 4}deg)`}}>
        {[0, 1, 2].map((r) => (
          <div key={r} style={{position: 'absolute', left: 0, right: 0, top: r * 90, height: 70, borderRadius: 12, background: '#1C1C21', border: '2px solid #2E2E36'}}>
            {[0, 1, 2, 3].map((c) => <div key={c} style={{position: 'absolute', left: 14 + c * 220 + r * 40, top: 12, width: 170 - r * 20, height: 46, borderRadius: 8, background: ['#2F5BFF', '#E0663F', '#E9B949'][r], opacity: 0.85}} />)}
          </div>
        ))}
        <div style={{position: 'absolute', left: 380, top: -20, width: 4, height: 300, background: '#fff'}} />
        <div style={{position: 'absolute', left: -10, right: -10, top: 126, height: 14, background: RED, borderRadius: 7, transform: `scaleX(${tlx})`, transformOrigin: 'left'}} />
        <div style={{position: 'absolute', left: 0, top: 290, fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: '#8A8A93'}}>TIMELINE</div>
      </div>
    </>
  );
};

const CODE: {txt: string; c: string; ind: number}[] = [
  {txt: 'const Scene = ({t}) => {', c: '#C8B6FF', ind: 0},
  {txt: "const pop = spring(t, 'made');", c: '#9FB4FF', ind: 1},
  {txt: '<Phone scale={pop}>', c: '#FFB59C', ind: 1},
  {txt: '<Asterisk spin={t * 40} />', c: '#FFB59C', ind: 2},
  {txt: '<Caption word="code" />', c: '#FFB59C', ind: 2},
  {txt: '</Phone>', c: '#FFB59C', ind: 1},
  {txt: '};', c: '#C8B6FF', ind: 0},
];
const S_Code: React.FC<SP> = ({t}) => {
  const win = sp(t, 26.66);
  const hl = lin(t, 28.4, 28.6);
  return (
    <>
      <Card dark style={{left: 70, top: 30, width: 940, height: 640, opacity: win, transform: `translateY(${(1 - win) * 80}px) scale(${0.92 + 0.08 * win})`}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 70, borderBottom: '2px solid #2C2C33', display: 'flex', alignItems: 'center', paddingLeft: 30, gap: 12}}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{width: 16, height: 16, borderRadius: 8, background: c}} />)}
          <div style={{fontFamily: MONO, fontSize: 24, color: '#8A8A93', marginLeft: 16}}>Reel.tsx</div>
        </div>
        {CODE.map((l, i) => {
          const s0 = 26.85 + i * 0.2;
          const txt = typed(l.txt, t, s0, s0 + 0.22);
          const isHl = i === 4;
          return (
            <div key={i} style={{position: 'absolute', left: 30, right: 30, top: 100 + i * 72, height: 60, display: 'flex', alignItems: 'center', borderRadius: 10, background: isHl ? `rgba(47,91,255,${0.35 * hl})` : 'transparent'}}>
              <div style={{width: 50, fontFamily: MONO, fontSize: 24, color: '#4A4A55', textAlign: 'right', marginRight: 26}}>{i + 1}</div>
              <div style={{fontFamily: MONO, fontSize: 32, color: l.c, paddingLeft: l.ind * 40, whiteSpace: 'pre'}}>{txt}</div>
            </div>
          );
        })}
      </Card>
      <div style={{position: 'absolute', left: CX - 260, top: 720, width: 520, height: 140, opacity: sp(t, 28.3), transform: `translateY(${(1 - sp(t, 28.3)) * 40}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22}}>
        <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 40, color: '#fff'}}>{'code'}</div>
        <svg width="70" height="30"><path d="M0 15 H60 M48 4 L62 15 L48 26" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" /></svg>
        <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 40, color: BLUE}}>{'video'}</div>
      </div>
    </>
  );
};

// draw-on icons
const ICONS: string[] = [
  'M10 50 Q50 15 90 50 Q50 85 10 50 Z M50 38 A12 12 0 1 1 49.9 38', // eye
  'M30 12 H62 L80 30 V88 H30 Z M62 12 V30 H80 M42 50 H68 M42 64 H68 M42 76 H58', // doc
  'M40 14 H60 A10 10 0 0 1 70 24 V52 A20 20 0 0 1 30 52 V24 A10 10 0 0 1 40 14 Z M20 50 A30 30 0 0 0 80 50 M50 80 V92', // mic
  'M12 30 H40 L48 40 H88 V82 H12 Z', // folder
  'M20 80 V50 M40 80 V30 M60 80 V44 M80 80 V20', // bars
  'M50 12 V88 M12 50 H88 M23 23 L77 77 M77 23 L23 77', // asterisk-ish
];
const S_Drew: React.FC<SP> = ({t}) => {
  const cardMode = lin(t, 30.75, 31.1);
  const curve = lin(t, 31.5, 31.95);
  const dot = lin(t, 31.75, 32.4, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <>
      {ICONS.map((d, i) => {
        const draw = lin(t, 29.5 + i * 0.1, 30.0 + i * 0.1, 0, 1, Easing.inOut(Easing.quad));
        const col = i % 3;
        const x = 120 + col * 290;
        const y = 20 + Math.floor(i / 3) * 290;
        const bounce = Math.sin(Math.max(0, (dot - i * 0.08)) * Math.PI) * -26 * (dot > 0 && dot < 1 ? 1 : 0);
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y + bounce, width: 250, height: 250, borderRadius: 34 * cardMode, background: `rgba(255,255,255,${cardMode})`,
            border: `3px solid rgba(20,20,20,${0.12 * cardMode})`, boxShadow: `0 20px 40px rgba(0,0,0,${0.08 * cardMode})`, transform: `rotate(${cardMode * (i % 2 ? 3 : -3)}deg)`}}>
            <svg width={250} height={250} viewBox="0 0 100 100" style={{position: 'absolute', inset: 0}}>
              <path d={d} fill="none" stroke={i === 5 ? CORAL : i % 2 ? BLUE : INK} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} transform="translate(15 15) scale(0.7)" />
            </svg>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 120, top: 620, width: 840, height: 240, opacity: curve}}>
        <svg width={840} height={240} style={{position: 'absolute', inset: 0}}>
          <path d="M20 220 C 300 220, 420 20, 820 20" fill="none" stroke={BLUE} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - curve} />
          <path d="M20 230 H 820 M20 10 V230" stroke={LINE} strokeWidth={3} />
        </svg>
        {(() => {
          // cubic bezier sample
          const u = dot;
          const bx = (1 - u) ** 3 * 20 + 3 * (1 - u) ** 2 * u * 300 + 3 * (1 - u) * u * u * 420 + u ** 3 * 820;
          const by = (1 - u) ** 3 * 220 + 3 * (1 - u) ** 2 * u * 220 + 3 * (1 - u) * u * u * 20 + u ** 3 * 20;
          return <div style={{position: 'absolute', left: bx - 20, top: by - 20, width: 40, height: 40, borderRadius: 20, background: CORAL, boxShadow: '0 0 0 10px rgba(224,102,63,0.2)', opacity: dot > 0 ? 1 : 0}} />;
        })()}
        <div style={{position: 'absolute', right: 0, bottom: -20, fontFamily: MONO, fontSize: 22, color: MUTE, letterSpacing: 3}}>EASE · SPRING · TIMING</div>
      </div>
    </>
  );
};

const S_Fix: React.FC<SP> = ({t}) => {
  const frame = sp(t, 32.46);
  const flag = sp(t, 33.25, {damping: 10});
  const fix = lin(t, 33.85, 34.25, 0, 1, Easing.inOut(Easing.cubic));
  const ok = sp(t, 34.4, {damping: 9});
  const boxCol = fix > 0.95 ? GREEN : RED;
  return (
    <>
      <div style={{position: 'absolute', left: CX - 220, top: 20, width: 440, height: 780, borderRadius: 50, background: '#fff', border: `5px solid ${INK}`, opacity: frame, transform: `scale(${0.85 + 0.15 * frame})`, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 64, background: '#F0EFEA', fontFamily: MONO, fontSize: 20, color: MUTE, display: 'flex', alignItems: 'center', paddingLeft: 24, letterSpacing: 2}}>RENDER · FRAME 0412</div>
        <div style={{position: 'absolute', left: 40, right: 40, top: 110, height: 70, borderRadius: 12, background: INK}} />
        <div style={{position: 'absolute', left: 40, top: 200 - 60 * (1 - fix), width: 360, height: 300, borderRadius: 22, background: BLUE_SOFT, border: `3px solid ${BLUE}`}}>
          <Asterisk size={120} rot={t * 30} style={{position: 'absolute', left: 120, top: 90}} />
        </div>
        {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 40, right: 40 + i * 70, top: 540 + i * 50, height: 22, borderRadius: 11, background: LINE}} />)}
      </div>
      {/* inspector box */}
      <div style={{position: 'absolute', left: CX - 196, top: 112 + 90 * fix, width: 392, height: 150 + 70 * fix, border: `5px dashed ${boxCol}`, borderRadius: 16, opacity: flag, transform: `scale(${0.8 + 0.2 * flag})`}} />
      <Pill bg={boxCol} style={{left: CX + 200, top: 120 + 90 * fix, opacity: flag, transform: `scale(${flag})`}}>{fix > 0.95 ? 'FIXED' : 'OVERLAP'}</Pill>
      <div style={{position: 'absolute', left: CX - 50, top: 830, transform: `scale(${ok})`}}><Check size={100} /></div>
    </>
  );
};

const FOLDERS = ['References', 'Approved Videos', 'Editing Style', 'Brand Kit', 'Raw', 'Exports'];
const S_Repo: React.FC<SP> = ({t}) => {
  const card = sp(t, 35.2);
  const six = sp(t, 36.2, {damping: 8});
  return (
    <>
      <Card style={{left: 110, top: 20, width: 860, height: 850, opacity: card, transform: `translateY(${(1 - card) * 80}px)`}}>
        <div style={{position: 'absolute', left: 40, top: 36, display: 'flex', alignItems: 'center', gap: 18}}>
          <svg width="52" height="52" viewBox="0 0 24 24"><path d="M5 3h11l3 3v15H5z" fill="none" stroke={INK} strokeWidth="2" strokeLinejoin="round" /><path d="M8 8h8M8 12h8M8 16h5" stroke={INK} strokeWidth="2" strokeLinecap="round" /></svg>
          <div style={{fontFamily: MONO, fontSize: 34, color: INK, fontWeight: 700}}>ai-video-studio</div>
          <div style={{fontFamily: MONO, fontSize: 20, color: MUTE, border: `2px solid ${LINE}`, borderRadius: 999, padding: '4px 14px'}}>Public</div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 120, height: 2, background: LINE}} />
        {FOLDERS.map((f, i) => {
          const k = sp(t, 35.45 + i * 0.13, {damping: 12});
          return (
            <div key={f} style={{position: 'absolute', left: 40, right: 40, top: 150 + i * 108, height: 92, borderRadius: 16, background: i === 0 ? BLUE_SOFT : '#FAF9F6', border: `2px solid ${i === 0 ? BLUE : LINE}`,
              opacity: k, transform: `translateX(${(1 - k) * 120}px)`, display: 'flex', alignItems: 'center', paddingLeft: 28, gap: 22}}>
              <svg width="50" height="40" viewBox="0 0 50 40"><path d="M2 6 H18 L23 12 H48 V38 H2 Z" fill={i === 0 ? BLUE : GOLD} /></svg>
              <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 38, color: INK}}>{f}/</div>
            </div>
          );
        })}
      </Card>
      <div style={{position: 'absolute', right: 60, top: -10, width: 150, height: 150, borderRadius: 75, background: CORAL, color: '#fff', fontFamily: SANS, fontWeight: 900, fontSize: 90,
        display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${six}) rotate(${(1 - six) * -40}deg)`, boxShadow: '0 20px 40px rgba(224,102,63,0.4)'}}>6</div>
    </>
  );
};

const S_Comment: React.FC<SP> = ({t}) => {
  const ui = sp(t, 38.25);
  const txt = typed('STUDIO', t, 38.42, 38.75);
  const sent = t > 38.85;
  const dm = sp(t, 39.2, {damping: 10});
  return (
    <>
      <Card style={{left: 90, top: 20, width: 900, height: 470, opacity: ui, transform: `translateY(${(1 - ui) * 80}px)`}}>
        <div style={{position: 'absolute', left: 40, top: 30, fontFamily: SANS, fontWeight: 800, fontSize: 34, color: INK}}>Comments</div>
        {['STUDIO', 'STUDIO 🙌', ...(sent ? ['STUDIO'] : [])].map((c, i) => {
          const k = i === 2 ? sp(t, 38.85, {damping: 11}) : 1;
          return (
            <div key={i} style={{position: 'absolute', left: 40, top: 100 + i * 82, display: 'flex', alignItems: 'center', gap: 18, opacity: (i === 2 ? 1 : 0.55) * k, transform: `translateY(${(1 - k) * 30}px)`}}>
              <div style={{width: 56, height: 56, borderRadius: 28, background: ['#C9CED9', '#E7D3B0', BLUE][i]}} />
              <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 30, color: i === 2 ? BLUE : INK}}>{c}</div>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 30, height: 90, borderRadius: 45, border: `3px solid ${BLUE}`, display: 'flex', alignItems: 'center', paddingLeft: 34}}>
          <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 40, color: BLUE}}>{sent ? '' : txt}</div>
          {!sent && <div style={{width: 4, height: 44, background: BLUE, marginLeft: 4, opacity: Math.floor(t * 3) % 2 ? 1 : 0.2}} />}
          <div style={{position: 'absolute', right: 12, top: 10, width: 64, height: 64, borderRadius: 32, background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="32" height="32" viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
      </Card>
      <div style={{position: 'absolute', left: CX - 290, top: 560, width: 580, height: 270, transform: `scale(${dm})`, transformOrigin: '20% 100%'}}>
        <div style={{position: 'absolute', inset: 0, background: INK, borderRadius: '40px 40px 40px 8px', boxShadow: '0 30px 60px rgba(0,0,0,0.25)'}} />
        <div style={{position: 'absolute', left: 36, top: 30, fontFamily: MONO, fontSize: 22, color: '#8A8A93', letterSpacing: 2}}>DM · JUST NOW</div>
        <div style={{position: 'absolute', left: 36, top: 80, display: 'flex', alignItems: 'center', gap: 20}}>
          <svg width="80" height="64" viewBox="0 0 50 40"><path d="M2 6 H18 L23 12 H48 V38 H2 Z" fill={GOLD} /></svg>
          <div>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 38, color: '#fff'}}>The setup</div>
            <div style={{fontFamily: MONO, fontSize: 22, color: '#9A9AA3'}}>6 folders · 1 repo</div>
          </div>
        </div>
        <Asterisk size={70} rot={t * 50} style={{position: 'absolute', right: 30, top: 170}} />
      </div>
      {Array.from({length: 10}).map((_, i) => {
        const a = (i / 10) * Math.PI * 2 + 0.3;
        const k = lin(t, 39.55, 40.4, 0, 1, Easing.out(Easing.cubic));
        const r = 120 + 300 * k;
        return <Asterisk key={i} size={44 + (i % 3) * 14} color={[CORAL, BLUE, GOLD][i % 3]} rot={t * 120 + i * 30}
          style={{position: 'absolute', left: CX - 25 + Math.cos(a) * r, top: 690 + Math.sin(a) * r * 0.7, opacity: k > 0 ? 1 - lin(t, 40.4, 41.1) : 0, transform: `scale(${Math.min(1, k * 3)})`}} />;
      })}
      <Pill bg={GREEN} style={{left: CX + 150, top: 520, transform: `scale(${sp(t, 39.6, {damping: 9})})`}}>✓ SENT</Pill>
    </>
  );
};

const SCENES: {a: number; C: React.FC<SP>}[] = [
  {a: 0, C: S_Made},
  {a: 1.9, C: S_NotEdited},
  {a: 3.54, C: S_Refs},
  {a: 5.18, C: S_Prompt},
  {a: 7.88, C: S_Watch},
  {a: 9.0, C: S_Frames},
  {a: 10.52, C: S_WordCut},
  {a: 12.34, C: S_Pattern},
  {a: 17.56, C: S_Script},
  {a: 20.68, C: S_Voice},
  {a: 23.8, C: S_Best},
  {a: 24.92, C: S_NoApp},
  {a: 26.62, C: S_Code},
  {a: 29.36, C: S_Drew},
  {a: 32.42, C: S_Fix},
  {a: 35.16, C: S_Repo},
  {a: 38.22, C: S_Comment},
];

const Stage: React.FC<{t: number}> = ({t}) => {
  return (
    <div style={{position: 'absolute', left: 0, top: 520, width: 1080, height: 940}}>
      {SCENES.map((s, i) => {
        const b = SCENES[i + 1]?.a ?? 999;
        if (t < s.a - 0.05 || t > b + 0.25) return null;
        const inK = i === 0 ? 1 : sp(t, s.a, {damping: 18, stiffness: 200});
        const out = lin(t, b - 0.02, b + 0.2, 0, 1, Easing.in(Easing.cubic));
        return (
          <div key={i} style={{position: 'absolute', inset: 0, opacity: Math.min(1, inK * 1.4) * (1 - out), filter: `blur(${(1 - inK) * 10 + out * 14}px)`,
            transform: `scale(${0.94 + 0.06 * inK + out * 0.06}) translateY(${out * -40}px)`}}>
            <s.C t={t} lt={t - s.a} />
          </div>
        );
      })}
    </div>
  );
};

export const Reel: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const darkIn = lin(t, 23.78, 23.98, 0, 1, Easing.out(Easing.quad));
  const reveal = lin(t, 29.3, 29.62, 0, 1, Easing.inOut(Easing.cubic));
  const dark = darkIn * (1 - lin(t, 29.38, 29.5));
  const bg = BG;
  const R0 = reveal * 1250;
  const grid = dark > 0.5 && reveal < 0.5 ? 'rgba(255,255,255,0.045)' : 'rgba(20,20,20,0.045)';
  const intro = 1;
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      {darkIn > 0 && reveal < 1 && (
        <AbsoluteFill style={{background: NIGHT, opacity: darkIn,
          maskImage: `radial-gradient(circle at 50% 52%, transparent ${R0}px, black ${R0 + 2}px)`, WebkitMaskImage: `radial-gradient(circle at 50% 52%, transparent ${R0}px, black ${R0 + 2}px)`}} />
      )}
      {reveal > 0 && reveal < 1 && <div style={{position: 'absolute', left: 540 - R0, top: 1920 * 0.52 - R0, width: R0 * 2, height: R0 * 2, borderRadius: '50%', border: `6px solid ${CORAL}`}} />}
      <AbsoluteFill style={{backgroundImage: `linear-gradient(${grid} 2px, transparent 2px), linear-gradient(90deg, ${grid} 2px, transparent 2px)`, backgroundSize: '72px 72px', backgroundPosition: `${-t * 6}px ${-t * 10}px`,
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)'}} />
      <div style={{opacity: intro}}>
        <Tracker t={t} dark={dark} />
        <Captions t={t} dark={dark} />
        <Stage t={t} />
      </div>
      <div style={{position: 'absolute', bottom: 300, left: 0, right: 0, textAlign: 'center', fontFamily: MONO, fontSize: 26, fontWeight: 700, letterSpacing: 2, color: mix('#9E9B93', '#6A6A72', dark)}}>
        @bigishbalan · made with claude
      </div>
      <Audio src={staticFile('vo_b.mp3')} />
      <Audio src={staticFile('sfx.wav')} volume={0.55} />
    </AbsoluteFill>
  );
};
