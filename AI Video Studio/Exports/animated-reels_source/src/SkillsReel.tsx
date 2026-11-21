// "5 Claude skills that run my video studio" — dark neon explainer with a
// lip-synced cartoon of me, in the style of the reference reel.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import timingJson from './skills_timing.json';
import mouthJson from './skills_mouth.json';
import graphJson from './skills_graph.json';
import {useT, pop, lin, Timing} from './kit';
import {Avatar, Pose, poseAngles} from './Avatar';
import {SANS} from './kit';

const T = timingJson as Timing & {display: {w: string; s: number; e: number; line: number}[]};
const M = mouthJson as {fps: number; open: number[]; round: number[]};
const G = graphJson as {nodes: [number, number, number][]; edges: [number, number][]; path: number[]; pathLabels: string[]; nodeCount: number; edgeCount: number};
export const SKILLS_SECONDS = T.end + 1.2;

const MONO = 'ReelMono';
if (typeof document !== 'undefined') {
  const f = new FontFace(MONO, `url(${staticFile('fonts/jetbrains-mono-latin-700-normal.woff2')})`, {weight: '700'});
  f.load().then((ff) => (document as any).fonts.add(ff)).catch(() => {});
}

// palette taken from the reference
const BG = '#0A0B0D';
const PANEL = '#14161A';
const EDGE = '#2A2E35';
const LIME = '#C6F432';
const LIME_DIM = '#5E7418';
const RED = '#FF4D4D';
const TXT = '#F2F3F5';
const MUTE = '#7C828C';
const glow = (c = LIME, r = 18) => `drop-shadow(0 0 ${r}px ${c}) drop-shadow(0 0 ${r / 3}px ${c})`;
const S = (x: number) => String(x);

// line indices of the spoken script
const L = {nurse: 0, five: 1, n1: 2, ecc: 3, n2: 4, map: 5, ideas: 6, path: 7, n3: 8, finds: 9, x283: 10, learn: 11, n4: 12, robot: 13, before: 14, n5: 15, code: 16, thisOne: 17, noApp: 18, comment: 19, either: 20};
const lineStart = (i: number) => T.lineStarts[i];
const lineEnd = (i: number) => (i + 1 < T.lineStarts.length ? T.lineStarts[i + 1] : T.end + 1.2);
const lineOf = (t: number) => {
  let k = 0;
  for (let i = 0; i < T.lineStarts.length; i++) if (t >= T.lineStarts[i] - 0.15) k = i;
  return k;
};

/* ---------------- background ---------------- */
const Backdrop: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 70% at 50% 30%, #15181D 0%, ${BG} 60%)`}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 70}, (_, i) => {
          const x = (i * 157.3) % 1080;
          const y = (i * 263.7 + t * (6 + (i % 5))) % 1920;
          return <circle key={i} cx={x} cy={y} r={1 + (i % 3) * 0.6} fill="#FFFFFF" opacity={0.05 + 0.05 * Math.sin(t * 1.3 + i)} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

/* ---------------- skill tree map (recurring) ---------------- */
const SKILLS = [
  {name: 'Everything Claude Code', sub: '327 skills · 72 agents', icon: 'box'},
  {name: 'Graphify', sub: 'project → knowledge graph', icon: 'graph'},
  {name: 'IG Viral', sub: 'finds outlier reels', icon: 'flame'},
  {name: 'IG Human', sub: 'strips the AI tells', icon: 'face'},
  {name: 'Remotion', sub: 'video as code', icon: 'play'},
];
const NODE = [[300, 820], [770, 690], [320, 545], [770, 405], [520, 250]];
const TERM = [540, 965];
const DECOYS = [[150, 640], [910, 860], [600, 560], [180, 330], [930, 560], [850, 250], [140, 940], [640, 900], [420, 420], [880, 120], [230, 160], [660, 130], [960, 360], [470, 700], [100, 470], [700, 320]];

const Icon: React.FC<{kind: string; c?: string; s?: number}> = ({kind, c = BG, s = 1}) => (
  <g transform={`scale(${s})`} stroke={c} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round">
    {kind === 'box' && (<><path d="M-22 -8 L0 -20 L22 -8 L22 16 L0 28 L-22 16 Z" /><path d="M-22 -8 L0 4 L22 -8 M0 4 L0 28" /></>)}
    {kind === 'graph' && (<><circle cx={-14} cy={-12} r={6} fill={c} /><circle cx={16} cy={-6} r={6} fill={c} /><circle cx={0} cy={18} r={6} fill={c} /><path d="M-14 -12 L16 -6 L0 18 Z" /></>)}
    {kind === 'flame' && <path d="M0 26 C-20 26 -22 6 -12 -6 C-10 4 -2 6 -2 -2 C-2 -14 6 -20 4 -28 C16 -18 22 -4 20 8 C18 20 10 26 0 26 Z" />}
    {kind === 'face' && (<><circle r={24} /><circle cx={-8} cy={-6} r={2.5} fill={c} /><circle cx={8} cy={-6} r={2.5} fill={c} /><path d="M-10 8 Q0 16 10 8" /></>)}
    {kind === 'play' && (<><rect x={-24} y={-18} width={48} height={36} rx={8} /><path d="M-6 -8 L10 0 L-6 8 Z" fill={c} /></>)}
    {kind === 'lock' && (<><rect x={-12} y={-4} width={24} height={20} rx={4} /><path d="M-7 -4 V-11 A7 7 0 0 1 7 -11 V-4" /></>)}
  </g>
);

const pathD = () => {
  const pts = [TERM, ...NODE];
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    d += ` C${x0} ${(y0 + y1) / 2} ${x1} ${(y0 + y1) / 2} ${x1} ${y1}`;
  }
  return d;
};

/** n = skills already unlocked; focus = skill being installed now (0-4) or -1; k = install progress 0..1 */
const SkillMap: React.FC<{l: number; n: number; focus: number; k: number; all?: boolean}> = ({l, n, focus, k, all}) => {
  const zoom = focus >= 0 ? interpolate(lin(l, 0, 0.6) - lin(l, 2.2, 2.9), [0, 1], [1, 1.12]) : 1;
  const [fx, fy] = focus >= 0 ? NODE[focus] : [540, 600];
  const lit = all ? 5 : n + (focus >= 0 && k >= 1 ? 1 : 0);
  return (
    <>
    <AbsoluteFill style={{scale: S(zoom), transformOrigin: `${fx}px ${fy}px`}}>
      <svg width={1080} height={1100} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <defs>
          <filter id="g1" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9" /></filter>
        </defs>
        {/* decoy constellation */}
        {DECOYS.map(([x, y], i) => {
          const [nx, ny] = DECOYS[(i * 7 + 3) % DECOYS.length];
          return <line key={'d' + i} x1={x} y1={y} x2={nx} y2={ny} stroke={EDGE} strokeWidth={2} strokeDasharray="4 10" opacity={0.7} />;
        })}
        {DECOYS.map(([x, y], i) => (
          <g key={'q' + i} transform={`translate(${x} ${y})`} opacity={0.55 + 0.2 * Math.sin(l * 2 + i)}>
            <circle r={20} fill={PANEL} stroke={EDGE} strokeWidth={3} />
            <text y={9} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={24} fill={MUTE}>?</text>
          </g>
        ))}
        {/* path, dashed, lit up to the unlocked node */}
        <path d={pathD()} stroke={EDGE} strokeWidth={5} fill="none" strokeDasharray="10 12" />
        <path d={pathD()} stroke={LIME} strokeWidth={6} fill="none" pathLength={5} strokeDasharray={`${Math.max(0.001, lit - 1 + (focus >= 0 && k < 1 ? k : 0) + (lit > 0 ? 1 : 0))} 99`} style={{filter: glow(LIME, 10)}} opacity={lit > 0 || k > 0 ? 1 : 0} />
        {/* start: my Claude Code terminal */}
        <g transform={`translate(${TERM[0]} ${TERM[1]})`}>
          <rect x={-34} y={-34} width={68} height={68} rx={16} fill="#1A0D0D" stroke={RED} strokeWidth={4} />
          <text x={0} y={10} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={28} fill={RED}>{'>_'}</text>
          <text x={0} y={62} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={20} fill={MUTE}>my Claude Code</text>
        </g>
        {/* the five skill nodes */}
        {NODE.map(([x, y], i) => {
          const on = i < lit;
          const inst = i === focus && !on;
          const pk = i === focus ? pop(l, 0.15, 30, 11) : 1;
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              {on && <circle r={70} fill={LIME} opacity={0.18} filter="url(#g1)" />}
              <circle r={inst ? 48 : 40} fill={on ? LIME : PANEL} stroke={on || inst ? LIME : EDGE} strokeWidth={4} style={{filter: on ? glow(LIME, 14) : undefined}} />
              {on ? <Icon kind={SKILLS[i].icon} /> : <Icon kind="lock" c={inst ? LIME : MUTE} />}
              {inst && <circle r={60} fill="none" stroke={LIME} strokeWidth={6} pathLength={1} strokeDasharray={`${k} 1`} transform="rotate(-90)" style={{filter: glow(LIME, 8)}} />}
              {(on || inst) && (
                <g transform={`translate(0 ${on ? 74 : 86}) scale(${0.6 + 0.4 * pk})`}>
                  <text textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={36} fill={TXT}>{SKILLS[i].name}</text>
                  <text y={34} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={21} fill={on ? LIME : MUTE}>{on ? `✓ ${SKILLS[i].sub}` : 'installing…'}</text>
                </g>
              )}
              <g transform="translate(-50 -50)">
                <circle r={17} fill={on ? LIME : PANEL} stroke={on ? LIME : EDGE} strokeWidth={3} />
                <text y={7} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={20} fill={on ? BG : MUTE}>{i + 1}</text>
              </g>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
      {/* counter pill (outside the zoom) */}
      <div style={{position: 'absolute', right: 44, top: 36, display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderRadius: 999, border: `2px solid ${lit ? LIME : EDGE}`, background: '#0F1206', fontFamily: MONO, fontWeight: 700, fontSize: 24, color: lit ? LIME : MUTE, filter: lit ? glow(LIME, 6) : undefined}}>
        STUDIO SKILLS {lit}/5
      </div>
    </>
  );
};

/* ---------------- generic bits ---------------- */
const Panel: React.FC<{x: number; y: number; w: number; h: number; title?: string; children?: React.ReactNode; k?: number; border?: string; style?: React.CSSProperties}> = ({x, y, w, h, title, children, k = 1, border = EDGE, style}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: PANEL, border: `2px solid ${border}`, borderRadius: 22, overflow: 'hidden', opacity: k, scale: S(interpolate(k, [0, 1], [0.92, 1])), boxShadow: '0 30px 80px rgba(0,0,0,0.6)', ...style}}>
    {title !== undefined && (
      <div style={{height: 54, display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px', borderBottom: `2px solid ${EDGE}`}}>
        {[RED, '#F5B83D', LIME].map((c) => <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />)}
        <div style={{marginLeft: 12, fontFamily: MONO, fontWeight: 700, fontSize: 22, color: MUTE}}>{title}</div>
      </div>
    )}
    {children}
  </div>
);

const Count: React.FC<{to: number; t: number; a: number; b: number; size?: number; color?: string; suffix?: string}> = ({to, t, a, b, size = 140, color = LIME, suffix = ''}) => (
  <div style={{fontFamily: SANS, fontWeight: 800, fontSize: size, color, lineHeight: 1, filter: glow(color, 16), letterSpacing: -4}}>
    {Math.round(interpolate(t, [a, b], [0, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})).toLocaleString('en-GB')}{suffix}
  </div>
);

/** shows children during [line a, line b] with a quick fade/scale in and out */
const During: React.FC<{a: number; b?: number; children: (l: number, dur: number) => React.ReactNode}> = ({a, b, children}) => {
  const t = useT();
  const s = lineStart(a) - 0.18;
  const e = lineEnd(b ?? a) - 0.12;
  if (t < s - 0.05 || t > e + 0.3) return null;
  const k = pop(t, s, 30, 16);
  const o = lin(t, e, e + 0.25);
  return (
    <AbsoluteFill style={{opacity: Math.min(1, k * 1.5) * (1 - o), scale: S(interpolate(k, [0, 1], [0.96, 1]) * interpolate(o, [0, 1], [1, 1.03]))}}>
      {children(t - lineStart(a), e - s)}
    </AbsoluteFill>
  );
};

/* ---------------- scenes ---------------- */
const ECC_SKILLS = ['tdd-workflow', 'security-review', 'api-design', 'code-review', 'deep-research', 'e2e-testing', 'git-workflow', 'docker-patterns', 'seo', 'plan', 'python-review', 'react-patterns', 'video-editing', 'market-research', 'build-fix', 'database-migrations', 'frontend-a11y', 'cost-tracking', 'brand-voice', 'content-engine', 'remotion-video-creation', 'swiftui-patterns', 'rust-testing', 'manim-video'];
const FILES = ['voice.md', 'viral-swipe.md', 'Reel5.tsx', 'Reel6.tsx', 'kit.tsx', 'sfx_gen.py', 'DESIGN.md', 'reel-edit-plans.md', 'voice_gen.py', 'captions.md', 'PRODUCT.md', 'tempo.py'];
const VIRAL = [1.2, 0.9, 1.6, 0.8, 1.1, 1.4, 0.7, 1.3, 1.0, 283, 1.5, 0.9];

const Scenes: React.FC = () => (
  <>
    {/* 0 · nurse, not a coder */}
    <During a={L.nurse}>
      {(l) => (
        <>
          <div style={{position: 'absolute', left: 90, top: 240, rotate: `${-6 + 2 * Math.sin(l * 2)}deg`, opacity: pop(l, 0), scale: S(pop(l, 0) * 1.35), transformOrigin: '0 0'}}>
            <div style={{width: 360, height: 460, background: '#F4F5F2', borderRadius: 30, padding: 30, boxShadow: '0 30px 80px rgba(0,0,0,0.6)'}}>
              <div style={{height: 26, background: '#1E3557', borderRadius: 10, marginBottom: 26}} />
              <div style={{width: 150, height: 150, borderRadius: 75, background: '#CB8D60', margin: '0 auto 24px', border: '8px solid #1E3557'}} />
              <div style={{textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 56, color: '#1E3557'}}>NURSE</div>
              <div style={{textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 26, color: '#5A6B80', marginTop: 8}}>RN · UK</div>
            </div>
          </div>
          <div style={{position: 'absolute', left: 540, top: 420, opacity: pop(l, 0.75), scale: '1.25', transformOrigin: '0 0'}}>
            <Panel x={0} y={0} w={380} h={260} title="code" k={pop(l, 0.75)}>
              <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 64, color: MUTE, textAlign: 'center', marginTop: 50}}>{'</>'}</div>
            </Panel>
            <svg width={380} height={260} style={{position: 'absolute', left: 0, top: 0}}>
              <path d="M70 60 L310 220 M310 60 L70 220" stroke={RED} strokeWidth={18} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lin(l, 1.0, 1.4)} style={{filter: glow(RED, 10)}} />
            </svg>
          </div>
        </>
      )}
    </During>

    {/* 1 · five skills → the map */}
    <During a={L.five}>{(l) => <SkillMap l={l} n={0} focus={-1} k={0} />}</During>
    {/* skill intros on the map */}
    {[L.n1, L.n2, L.n3, L.n4, L.n5].map((li, i) => (
      <During key={li} a={li}>{(l, d) => <SkillMap l={l} n={i} focus={i} k={lin(l, 0.2, Math.max(0.6, d * 0.7))} />}</During>
    ))}

    {/* 3 · ECC: one install, 327 skills, 72 agents */}
    <During a={L.ecc}>
      {(l, d) => (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 220, display: 'flex', justifyContent: 'center', gap: 80, alignItems: 'flex-end'}}>
            <div style={{textAlign: 'center'}}>
              <Count to={327} t={l} a={0.8} b={d * 0.62} />
              <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 30, color: MUTE, marginTop: 8}}>skills</div>
            </div>
            <div style={{textAlign: 'center', opacity: lin(l, d * 0.6, d * 0.7)}}>
              <Count to={72} t={l} a={d * 0.62} b={d * 0.9} size={110} color={TXT} />
              <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 30, color: MUTE, marginTop: 8}}>agents</div>
            </div>
          </div>
          <div style={{position: 'absolute', left: 60, right: 60, top: 450, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center'}}>
            {Array.from({length: 54}, (_, i) => {
              const k = pop(l, 0.7 + i * 0.035, 30, 14);
              return (
                <div key={i} style={{fontFamily: MONO, fontWeight: 700, fontSize: 20, padding: '8px 14px', borderRadius: 10, background: i % 9 === 0 ? '#1B2208' : PANEL, border: `2px solid ${i % 9 === 0 ? LIME : EDGE}`, color: i % 9 === 0 ? LIME : '#B8BEC7', opacity: k, scale: S(interpolate(k, [0, 1], [0.4, 1]))}}>
                  {ECC_SKILLS[i % ECC_SKILLS.length]}
                </div>
              );
            })}
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 26, color: LIME, opacity: lin(l, 0.2, 0.6)}}>
            $ claude plugin install ecc@ecc  ✓
          </div>
        </>
      )}
    </During>

    {/* 5 · my project, files flying into one map */}
    <During a={L.map}>
      {(l, d) => (
        <svg width={1080} height={1100} style={{position: 'absolute', left: 0, top: 0}}>
          {FILES.map((f, i) => {
            const sx = 120 + (i % 3) * 330, sy = 220 + Math.floor(i / 3) * 170;
            const [gx, gy] = G.nodes[(i * 53 + 11) % G.nodes.length];
            const tx = 140 + gx * 800, ty = 230 + gy * 720;
            const m = lin(l, d * 0.5 + i * 0.03, d * 0.92);
            const x = interpolate(m, [0, 1], [sx, tx]), y = interpolate(m, [0, 1], [sy, ty]);
            const w = interpolate(m, [0, 1], [290, 22]);
            return (
              <g key={f} opacity={pop(l, i * 0.04)}>
                <rect x={x - w / 2} y={y - interpolate(m, [0, 1], [50, 11])} width={w} height={interpolate(m, [0, 1], [100, 22])} rx={interpolate(m, [0, 1], [16, 11])} fill={m > 0.95 ? LIME : PANEL} stroke={m > 0.5 ? LIME : EDGE} strokeWidth={3} />
                {m < 0.5 && <text x={x} y={y + 10} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={26} fill={TXT} opacity={1 - m * 2}>{f}</text>}
              </g>
            );
          })}
        </svg>
      )}
    </During>

    {/* 6–7 · the real graph: 684 ideas, then the graphify path */}
    <During a={L.ideas} b={L.path}>
      {(l) => {
        const tPath = lineStart(L.path) - lineStart(L.ideas);
        const draw = lin(l, 0, tPath * 0.9);
        const dim = lin(l, tPath, tPath + 0.5);
        const X0 = (x: number) => 90 + x * 900;
        const Y0 = (y: number) => 180 + y * 760;
        const cam = lin(l, tPath - 0.1, tPath + 0.8);
        const X = X0, Y = Y0;
        // path nodes slide out of the graph into an evenly spaced route (metro-map style)
        const PX = (i: number) => interpolate(cam, [0, 1], [X0(G.nodes[G.path[i]][0]), i % 2 ? 660 : 420]);
        const PY = (i: number) => interpolate(cam, [0, 1], [Y0(G.nodes[G.path[i]][1]), 300 + i * 106]);
        const hops = G.path.length - 1;
        const reach = lin(l, tPath + 0.3, tPath + 2.6) * hops;
        return (
          <>
            <svg width={1080} height={1100} style={{position: 'absolute', left: 0, top: 0}}>
              <g opacity={1 - dim * 0.75}>
                {G.edges.map(([a, b], i) => (i / G.edges.length < draw ? <line key={i} x1={X(G.nodes[a][0])} y1={Y(G.nodes[a][1])} x2={X(G.nodes[b][0])} y2={Y(G.nodes[b][1])} stroke="#3B4A1A" strokeWidth={1.4} /> : null))}
                {G.nodes.map(([x, y, c], i) => (i / G.nodes.length < draw * 1.1 ? <circle key={i} cx={X(x)} cy={Y(y)} r={3.4} fill={`hsl(${78 + (c * 37) % 120}, 80%, ${55 + (c % 3) * 8}%)`} /> : null))}
              </g>
              {G.path.slice(0, -1).map((p, i) => {
                const q = G.path[i + 1];
                const k = Math.max(0, Math.min(1, reach - i));
                const x1 = PX(i), y1 = PY(i), x2 = PX(i + 1), y2 = PY(i + 1);
                return <line key={i} x1={x1} y1={y1} x2={x1 + (x2 - x1) * k} y2={y1 + (y2 - y1) * k} stroke={LIME} strokeWidth={7} strokeLinecap="round" style={{filter: glow(LIME, 10)}} opacity={dim} />;
              })}
              {G.path.map((p, i) => {
                const on = reach >= i - 0.05 && dim > 0;
                const x = PX(i), y = PY(i);
                const left = i % 2 === 0;
                const lx = left ? x - 262 : x + 32;
                const ly = y - 20;
                return (
                  <g key={p} opacity={on ? 1 : 0}>
                    <circle cx={x} cy={y} r={14} fill={LIME} style={{filter: glow(LIME, 12)}} />
                    
                    <rect x={lx} y={ly} width={230} height={40} rx={10} opacity={cam} fill="#0F1206" stroke={LIME} strokeWidth={2} />
                    <text opacity={cam} x={lx + 115} y={ly + 28} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={20} fill={LIME}>{G.pathLabels[i]}</text>
                  </g>
                );
              })}
            </svg>
            <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', opacity: 1 - dim}}>
              <Count to={G.nodeCount} t={l} a={0} b={tPath * 0.9} size={120} />
              <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 28, color: MUTE, marginTop: 4}}>ideas · {G.edgeCount.toLocaleString('en-GB')} links · my repo</div>
            </div>
            <div style={{position: 'absolute', left: 60, right: 60, top: 140, padding: '18px 26px', borderRadius: 16, background: PANEL, border: `2px solid ${EDGE}`, fontFamily: MONO, fontWeight: 700, fontSize: 24, color: TXT, opacity: dim}}>
              <span style={{color: LIME}}>$</span> graphify path "Viral Swipe File" "Remotion"
              <div style={{color: MUTE, fontSize: 20, marginTop: 6}}>Shortest path ({G.path.length - 1} hops) · instead of reading every file</div>
            </div>
          </>
        );
      }}
    </During>

    {/* 9–10 · IG Viral: outliers vs their own normal */}
    <During a={L.finds} b={L.x283}>
      {(l) => {
        const t2 = lineStart(L.x283) - lineStart(L.finds);
        const shoot = lin(l, t2 + 0.2, t2 + 2.0);
        return (
          <>
            <div style={{position: 'absolute', left: 60, top: 170, fontFamily: MONO, fontWeight: 700, fontSize: 26, color: MUTE}}>views ÷ the account's own median</div>
            <svg width={1080} height={1000} style={{position: 'absolute', left: 0, top: 0}}>
              <line x1={60} y1={880} x2={1020} y2={880} stroke={EDGE} strokeWidth={3} />
              <line x1={60} y1={800} x2={1020} y2={800} stroke={MUTE} strokeWidth={3} strokeDasharray="10 10" opacity={lin(l, 0.6, 1)} />
              <text x={1020} y={786} textAnchor="end" fontFamily={MONO} fontWeight={700} fontSize={22} fill={MUTE} opacity={lin(l, 0.6, 1)}>their normal = 1×</text>
              {VIRAL.map((v, i) => {
                const big = v > 100;
                const base = Math.min(v, 1.6) * 80 * pop(l, 0.2 + i * 0.06, 30, 14);
                const h = big ? interpolate(shoot, [0, 1], [base, 640]) : base;
                const x = 80 + i * 78;
                return (
                  <g key={i}>
                    <rect x={x} y={880 - h} width={58} height={h} rx={10} fill={big && shoot > 0 ? LIME : '#2C323B'} style={{filter: big && shoot > 0 ? glow(LIME, 14) : undefined}} />
                    <rect x={x + 6} y={890} width={46} height={80} rx={8} fill={PANEL} stroke={big ? LIME : EDGE} strokeWidth={2} />
                    <path d={`M${x + 22} ${918} L${x + 38} ${930} L${x + 22} ${942} Z`} fill={big ? LIME : MUTE} />
                  </g>
                );
              })}
            </svg>
            <div style={{position: 'absolute', left: 0, right: 0, top: 240, textAlign: 'center', opacity: shoot}}>
              <Count to={283} t={l} a={t2 + 0.2} b={t2 + 2.0} size={170} suffix="×" />
              <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, color: MUTE, marginTop: 8}}>3.4M views on a 12K-median account</div>
            </div>
          </>
        );
      }}
    </During>

    {/* 11 · that's where I learn */}
    <During a={L.learn}>
      {(l) => (
        <>
          <Panel x={170} y={260} w={740} h={620} title="Social Media/viral-swipe.md" k={pop(l, 0)}>
            <div style={{padding: '26px 34px', fontFamily: MONO, fontWeight: 700, fontSize: 26, lineHeight: 1.7, color: '#B8BEC7'}}>
              <div style={{color: LIME}}># What is over-indexing</div>
              {['1. A person or a feeling, not a place', '2. Kerala life lived in the UK', '3. Manglish one-liners about kids'].map((s, i) => (
                <div key={i} style={{opacity: lin(l, -0.1 + i * 0.15, 0.15 + i * 0.15), translate: `${(1 - lin(l, -0.1 + i * 0.15, 0.15 + i * 0.15)) * 30}px 0px`}}>{s}</div>
              ))}
              <div style={{marginTop: 18, color: MUTE}}>## Your version</div>
              <div style={{opacity: lin(l, 0.5, 0.8), color: TXT}}>"Malayalam only, I said."</div>
            </div>
          </Panel>
        </>
      )}
    </During>

    {/* 13–14 · IG Human: robot out, human score in */}
    <During a={L.robot} b={L.before}>
      {(l) => {
        const t2 = lineStart(L.before) - lineStart(L.robot);
        const fix = lin(l, t2 - 0.4, t2 + 0.4);
        const words: [string, boolean][] = [['In', false], ["today's", true], ['fast-paced', true], ['world,', true], ["let's", false], ['delve', true], ['into', false], ['the', false], ['game-changing', true], ['secrets', false], ['—', true], ['unlock', true], ['your', false], ['potential!', true]];
        return (
          <>
            <Panel x={90} y={210} w={900} h={430} title="caption_draft.txt" k={pop(l, 0)} border={fix < 0.5 ? '#5A2222' : LIME_DIM}>
              <div style={{padding: '30px 36px', display: 'flex', flexWrap: 'wrap', gap: '10px 14px', fontFamily: SANS, fontWeight: 700, fontSize: 44, lineHeight: 1.25}}>
                {fix < 0.5
                  ? words.map(([w, bad], i) => {
                      const hit = bad && l > 0.5 + i * 0.07;
                      return <span key={i} style={{color: hit ? RED : TXT, background: hit ? 'rgba(255,77,77,0.14)' : 'transparent', borderRadius: 8, padding: '0 6px', textDecoration: hit && l > 1.6 ? 'line-through' : 'none'}}>{w}</span>;
                    })
                  : <span style={{color: TXT, opacity: (fix - 0.5) * 2}}>We had a lovely, lovely time. <span style={{color: LIME}}>Save this for your trip.</span></span>}
              </div>
            </Panel>
            <div style={{position: 'absolute', left: 90, top: 170, fontFamily: MONO, fontWeight: 700, fontSize: 24, color: fix < 0.5 ? RED : LIME}}>{fix < 0.5 ? '⚠ machine fingerprint found' : '✓ sounds like me'}</div>
            <svg width={1080} height={1100} style={{position: 'absolute', left: 0, top: 0, opacity: lin(l, t2 - 0.2, t2 + 0.3)}}>
              <path d="M340 960 A200 200 0 0 1 740 960" stroke={EDGE} strokeWidth={30} fill="none" strokeLinecap="round" />
              <path d="M340 960 A200 200 0 0 1 740 960" stroke={LIME} strokeWidth={30} fill="none" strokeLinecap="round" pathLength={100} strokeDasharray={`${lin(l, t2, t2 + 1.4) * 87} 100`} style={{filter: glow(LIME, 10)}} />
              <text x={540} y={930} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={110} fill={LIME}>{Math.round(lin(l, t2, t2 + 1.4) * 87)}</text>
              <text x={540} y={990} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={26} fill={MUTE}>HUMAN SCORE · PASS</text>
            </svg>
          </>
        );
      }}
    </During>

    {/* 16 · Claude writes the video as code */}
    <During a={L.code}>
      {(l) => {
        const code = ['<Scene from={L.n5}>', '  <SkillMap focus={4} />', '  <Avatar', '    open={mouth[frame]}', '    pose="count"', '    fingers={5}', '  />', '</Scene>'];
        const chars = Math.floor(lin(l, 0.1, 2.4) * code.join('\n').length);
        let left = chars;
        return (
          <Panel x={80} y={230} w={920} h={620} title="src/SkillsReel.tsx" k={pop(l, 0)}>
            <div style={{padding: '26px 34px', fontFamily: MONO, fontWeight: 700, fontSize: 36, lineHeight: 1.55, whiteSpace: 'pre'}}>
              {code.map((ln, i) => {
                const show = Math.max(0, Math.min(ln.length, left));
                left -= ln.length + 1;
                const txt = ln.slice(0, show);
                return (
                  <div key={i} style={{color: /Avatar|Scene|SkillMap/.test(ln) ? LIME : '#C9CED6'}}>
                    <span style={{color: '#4A505A', marginRight: 22}}>{String(i + 1).padStart(2, ' ')}</span>{txt}
                    {show < ln.length && show > 0 ? <span style={{background: LIME, color: BG}}> </span> : null}
                  </div>
                );
              })}
            </div>
          </Panel>
        );
      }}
    </During>

    {/* 17 · every scene, every word — like this one (a phone playing this reel) */}
    <During a={L.thisOne}>
      {(l) => (
        <div style={{position: 'absolute', left: 300, top: 150, width: 480, height: 860, borderRadius: 60, border: '10px solid #2B2F36', background: BG, overflow: 'hidden', boxShadow: `0 0 60px rgba(198,244,50,0.25)`, scale: S(pop(l, 0, 30, 13))}}>
          <div style={{position: 'absolute', inset: 0, scale: '0.44', transformOrigin: '0 0', width: 1080, height: 1920}}>
            <SkillMap l={l} n={4} focus={-1} k={1} all={l > 1.2} />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 40, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 30, color: TXT}}>
            this reel <span style={{color: LIME}}>· made in code</span>
          </div>
          <div style={{position: 'absolute', left: 20, right: 20, bottom: 18, height: 8, borderRadius: 4, background: EDGE}}>
            <div style={{height: 8, borderRadius: 4, background: LIME, width: `${((lineStart(L.thisOne) + l) / SKILLS_SECONDS) * 100}%`}} />
          </div>
        </div>
      )}
    </During>

    {/* 18 · no editing app, just Claude */}
    <During a={L.noApp}>
      {(l) => (
        <>
          <Panel x={90} y={230} w={900} h={330} title="Video Editor Pro" k={pop(l, 0)}>
            <div style={{padding: 24}}>
              {[0, 1, 2].map((r) => (
                <div key={r} style={{display: 'flex', gap: 8, marginBottom: 14}}>
                  {Array.from({length: 7}, (_, c) => <div key={c} style={{height: 50, width: 60 + ((r * 7 + c) * 37) % 90, borderRadius: 8, background: ['#3B4C6B', '#5A3B6B', '#3B6B5A'][r]}} />)}
                </div>
              ))}
            </div>
          </Panel>
          <svg width={1080} height={600} style={{position: 'absolute', left: 0, top: 0}}>
            <path d="M200 260 L880 540 M880 260 L200 540" stroke={RED} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lin(l, 0.6, 1.0)} style={{filter: glow(RED, 10)}} />
          </svg>
          <Panel x={90} y={640} w={900} h={300} title="claude" k={pop(l, 1.4)} border={LIME_DIM}>
            <div style={{padding: '26px 30px', fontFamily: MONO, fontWeight: 700, fontSize: 32, lineHeight: 1.6, color: TXT}}>
              <div><span style={{color: LIME}}>›</span> make the skills reel, slowly by slowly</div>
              <div style={{color: LIME, opacity: lin(l, 2.0, 2.3)}}>✓ rendered SkillsReel.mp4</div>
            </div>
          </Panel>
        </>
      )}
    </During>

    {/* 19 · comment SKILLS → DM with all five */}
    <During a={L.comment}>
      {(l, d) => {
        const dm = lin(l, d * 0.3, d * 0.45);
        return (
          <>
            <Panel x={110} y={200} w={860} h={560} title="Comments" k={pop(l, 0) * (1 - dm * 0.6)}>
              <div style={{padding: '18px 26px'}}>
                {Array.from({length: 6}, (_, i) => (
                  <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '12px 0', borderBottom: `2px solid ${EDGE}`, opacity: pop(l, 0.05 + i * 0.1), translate: `0px ${(1 - pop(l, 0.05 + i * 0.1)) * 30}px`}}>
                    <div style={{width: 52, height: 52, borderRadius: 26, background: ['#5A6B80', '#806B5A', '#6B805A', '#805A6B', '#5A8080', '#7A6B9A'][i]}} />
                    <div style={{width: 120 + (i * 37) % 80, height: 16, borderRadius: 8, background: '#2C323B'}} />
                    <div style={{marginLeft: 'auto', fontFamily: SANS, fontWeight: 800, fontSize: 32, color: BG, background: LIME, padding: '6px 18px', borderRadius: 10}}>SKILLS</div>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel x={150} y={330} w={780} h={600} title="new message" k={dm} border={LIME}>
              <div style={{padding: '22px 30px', fontFamily: SANS, fontWeight: 700, fontSize: 32, color: TXT}}>
                <div style={{marginBottom: 14}}>Here are all five:</div>
                {SKILLS.map((s, i) => (
                  <div key={s.name} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: `2px solid ${EDGE}`, opacity: lin(l, d * 0.4 + i * 0.07, d * 0.47 + i * 0.07)}}>
                    <div style={{width: 40, height: 40, borderRadius: 20, background: LIME, color: BG, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
                    <div>{s.name}</div>
                    <div style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 20, color: MUTE}}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </Panel>
          </>
        );
      }}
    </During>

    {/* 20 · you don't need to code either — full map, loop back */}
    <During a={L.either}>
      {(l) => (
        <>
          <SkillMap l={l} n={5} focus={-1} k={1} all />
          <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 34, color: LIME, opacity: lin(l, 0.4, 0.8), filter: glow(LIME, 8)}}>no code needed</div>
        </>
      )}
    </During>
  </>
);

/* ---------------- captions (reference style: phrase + lime keyword box) ---------------- */
const KEY = new Set(['nurse', 'code', 'five', 'claude', 'studio', 'one', 'everything', '327', 'skills', '72', 'two', 'graphify', 'map', '684', 'connected', 'path', 'three', 'viral', 'normal', '283', 'learn', 'four', 'human', 'robot', 'anyone', 'remotion', 'scene', 'word', 'this', 'app', 'claude,', 'skills,', 'all', 'either']);
const Captions: React.FC = () => {
  const t = useT();
  const cur = T.display.filter((w) => w.s - 0.06 <= t).pop();
  if (!cur) return null;
  const ws = T.display.filter((w) => w.line === cur.line);
  if (t > ws[ws.length - 1].e + 0.5) return null;
  const clean = (w: string) => w.toLowerCase().replace(/[^a-z0-9']/g, '');
  const lastKey = [...ws].filter((w) => w.s - 0.06 <= t && KEY.has(clean(w.w))).pop();
  return (
    <div style={{position: 'absolute', left: 50, right: 50, top: 1075, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 16px'}}>
      {ws.map((w, i) => {
        const on = w.s - 0.06 <= t;
        const k = pop(t, w.s - 0.06, 30, 15);
        const box = lastKey === w;
        return (
          <span key={i} style={{fontFamily: SANS, fontWeight: 800, fontSize: 60, color: on ? TXT : 'rgba(242,243,245,0.18)', padding: box ? '0 12px' : 0, borderRadius: 12, border: box ? `3px solid ${LIME}` : '3px solid transparent', background: box ? 'rgba(198,244,50,0.14)' : 'transparent', translate: `0px ${interpolate(k, [0, 1], [14, 0])}px`, letterSpacing: -1, textShadow: '0 4px 20px rgba(0,0,0,0.8)'}}>
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

/* ---------------- presenter ---------------- */
const POSES: [Pose, number][] = [['chest', 0], ['palm', 0], ['count', 1], ['palm', 0], ['count', 2], ['palm', 0], ['palm', 0], ['think', 0], ['count', 3], ['palm', 0], ['palm', 0], ['chest', 0], ['count', 4], ['palm', 0], ['palm', 0], ['count', 5], ['palm', 0], ['palm', 0], ['palm', 0], ['down', 0], ['thumb', 0]];
const Presenter: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const i = Math.min(M.open.length - 1, Math.max(0, Math.round(t * M.fps)));
  const avg = (arr: number[], w = 2) => {
    let s = 0, n = 0;
    for (let j = Math.max(0, i - w); j <= Math.min(arr.length - 1, i + w); j++) { s += arr[j]; n++; }
    return s / Math.max(1, n);
  };
  const open = M.open[i] ?? 0;
  const energy = avg(M.open, 6);
  const li = lineOf(t);
  const [pose, fingers] = POSES[Math.min(li, POSES.length - 1)];
  const [prevPose] = POSES[Math.max(0, li - 1)];
  const blend = lin(t, lineStart(li) - 0.15, lineStart(li) + 0.2);
  const sway = Math.sin(t * 2.2) * Math.min(1, energy * 2.5);
  const A = poseAngles(prevPose, sway), B = poseAngles(pose, sway);
  const arm = {a1: interpolate(blend, [0, 1], [A.a1, B.a1]), a2: interpolate(blend, [0, 1], [A.a2, B.a2]), handRot: interpolate(blend, [0, 1], [A.handRot, B.handRot])};
  const blinkPhase = (t + 0.37) % 3.6;
  const blink = blinkPhase < 0.14 ? Math.sin((blinkPhase / 0.14) * Math.PI) : 0;
  const brow = li === L.x283 ? lin(t, lineStart(li), lineStart(li) + 0.3) : Math.min(1, energy * 1.2) * 0.4;
  const wink = li === L.either ? lin(t, lineEnd(li) - 1.0, lineEnd(li) - 0.7) - lin(t, lineEnd(li) - 0.4, lineEnd(li) - 0.2) : 0;
  const enter = pop(t, 0, 30, 14);
  return (
    <div style={{position: 'absolute', left: 430, top: 1185, translate: `${(1 - enter) * 300}px 0px`}}>
      <Avatar open={open} round={M.round[i] ?? 0.3} blink={blink} pose={blend < 0.5 ? prevPose : pose} fingers={fingers} sway={sway} arm={arm}
        tilt={Math.sin(t * 1.1) * 3 + energy * 4 * Math.sin(t * 3.3)} bob={-energy * 14 + Math.sin(t * 2) * 3} brow={brow} gaze={li === L.nurse || li === L.comment ? 0.2 : -0.7} wink={Math.max(0, wink)} />
    </div>
  );
};

export const SkillsReel: React.FC = () => (
  <AbsoluteFill style={{background: BG}}>
    <Audio src={staticFile('skills_voice.wav')} />
    <Audio src={staticFile('skills_sfx.wav')} volume={0.8} />
    <Backdrop />
    <Scenes />
    <Captions />
    <Presenter />
    <div style={{position: 'absolute', left: 44, top: 44, fontFamily: SANS, fontWeight: 700, fontSize: 28, color: MUTE}}>@bigishbalan</div>
  </AbsoluteFill>
);
