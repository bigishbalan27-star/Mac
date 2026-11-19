import React from 'react';
import {AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, Easing, delayRender, continueRender} from 'remotion';

const SANS = 'ReelSans';
const SERIF = 'ReelSerif';
const MONO = 'ReelMono';
if (typeof document !== 'undefined') {
  const h = delayRender('fonts');
  const faces = [
    new FontFace(SANS, `url(${staticFile('fonts/Inter-500.woff2')})`, {weight: '500'}),
    new FontFace(SANS, `url(${staticFile('fonts/Inter-800.woff2')})`, {weight: '800'}),
    new FontFace(SERIF, `url(${staticFile('fonts/Serif-italic.woff2')})`, {style: 'italic', weight: '400'}),
    new FontFace(MONO, `url(${staticFile('fonts/Mono-500.woff2')})`, {weight: '500'}),
  ];
  Promise.all(faces.map((f) => f.load().then((ff) => (document as any).fonts.add(ff))))
    .then(() => continueRender(h))
    .catch((e) => { console.error(e); continueRender(h); });
}

import TIMING from './timing.json';

export const FPS = 30;
const NOM_END = 30.5; // v1 timeline that the scene animations are written against
export const END: number = TIMING.end;
export const TOTAL_FRAMES = Math.ceil(END * FPS);
// real (voiceover) time -> v1 animation time, piecewise linear between scene starts
const warp = (t: number) => {
  const A = TIMING.anchors as [number, number][];
  for (let i = 1; i < A.length; i++) {
    if (t <= A[i][0]) {
      const [n0, o0] = A[i - 1];
      const [n1, o1] = A[i];
      return o0 + ((t - n0) / Math.max(1e-6, n1 - n0)) * (o1 - o0);
    }
  }
  return NOM_END + (t - A[A.length - 1][0]);
};

// palette, same as the made-by-claude reels
const BG = '#F6F5F1';
const INK = '#141414';
const MUTE = '#8E8C86';
const LINE = '#E6E3DC';
const BLUE = '#2F5BFF';
const BLUE_SOFT = '#DCE4FF';
const CORAL = '#E0663F';
const GREEN = '#1FA45B';
const RED = '#E5484D';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const sp = (t: number, at: number, cfg: Partial<{damping: number; stiffness: number; mass: number}> = {}) =>
  spring({frame: Math.max(0, (t - at) * FPS), fps: FPS, config: {damping: 14, stiffness: 180, mass: 0.7, ...cfg}});
const lin = (t: number, a: number, b: number, from = 0, to = 1, ease = Easing.out(Easing.cubic)) =>
  interpolate(t, [a, b], [from, to], {...clamp, easing: ease});
const typed = (text: string, t: number, t0: number, t1: number) =>
  text.slice(0, Math.floor(interpolate(t, [t0, t1], [0, text.length], clamp)));

// ---------- script (voice.md: short, simple, one thought per line) ----------
// style: k = bold ink, e = blue serif italic, c = coral bold (Claude)
type Cap = {s: number; e: number; words: [string, string?][]};
const SCENES: Cap[] = [
  {s: 0.0, e: 2.8, words: [['This'], ['is'], ['how'], ['I'], ['set'], ['up'], ['Claude.', 'c']]},
  {s: 2.8, e: 5.8, words: [['It'], ['all'], ['lives'], ['in'], ['one', 'k'], ['folder', 'e'], ['on'], ['GitHub.', 'k']]},
  {s: 5.8, e: 9.2, words: [['One'], ['small', 'k'], ['file'], ['switches'], ['on'], ['the'], ['skills.', 'e']]},
  {s: 9.2, e: 12.6, words: [['A'], ['skill', 'k'], ['is'], ['just'], ['simple', 'e'], ['notes'], ['Claude', 'c'], ['can'], ['read.']]},
  {s: 12.6, e: 16.0, words: [['A'], ['map', 'k'], ['shows'], ['how'], ['every'], ['file'], ['connects.', 'e']]},
  {s: 16.0, e: 20.0, words: [['Claude', 'c'], ['writes'], ['the'], ['plan.', 'k'], ['Codex', 'k'], ['checks'], ['it.', 'e']]},
  {s: 20.0, e: 23.6, words: [['Claude', 'c'], ['builds'], ['it.', 'k'], ['Codex', 'k'], ['checks'], ['again.', 'e']]},
  {s: 23.6, e: 26.8, words: [['Every'], ['new'], ['session'], ['starts'], ['ready.', 'k'], ['Lovely.', 'e']]},
  {s: 26.8, e: NOM_END, words: [['Comment'], ['STUDIO,', 'p'], ['and'], ['I'], ['can'], ['send'], ['you'], ['the'], ['setup.', 'e']]},
];
const WORD_GAP = 0.17;
const CHAPTERS = ['FOLDER', 'SKILLS', 'MAP', 'REVIEW', 'READY'];
const chapterOf = (t: number) => (t < 5.8 ? 0 : t < 12.6 ? 1 : t < 16 ? 2 : t < 23.6 ? 3 : 4);

// ---------- shared drawings ----------
const Asterisk: React.FC<{size: number; color?: string; rot?: number}> = ({size, color = CORAL, rot = 0}) => {
  const lens = [1, 0.78, 0.94, 0.72, 1, 0.84, 0.92, 0.74, 0.98, 0.8, 0.9, 0.76];
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" style={{transform: `rotate(${rot}deg)`, overflow: 'visible'}}>
      {lens.map((l, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={Math.cos(a) * 9} y1={Math.sin(a) * 9} x2={Math.cos(a) * 44 * l} y2={Math.sin(a) * 44 * l} stroke={color} strokeWidth={9} strokeLinecap="round" />;
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
      boxShadow: dark ? '0 30px 60px rgba(0,0,0,0.35)' : '0 24px 50px rgba(20,20,20,0.08), 0 2px 6px rgba(20,20,20,0.05)',
      overflow: 'hidden',
      ...style,
    }}
  >
    {children}
  </div>
);

const Pill: React.FC<{children: React.ReactNode; bg?: string; color?: string; style?: React.CSSProperties}> = ({children, bg = BLUE, color = '#fff', style}) => (
  <div style={{position: 'absolute', background: bg, color, fontFamily: MONO, fontWeight: 500, fontSize: 30, letterSpacing: 2, padding: '12px 24px', borderRadius: 999, whiteSpace: 'nowrap', ...style}}>
    {children}
  </div>
);

const Check: React.FC<{size?: number; color?: string; draw?: number}> = ({size = 44, color = GREEN, draw = 1}) => (
  <svg width={size} height={size} viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="22" fill={color} />
    <path d="M12 23 L19 30 L32 15" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={40} strokeDashoffset={40 * (1 - draw)} />
  </svg>
);

const CardHead: React.FC<{title: string; dark?: boolean}> = ({title, dark}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '22px 30px', borderBottom: `2px solid ${dark ? '#2C2C33' : LINE}`}}>
    {[RED, '#E9B949', GREEN].map((c) => <div key={c} style={{width: 16, height: 16, borderRadius: 8, background: c}} />)}
    <div style={{marginLeft: 14, fontFamily: MONO, fontSize: 28, color: dark ? '#B9B9C2' : MUTE}}>{title}</div>
  </div>
);

// a scene's illustration enters with a spring and leaves with a quick fade/lift
const Stage: React.FC<{t: number; s: number; e: number; children: React.ReactNode}> = ({t, s, e, children}) => {
  if (t < s - 0.05 || t > e + 0.05) return null;
  const k = sp(t, s);
  const out = lin(t, e - 0.22, e, 0, 1, Easing.in(Easing.cubic));
  return (
    <AbsoluteFill style={{opacity: Math.min(k, 1 - out), transform: `translateY(${(1 - k) * 60 - out * 40}px) scale(${0.94 + 0.06 * k})`}}>
      {children}
    </AbsoluteFill>
  );
};

// ---------- scenes ----------
const S_Hook: React.FC<{t: number}> = ({t}) => (
  <>
    <div style={{position: 'absolute', left: 540 - 170, top: 360, transform: `scale(${sp(t, 0.1, {damping: 9})})`}}>
      <Asterisk size={340} rot={t * 40} />
    </div>
    <div style={{position: 'absolute', top: 790, width: 1080, textAlign: 'center', fontFamily: MONO, fontSize: 34, letterSpacing: 6, color: MUTE, opacity: lin(t, 0.6, 1.1)}}>
      MY CLAUDE SETUP
    </div>
  </>
);

const TREE: [string, number, boolean][] = [
  ['Mac/', 0, false], ['.claude/', 1, true], ['AI Video Studio/', 1, false], ['Social Media/', 1, false], ['graphify-out/', 1, false], ['plugins/', 1, false], ['CLAUDE.md', 1, false],
];
const S_Folder: React.FC<{t: number}> = ({t}) => (
  <Card style={{left: 150, top: 300, width: 780, height: 700}}>
    <CardHead title="github.com/…/Mac" />
    <div style={{padding: '26px 40px'}}>
      {TREE.map(([name, depth, hot], i) => {
        const k = sp(t, 3.15 + i * 0.22);
        const glow = hot ? lin(t, 4.6, 5.0) : 0;
        return (
          <div key={name} style={{display: 'flex', alignItems: 'center', gap: 18, height: 76, marginLeft: depth * 56, opacity: k, transform: `translateX(${(1 - k) * 40}px)`}}>
            <svg width={44} height={36} viewBox="0 0 44 36">
              <path d={name.endsWith('/') ? 'M2 6 Q2 2 6 2 H16 L20 7 H38 Q42 7 42 11 V30 Q42 34 38 34 H6 Q2 34 2 30 Z' : 'M6 2 H28 L38 12 V32 Q38 34 36 34 H6 Q4 34 4 32 V4 Q4 2 6 2 Z'}
                fill={hot ? BLUE : name.endsWith('/') ? '#E9E6DE' : '#F1EFEA'} stroke={hot ? BLUE : '#CFCAC0'} strokeWidth={2} />
            </svg>
            <div style={{fontFamily: MONO, fontSize: 38, color: hot ? BLUE : INK, background: glow ? `rgba(220,228,255,${glow})` : 'transparent', padding: '4px 12px', borderRadius: 10}}>{name}</div>
          </div>
        );
      })}
    </div>
  </Card>
);

const PLUGINS = ['ecc', 'claudex-loop', 'marketing-skills', 'remocn'];
const S_Settings: React.FC<{t: number}> = ({t}) => (
  <Card style={{left: 150, top: 330, width: 780, height: 640}}>
    <CardHead title=".claude/settings.json" />
    <div style={{padding: '34px 44px'}}>
      <div style={{fontFamily: MONO, fontSize: 30, color: MUTE, marginBottom: 22}}>"enabledPlugins"</div>
      {PLUGINS.map((p, i) => {
        const on = sp(t, 6.6 + i * 0.5, {damping: 12});
        return (
          <div key={p} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 104, borderTop: i ? `2px solid ${LINE}` : 'none'}}>
            <div style={{fontFamily: MONO, fontSize: 40, color: INK}}>{p}</div>
            <div style={{width: 120, height: 64, borderRadius: 32, background: on > 0.5 ? GREEN : '#D9D5CC', position: 'relative'}}>
              <div style={{position: 'absolute', top: 6, left: 6 + on * 56, width: 52, height: 52, borderRadius: 26, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.2)'}} />
            </div>
          </div>
        );
      })}
    </div>
  </Card>
);

const SKILL_TEXT = `---
name: claudex-loop
description: plan, review,
  build, then check.
---

# Claudex Loop
Claude plans.
Codex reviews the plan.`;
const S_Skill: React.FC<{t: number}> = ({t}) => (
  <Card style={{left: 150, top: 300, width: 780, height: 720}}>
    <CardHead title="skills/claudex-loop/SKILL.md" />
    <pre style={{margin: 0, padding: '34px 44px', fontFamily: MONO, fontSize: 36, lineHeight: 1.5, color: INK, whiteSpace: 'pre-wrap'}}>
      {typed(SKILL_TEXT, t, 9.5, 12.0).split('\n').map((l, i) => (
        <div key={i} style={{color: l.startsWith('---') ? MUTE : l.startsWith('#') ? BLUE : l.includes(':') ? CORAL : INK}}>{l || ' '}</div>
      ))}
    </pre>
  </Card>
);

// a small, fixed node map standing for the graphify graph
const NODES = Array.from({length: 26}).map((_, i) => {
  const ring = i === 0 ? 0 : i < 9 ? 1 : 2;
  const idx = i === 0 ? 0 : i < 9 ? i - 1 : i - 9;
  const n = ring === 1 ? 8 : 17;
  const a = (idx / n) * Math.PI * 2 + ring * 0.4;
  const r = ring === 0 ? 0 : ring === 1 ? 170 : 330;
  return {x: 540 + Math.cos(a) * r * 1.05, y: 650 + Math.sin(a) * r * 0.95, ring};
});
const EDGES: [number, number][] = [
  ...Array.from({length: 8}).map((_, i) => [0, i + 1] as [number, number]),
  ...Array.from({length: 17}).map((_, i) => [1 + Math.floor((i * 8) / 17), 9 + i] as [number, number]),
  [9, 13], [14, 20], [22, 25], [3, 6], [11, 18],
];
const COLORS = [BLUE, CORAL, GREEN, '#E9B949', '#8B5CF6'];
const S_Map: React.FC<{t: number}> = ({t}) => (
  <>
    <svg width={1080} height={1300} style={{position: 'absolute', top: 0}}>
      {EDGES.map(([a, b], i) => {
        const d = lin(t, 13.0 + i * 0.04, 13.5 + i * 0.04);
        const A = NODES[a], B = NODES[b];
        return <line key={i} x1={A.x} y1={A.y} x2={A.x + (B.x - A.x) * d} y2={A.y + (B.y - A.y) * d} stroke="#CFCAC0" strokeWidth={3} />;
      })}
      {NODES.map((p, i) => {
        const k = sp(t, 12.8 + p.ring * 0.35 + i * 0.02, {damping: 10});
        const r = (p.ring === 0 ? 46 : p.ring === 1 ? 26 : 16) * k;
        return <circle key={i} cx={p.x} cy={p.y} r={r} fill={p.ring === 0 ? CORAL : COLORS[i % COLORS.length]} />;
      })}
    </svg>
    <Pill bg={INK} style={{left: 540 - 165, top: 1040, opacity: lin(t, 14.4, 14.8)}}>463 nodes · graphify</Pill>
  </>
);

const Who: React.FC<{name: string; dark?: boolean; x: number; y: number; t: number; at: number; icon: React.ReactNode}> = ({name, dark, x, y, t, at, icon}) => {
  const k = sp(t, at);
  return (
    <Card dark={dark} style={{left: x, top: y, width: 380, height: 380, transform: `scale(${k})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30}}>
      {icon}
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 52, color: dark ? '#F2F2F5' : INK}}>{name}</div>
    </Card>
  );
};
const CodexIcon = () => (
  <svg width={150} height={150} viewBox="0 0 150 150">
    <rect x={10} y={10} width={130} height={130} rx={34} fill="#2C2C33" />
    <path d="M48 58 L70 75 L48 92" fill="none" stroke="#F2F2F5" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
    <line x1={80} y1={96} x2={104} y2={96} stroke="#F2F2F5" strokeWidth={10} strokeLinecap="round" />
  </svg>
);
const Arrow: React.FC<{t: number; at: number; label: string; y: number; flip?: boolean}> = ({t, at, label, y, flip}) => {
  const d = lin(t, at, at + 0.5);
  const x0 = flip ? 640 : 440, x1 = flip ? 440 : 640;
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', top: 0}}>
        <line x1={x0} y1={y} x2={x0 + (x1 - x0) * d} y2={y} stroke={BLUE} strokeWidth={8} strokeLinecap="round" />
        {d > 0.95 && <path d={flip ? `M${x1 + 22} ${y - 18} L${x1} ${y} L${x1 + 22} ${y + 18}` : `M${x1 - 22} ${y - 18} L${x1} ${y} L${x1 - 22} ${y + 18}`} fill="none" stroke={BLUE} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
      <div style={{position: 'absolute', top: y - 70, width: 1080, textAlign: 'center', fontFamily: MONO, fontSize: 28, color: BLUE, opacity: d}}>{label}</div>
    </>
  );
};
const S_Plan: React.FC<{t: number}> = ({t}) => (
  <>
    <Who name="Claude" x={40} y={420} t={t} at={16.1} icon={<Asterisk size={150} rot={t * 30} />} />
    <Who name="Codex" dark x={660} y={420} t={t} at={17.6} icon={<CodexIcon />} />
    <Arrow t={t} at={16.9} label="PLAN" y={560} />
    <Arrow t={t} at={18.4} label="REVIEW" y={700} flip />
    <Pill bg={GREEN} style={{left: 540 - 112, top: 900, transform: `scale(${sp(t, 19.0, {damping: 9})})`}}>APPROVED</Pill>
  </>
);

const DIFF: [string, string][] = [
  ['-', "W=json.load(open('public/words3.json'))"],
  ['+', 'def load_words(path):'],
  ['+', "    if path.endswith('.ts'): …"],
  ['+', "ap.add_argument('--words', …)"],
];
const S_Build: React.FC<{t: number}> = ({t}) => (
  <>
    <Card style={{left: 90, top: 340, width: 900, height: 520}}>
      <CardHead title="build_timing.py" />
      <div style={{padding: '30px 30px'}}>
        {DIFF.map(([m, l], i) => {
          const k = lin(t, 20.3 + i * 0.35, 20.6 + i * 0.35);
          return (
            <div key={i} style={{fontFamily: MONO, fontSize: 30, lineHeight: '74px', padding: '0 16px', borderRadius: 10, marginBottom: 8, opacity: k,
              background: m === '+' ? 'rgba(31,164,91,0.10)' : 'rgba(229,72,77,0.10)', color: m === '+' ? GREEN : RED, whiteSpace: 'nowrap', overflow: 'hidden'}}>
              {m} {l}
            </div>
          );
        })}
      </div>
    </Card>
    <div style={{position: 'absolute', left: 540 - 60, top: 900, transform: `scale(${sp(t, 22.2, {damping: 9})})`}}>
      <Check size={120} draw={lin(t, 22.3, 22.8)} />
    </div>
  </>
);

const READY: string[] = ['graphify', 'claudex-loop', 'codex', 'ecc'];
const S_Ready: React.FC<{t: number}> = ({t}) => (
  <Card dark style={{left: 120, top: 340, width: 840, height: 640}}>
    <CardHead dark title="new session · setup script" />
    <div style={{padding: '34px 44px'}}>
      {READY.map((r, i) => {
        const at = 24.0 + i * 0.45;
        return (
          <div key={r} style={{display: 'flex', alignItems: 'center', gap: 26, height: 108, opacity: lin(t, at, at + 0.2)}}>
            <Check size={52} draw={lin(t, at + 0.1, at + 0.4)} />
            <div style={{fontFamily: MONO, fontSize: 42, color: '#F2F2F5'}}>{typed(r, t, at, at + 0.35)}</div>
          </div>
        );
      })}
    </div>
  </Card>
);

const S_Cta: React.FC<{t: number}> = ({t}) => {
  const k = sp(t, 27.0, {damping: 10});
  return (
    <>
      <Card style={{left: 140, top: 430, width: 800, height: 300, transform: `scale(${k})`, display: 'flex', alignItems: 'center', padding: '0 40px', gap: 30}}>
        <div style={{width: 110, height: 110, borderRadius: 55, background: BLUE_SOFT, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Asterisk size={70} color={BLUE} rot={t * 20} />
        </div>
        <div>
          <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 30, color: MUTE}}>you · just now</div>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 84, color: BLUE, letterSpacing: 2}}>{typed('STUDIO', t, 27.4, 28.0)}</div>
        </div>
      </Card>
      <Pill bg={INK} style={{left: 540 - 150, top: 800, opacity: lin(t, 28.4, 28.8)}}>I'll send the setup</Pill>
    </>
  );
};

// ---------- captions ----------
// captions run on real time: each word appears when it is spoken
const Captions: React.FC<{t: number}> = ({t}) => {
  const RS = TIMING.scenes as [number, number][];
  let k = RS.findIndex(([a, b]) => t >= a && t < b);
  if (k < 0) k = RS.length - 1;
  const sc = SCENES[k];
  const [, e] = RS[k];
  const spoken = TIMING.words[k] as [string, number, number][];
  const out = lin(t, e - 0.18, e, 0, 1, Easing.in(Easing.cubic));
  return (
    <div style={{position: 'absolute', top: 1220, left: 70, width: 940, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline', columnGap: 22, rowGap: 6, opacity: k === RS.length - 1 ? 1 : 1 - out}}>
      {sc.words.map(([w, st], i) => {
        const at = spoken[i] ? spoken[i][1] - 0.04 : RS[k][0] + 0.15 + i * WORD_GAP;
        const k = sp(t, at, {damping: 12, stiffness: 220});
        const base: React.CSSProperties = {display: 'inline-block', opacity: k, transform: `translateY(${(1 - k) * 30}px)`, fontSize: 92, lineHeight: 1.12};
        if (st === 'e') return <span key={i} style={{...base, fontFamily: SERIF, fontStyle: 'italic', color: BLUE, fontSize: 104}}>{w}</span>;
        if (st === 'p') return <span key={i} style={{...base, fontFamily: SANS, fontWeight: 800, color: '#fff', background: BLUE, borderRadius: 18, padding: '0 18px'}}>{w}</span>;
        return <span key={i} style={{...base, fontFamily: SANS, fontWeight: st ? 800 : 500, color: st === 'c' ? CORAL : INK}}>{w}</span>;
      })}
    </div>
  );
};

const Chapters: React.FC<{t: number}> = ({t}) => {
  const c = chapterOf(t);
  return (
    <div style={{position: 'absolute', top: 120, width: 1080, display: 'flex', justifyContent: 'center', gap: 18, opacity: lin(t, 2.8, 3.3)}}>
      {CHAPTERS.map((n, i) => (
        <div key={n} style={{fontFamily: MONO, fontSize: 24, letterSpacing: 3, padding: '8px 16px', borderRadius: 999,
          background: i === c ? INK : 'transparent', color: i === c ? '#fff' : i < c ? INK : MUTE, border: `2px solid ${i <= c ? INK : LINE}`}}>{n}</div>
      ))}
    </div>
  );
};

export const Reel: React.FC = () => {
  const rt = useCurrentFrame() / FPS;
  const t = warp(rt);
  return (
    <AbsoluteFill style={{background: BG}}>
      <AbsoluteFill style={{backgroundImage: `linear-gradient(${LINE} 2px, transparent 2px), linear-gradient(90deg, ${LINE} 2px, transparent 2px)`, backgroundSize: '72px 72px', opacity: 0.55}} />
      <Chapters t={t} />
      <Stage t={t} s={0.0} e={2.8}><S_Hook t={t} /></Stage>
      <Stage t={t} s={2.8} e={5.8}><S_Folder t={t} /></Stage>
      <Stage t={t} s={5.8} e={9.2}><S_Settings t={t} /></Stage>
      <Stage t={t} s={9.2} e={12.6}><S_Skill t={t} /></Stage>
      <Stage t={t} s={12.6} e={16.0}><S_Map t={t} /></Stage>
      <Stage t={t} s={16.0} e={20.0}><S_Plan t={t} /></Stage>
      <Stage t={t} s={20.0} e={23.6}><S_Build t={t} /></Stage>
      <Stage t={t} s={23.6} e={26.8}><S_Ready t={t} /></Stage>
      <Stage t={t} s={26.8} e={NOM_END + 99}><S_Cta t={t} /></Stage>
      <Captions t={rt} />
      <div style={{position: 'absolute', bottom: 90, width: 1080, textAlign: 'center', fontFamily: MONO, fontSize: 28, color: MUTE, letterSpacing: 1}}>
        @bigishbalan · made with claude
      </div>
      <Audio src={staticFile('voice.wav')} />
      <Audio src={staticFile('sfx_v2.wav')} volume={0.55} />
    </AbsoluteFill>
  );
};
