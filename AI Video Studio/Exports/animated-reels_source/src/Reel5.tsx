// Reel 5 · "Kerala dad's Mykonos spreadsheet" · animated version
import React from 'react';
import {Audio, interpolate, staticFile} from 'remotion';
import timingJson from './reel5_timing.json';
import {C, SANS, SERIF, Canvas, Scene, Captions, Pill, Centre, Tick, Cross, Person, Bubble, Footer, pop, lin, Timing} from './kit';

const T = timingJson as Timing;
export const REEL5_SECONDS = T.end + 0.8;

// Only the stops named in the script are named here; the rest stay generic.
const STOPS = ['Breakfast · 7:00', 'Windmills · 8:00', 'Little Venice · 10:00', 'Lunch · booked', ...Array.from({length: 8}, (_, i) => `Stop ${i + 5}`)];
const KEEP = new Set([5, 8, 10]); // three rows left standing; which ones is not a claim
const ROWC = [C.coral, C.gold, C.green, C.sea, C.blue, '#9B6BFF'];

const Sheet: React.FC<{t: number; strikeAt?: number; rows?: number; fill?: number; w?: number}> = ({t, strikeAt, rows = 12, fill = 1, w = 760}) => (
  <div style={{width: w, background: '#fff', border: `5px solid ${C.ink}`, borderRadius: 28, boxShadow: `0 14px 0 ${C.ink}`, padding: '26px 30px', fontFamily: SANS}}>
    <div style={{display: 'flex', gap: 10, marginBottom: 14}}>
      {[C.red, C.gold, C.green].map((c) => <div key={c} style={{width: 18, height: 18, borderRadius: 9, background: c}} />)}
      <div style={{marginLeft: 14, fontWeight: 800, fontSize: 28, color: C.mute}}>mykonos_plan_FINAL_v7.xlsx</div>
    </div>
    {STOPS.slice(0, rows).map((s, i) => {
      const k = lin(t, i * 0.06 * fill, i * 0.06 * fill + 0.3);
      const sk = strikeAt === undefined || KEEP.has(i) ? 0 : lin(t, strikeAt + [...STOPS.keys()].filter((j) => !KEEP.has(j)).indexOf(i) * 0.12, strikeAt + [...STOPS.keys()].filter((j) => !KEEP.has(j)).indexOf(i) * 0.12 + 0.18);
      return (
        <div key={s} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 16, height: 52, opacity: k, borderTop: i ? `2px solid ${C.line}` : 'none'}}>
          <div style={{width: 26, height: 26, borderRadius: 6, background: ROWC[i % ROWC.length]}} />
          <div style={{fontWeight: 700, fontSize: 32, color: sk > 0.5 ? C.mute : C.ink}}>{s}</div>
          <div style={{position: 'absolute', left: 0, top: 25, height: 6, borderRadius: 3, background: C.red, width: `${sk * 100}%`}} />
        </div>
      );
    })}
  </div>
);

const Windmill: React.FC<{t: number; x: number; y: number; s?: number}> = ({t, x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-60 0 L-45 -170 L45 -170 L60 0 Z" fill="#fff" stroke={C.ink} strokeWidth={6} />
    <path d="M-50 -170 Q0 -215 50 -170 Z" fill={C.sea} stroke={C.ink} strokeWidth={6} />
    <rect x={-16} y={-50} width={32} height={50} rx={6} fill={C.sea} stroke={C.ink} strokeWidth={5} />
    <g transform={`translate(0 -175) rotate(${t * 90})`}>
      {[0, 90, 180, 270].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <line x1={0} y1={0} x2={0} y2={-130} stroke={C.ink} strokeWidth={6} />
          <path d="M4 -30 L40 -40 L40 -125 L4 -130 Z" fill={C.gold} stroke={C.ink} strokeWidth={5} />
        </g>
      ))}
      <circle r={12} fill={C.ink} />
    </g>
  </g>
);

const Waves: React.FC<{t: number; y: number; w?: number}> = ({t, y, w = 1080}) => (
  <g>
    {[0, 1, 2].map((r) => (
      <path
        key={r}
        d={Array.from({length: 14}, (_, i) => `${i === 0 ? 'M' : 'L'}${i * (w / 12) - 60 + Math.sin(t * 2 + r) * 20} ${y + r * 46 + Math.sin(i * 1.3 + t * 3 + r) * 12}`).join(' ')}
        fill="none" stroke={r === 0 ? '#fff' : '#BFE6F5'} strokeWidth={8} strokeLinecap="round"
      />
    ))}
  </g>
);

const Reel5Scenes: React.FC = () => (
  <>
    {/* 0 · hook: the plan, nine stops struck out */}
    <Scene timing={T} from={0}>
      {(l) => (
        <>
          <Pill t={l} text="KERALA DAD'S MYKONOS PLAN" />
          <Centre top={410} height={820}>
            <div style={{scale: String(0.92)}}><Sheet t={l} strikeAt={1.15} /></div>
          </Centre>
          <div style={{position: 'absolute', right: 70, top: 1010, rotate: '-8deg', scale: String(pop(l, 2.4)), fontFamily: SANS, fontWeight: 800, fontSize: 64, color: '#fff', background: C.red, padding: '12px 28px', borderRadius: 18}}>-9</div>
        </>
      )}
    </Scene>

    {/* 1 · Kerala dad */}
    <Scene timing={T} from={1}>
      {(l) => (
        <>
          <Pill t={l} text="KERALA DAD" color={C.leaf} />
          <Centre>
            <svg width={900} height={760} viewBox="-450 -420 900 760">
              <g transform={`translate(-250 300) rotate(${Math.sin(l * 2) * 3})`}>
                <path d="M0 0 Q-10 -250 20 -430" stroke="#8B5A2B" strokeWidth={26} fill="none" strokeLinecap="round" />
                {[-60, -20, 20, 60, 100, 140].map((a, i) => (
                  <path key={i} d="M20 -430 q120 -40 230 40" transform={`rotate(${a - 40} 20 -430)`} stroke={C.leaf} strokeWidth={22} fill="none" strokeLinecap="round" />
                ))}
              </g>
              <Person x={90} y={120} scale={2.6} color="#fff" />
              <rect x={-18} y={210} width={216} height={70} fill="#fff" stroke={C.ink} strokeWidth={5} />
              <rect x={-18} y={250} width={216} height={10} fill={C.gold} />
              <g transform={`translate(260 ${-40 - pop(l, 0.6) * 40}) rotate(${-10 + pop(l, 0.6) * 10}) scale(${pop(l, 0.6)})`}>
                <rect x={-80} y={-100} width={160} height={200} rx={14} fill="#fff" stroke={C.ink} strokeWidth={6} />
                {[0, 1, 2, 3].map((r) => <rect key={r} x={-56} y={-70 + r * 42} width={112} height={22} rx={6} fill={ROWC[r]} />)}
              </g>
            </svg>
          </Centre>
        </>
      )}
    </Scene>

    {/* 2 · colour-coded spreadsheet for a Greek island */}
    <Scene timing={T} from={2}>
      {(l) => (
        <>
          <Pill t={l} text="COLOUR-CODED. OBVIOUSLY." color={C.blue} />
          <Centre>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 120px)', gap: 14, scale: String(1)}}>
              {Array.from({length: 36}, (_, i) => {
                const k = pop(l, 0.25 + i * 0.035);
                return <div key={i} style={{width: 120, height: 84, borderRadius: 14, border: `4px solid ${C.ink}`, background: ROWC[(i + Math.floor(i / 6)) % ROWC.length], scale: String(k), opacity: k}} />;
              })}
            </div>
          </Centre>
          <div style={{position: 'absolute', left: 0, right: 0, top: 1130, textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: 70, color: C.ink, opacity: lin(l, 1.6, 2)}}>
            for a Greek island
          </div>
        </>
      )}
    </Scene>

    {/* 3 · 7am breakfast, 8 sharp windmills */}
    <Scene timing={T} from={3}>
      {(l) => (
        <>
          <Pill t={l} text="THE PLAN" />
          <Centre>
            <svg width={940} height={800} viewBox="0 0 940 800">
              <g opacity={pop(l, 0.1)} transform={`translate(0 ${(1 - pop(l, 0.1)) * 40})`}>
                <text x={40} y={150} fontFamily={SANS} fontWeight={800} fontSize={110} fill={C.ink}>7:00</text>
                <g transform="translate(560 60)">
                  <path d="M0 20 L20 140 Q90 170 160 140 L180 20 Z" fill="#fff" stroke={C.ink} strokeWidth={7} />
                  <path d="M180 50 q60 10 30 70 q-10 10 -30 4" fill="none" stroke={C.ink} strokeWidth={7} />
                  {[0, 1, 2].map((i) => <path key={i} d={`M${50 + i * 40} 0 q-14 -26 0 -50 q14 -24 0 -50`} stroke={C.mute} strokeWidth={6} fill="none" opacity={0.4 + 0.6 * Math.abs(Math.sin(l * 3 + i))} />)}
                </g>
              </g>
              <g opacity={pop(l, 1.3)} transform={`translate(0 ${(1 - pop(l, 1.3)) * 40})`}>
                <text x={40} y={560} fontFamily={SANS} fontWeight={800} fontSize={110} fill={C.blue}>8:00</text>
                <text x={44} y={630} fontFamily={SANS} fontWeight={700} fontSize={44} fill={C.mute}>sharp.</text>
                <Windmill t={l} x={700} y={780} s={1.25} />
              </g>
            </svg>
          </Centre>
        </>
      )}
    </Scene>

    {/* 4 · 10 o'clock Little Venice, lunch booked */}
    <Scene timing={T} from={4}>
      {(l) => (
        <>
          <Pill t={l} text="10:00 · LITTLE VENICE" color={C.sea} />
          <Centre>
            <svg width={960} height={780} viewBox="0 0 960 780">
              {[0, 1, 2, 3, 4].map((i) => {
                const k = pop(l, 0.15 + i * 0.12);
                const h = [260, 320, 240, 300, 270][i];
                return (
                  <g key={i} transform={`translate(${60 + i * 175} ${520 - h * k})`} opacity={k}>
                    <rect width={160} height={h} fill="#fff" stroke={C.ink} strokeWidth={6} />
                    <rect x={30} y={40} width={40} height={50} rx={20} fill={[C.blue, C.coral, C.sea, C.gold, C.green][i]} />
                    <rect x={90} y={40} width={40} height={50} rx={20} fill={[C.blue, C.coral, C.sea, C.gold, C.green][i]} />
                    <rect x={10} y={h - 70} width={140} height={14} fill={[C.blue, C.coral, C.sea, C.gold, C.green][i]} />
                  </g>
                );
              })}
              <rect x={0} y={520} width={960} height={260} fill={C.sea} />
              <Waves t={l} y={560} w={960} />
            </svg>
          </Centre>
          <div style={{position: 'absolute', left: 0, right: 0, top: 1172, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, opacity: lin(l, 1.4, 1.7)}}>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 56, color: C.ink}}>Lunch</div>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, color: '#fff', background: C.green, padding: '8px 22px', borderRadius: 14}}>BOOKED</div>
            <Tick size={90} k={lin(l, 1.6, 2.0)} />
          </div>
        </>
      )}
    </Scene>

    {/* 5 · day one, inspecting the hotel bed */}
    <Scene timing={T} from={5}>
      {(l) => (
        <>
          <Pill t={l} text="DAY ONE" color={C.coral} />
          <Centre>
            <svg width={940} height={780} viewBox="0 0 940 780">
              <rect x={120} y={430} width={700} height={170} rx={30} fill="#fff" stroke={C.ink} strokeWidth={7} />
              <rect x={120} y={430} width={700} height={60} rx={30} fill={C.blueSoft} stroke={C.ink} strokeWidth={7} />
              <rect x={150} y={360} width={200} height={90} rx={36} fill="#fff" stroke={C.ink} strokeWidth={6} />
              <rect x={100} y={300} width={40} height={360} rx={14} fill={C.ink} />
              <rect x={800} y={380} width={40} height={280} rx={14} fill={C.ink} />
              <Person x={560} y={300} scale={1.25} color={C.coral} kid bob={-Math.abs(Math.sin(l * 6)) * 60 * lin(l, 1.6, 1.9)} />
              <g transform={`translate(${430 + Math.sin(l * 2) * 60} ${470 + Math.cos(l * 2.4) * 20})`} opacity={1 - lin(l, 1.6, 1.8)}>
                <circle r={60} fill="rgba(220,228,255,0.6)" stroke={C.ink} strokeWidth={10} />
                <line x1={42} y1={42} x2={110} y2={110} stroke={C.ink} strokeWidth={18} strokeLinecap="round" />
              </g>
            </svg>
          </Centre>
          <div style={{position: 'absolute', left: 0, right: 0, top: 1140, textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: 66, color: C.blue, opacity: lin(l, 0.9, 1.3)}}>
            hotel inspector, on duty
          </div>
        </>
      )}
    </Scene>

    {/* 6 · ten out of ten, plan gone */}
    <Scene timing={T} from={6}>
      {(l) => (
        <>
          <Centre top={360}>
            <div style={{position: 'relative', width: 900, height: 820}}>
              <div style={{position: 'absolute', left: 40, top: 60, rotate: `${lin(l, 1.0, 1.8) * 40}deg`, translate: `${lin(l, 1.0, 1.8) * 900}px ${lin(l, 1.0, 1.8) * -300}px`, opacity: 1 - lin(l, 1.5, 1.9), scale: String(0.8)}}>
                <Sheet t={9} rows={7} />
              </div>
              <div style={{position: 'absolute', left: 150, top: 250, rotate: '-10deg', scale: String(interpolate(pop(l, 0.05, 30, 9), [0, 1], [2.4, 1])), opacity: pop(l, 0.05), border: `12px solid ${C.green}`, borderRadius: 30, padding: '20px 50px', fontFamily: SANS, fontWeight: 800, fontSize: 180, color: C.green, background: 'rgba(255,255,255,0.9)'}}>
                10/10
              </div>
              <div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 92, color: C.red, opacity: lin(l, 1.2, 1.5), letterSpacing: 2}}>
                PLAN GONE
              </div>
            </div>
          </Centre>
        </>
      )}
    </Scene>

    {/* 7–8 · found the beach in October, nobody moving */}
    <Scene timing={T} from={7} to={8}>
      {(l) => {
        const second = T.lineStarts[8] - T.lineStarts[7];
        const sit = lin(l, second, second + 0.6);
        return (
          <>
            <Pill t={l} text={l < second ? 'OCTOBER' : 'NOBODY MOVING'} color={l < second ? C.gold : C.sea} />
            <Centre>
              <svg width={1000} height={800} viewBox="0 0 1000 800">
                <circle cx={790} cy={150} r={90 + Math.sin(l * 2) * 6} fill={C.gold} />
                <rect x={0} y={330} width={1000} height={230} fill={C.sea} />
                <Waves t={l} y={360} w={1000} />
                <path d="M0 540 Q500 470 1000 540 L1000 800 L0 800 Z" fill={C.sand} />
                {/* towel + family settling */}
                <rect x={300} y={620} width={420} height={110} rx={18} fill={C.coral} opacity={sit} />
                {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={320 + i * 84} y={620} width={36} height={110} fill="#fff" opacity={sit * 0.7} />)}
                <Person x={interpolate(lin(l, 0, 1.3), [0, 1], [-80, 560])} y={600 - Math.abs(Math.sin(l * 9)) * 30 * (1 - sit)} scale={1.1} color={C.coral} kid />
                <g opacity={sit}>
                  <Person x={400} y={600} scale={1.3} color="#fff" />
                  <Person x={680} y={600} scale={1.3} color={C.blue} />
                </g>
                <g opacity={sit} fontFamily={SANS} fontWeight={800} fill={C.mute}>
                  {[0, 1, 2].map((i) => <text key={i} x={760 + i * 40} y={460 - i * 50 - ((l * 30) % 50)} fontSize={50 + i * 10} opacity={0.4 + 0.2 * i}>z</text>)}
                </g>
              </svg>
            </Centre>
          </>
        );
      }}
    </Scene>

    {/* 9 · three stops, best holiday */}
    <Scene timing={T} from={9}>
      {(l) => (
        <>
          <Centre top={380}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{display: 'flex', gap: 60, marginBottom: 30}}>
                {[0, 1, 2].map((i) => (
                  <svg key={i} width={160} height={210} viewBox="0 0 160 210" style={{scale: String(pop(l, 0.1 + i * 0.18)), opacity: pop(l, 0.1 + i * 0.18)}}>
                    <path d="M80 200 Q10 110 10 80 A70 70 0 1 1 150 80 Q150 110 80 200Z" fill={[C.coral, C.sea, C.gold][i]} stroke={C.ink} strokeWidth={7} />
                    <circle cx={80} cy={80} r={28} fill="#fff" stroke={C.ink} strokeWidth={6} />
                  </svg>
                ))}
              </div>
              <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 200, color: C.ink, lineHeight: 1, scale: String(pop(l, 0.5))}}>3 stops</div>
              <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 96, color: C.blue, opacity: lin(l, 1.1, 1.5), marginTop: 20}}>best holiday yet</div>
            </div>
          </Centre>
        </>
      )}
    </Scene>

    {/* 10 · CTA: plan or go */}
    <Scene timing={T} from={10}>
      {(l) => (
        <>
          <Pill t={l} text="PARENTS" color={C.coral} />
          <Centre>
            <div style={{display: 'flex', flexDirection: 'column', gap: 50, alignItems: 'center'}}>
              <div style={{display: 'flex', gap: 50}}>
                {['PLAN', 'GO'].map((w, i) => (
                  <div key={w} style={{fontFamily: SANS, fontWeight: 800, fontSize: 120, color: '#fff', background: i ? C.green : C.blue, border: `6px solid ${C.ink}`, boxShadow: `0 14px 0 ${C.ink}`, borderRadius: 40, padding: '30px 60px', scale: String(pop(l, 0.2 + i * 0.35) * (1 + 0.04 * Math.sin(l * 6 + i * 3)))}}>
                    {w}
                  </div>
                ))}
              </div>
              <Bubble k={pop(l, 1.3)}>Comment below</Bubble>
            </div>
          </Centre>
        </>
      )}
    </Scene>

    {/* 11 · loop: spreadsheet ready, twelve stops */}
    <Scene timing={T} from={11}>
      {(l) => (
        <>
          <Pill t={l} text="NEXT TRIP" />
          <Centre top={410} height={820}>
            <div style={{scale: String(0.92)}}><Sheet t={l * 1.4} /></div>
          </Centre>
          <div style={{position: 'absolute', right: 70, top: 1010, rotate: '6deg', scale: String(pop(l, 1.4)), fontFamily: SANS, fontWeight: 800, fontSize: 60, color: '#fff', background: C.blue, padding: '12px 28px', borderRadius: 18}}>12 STOPS</div>
        </>
      )}
    </Scene>
  </>
);

export const Reel5: React.FC = () => (
  <Canvas>
    <Audio src={staticFile('reel5_voice.wav')} />
    <Audio src={staticFile('reel5_sfx.wav')} volume={0.9} />
    <Reel5Scenes />
    <Captions timing={T} emphasis={['twelve', 'nine', 'kerala', 'colour-coded', 'greek', 'windmills', 'sharp', 'venice', 'booked', 'inspecting', 'ten', 'gone', 'beach', 'october', 'moving', 'three', 'best', 'plan', 'go', "spreadsheet's"]} />
    <Footer />
  </Canvas>
);
