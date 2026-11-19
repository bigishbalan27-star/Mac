// Reel 6 · "Kerala rules, UK kid" · animated version
import React from 'react';
import {Audio, interpolate, staticFile} from 'remotion';
import timingJson from './reel6_timing.json';
import {C, SANS, SERIF, ML, Canvas, Scene, Captions, Pill, Centre, Tick, Cross, Person, Bubble, Footer, pop, lin, Timing} from './kit';

const T = timingJson as Timing;
export const REEL6_SECONDS = T.end + 0.8;

const Mal: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 66}) => <span style={{fontFamily: ML, fontWeight: 700, fontSize: size}}>{children}</span>;
const Sub: React.FC<{children: React.ReactNode}> = ({children}) => <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: C.mute, marginTop: 6}}>{children}</div>;

/** Dad (left) and son (right) standing, for the dialogue scenes */
const Pair: React.FC<{l: number; kidBounce?: boolean}> = ({l, kidBounce}) => (
  <svg width={1000} height={420} viewBox="0 0 1000 420" style={{position: 'absolute', left: 40, top: 760}}>
    <Person x={260} y={250} scale={1.9} color="#fff" />
    <rect x={180} y={360} width={160} height={50} fill="#fff" stroke={C.ink} strokeWidth={4} />
    <rect x={180} y={384} width={160} height={8} fill={C.gold} />
    <Person x={730} y={300} scale={1.25} color={C.coral} kid bob={kidBounce ? -Math.abs(Math.sin(l * 5)) * 18 : 0} />
  </svg>
);

const Palm: React.FC<{x: number; y: number; s?: number; t: number}> = ({x, y, s = 1, t}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${Math.sin(t * 2) * 3})`}>
    <path d="M0 0 Q-10 -200 16 -340" stroke="#8B5A2B" strokeWidth={22} fill="none" strokeLinecap="round" />
    {[-60, -20, 20, 60, 100, 140].map((a, i) => (
      <path key={i} d="M16 -340 q100 -34 190 34" transform={`rotate(${a - 40} 16 -340)`} stroke={C.leaf} strokeWidth={18} fill="none" strokeLinecap="round" />
    ))}
  </g>
);

const Reel6Scenes: React.FC = () => (
  <>
    {/* 0 · hook */}
    <Scene timing={T} from={0}>
      {(l) => {
        const cheersAt = (T.words.find((w) => w.line === 0 && w.w.toLowerCase().startsWith('cheers'))?.s ?? T.lineStarts[0] + 1.4) - T.lineStarts[0];
        return (
          <>
            <Pill t={l} text="KERALA RULES. UK KID." />
            <div style={{position: 'absolute', left: 80, top: 430}}>
              <Bubble k={pop(l, 0.05)}>
                <Mal size={76}>മലയാളം മാത്രം</Mal>
                <Sub>Malayalam only</Sub>
              </Bubble>
            </div>
            <div style={{position: 'absolute', right: 80, top: 640}}>
              <Bubble k={pop(l, cheersAt - 0.05)} tail="right" color={C.blue} ink="#fff">Cheers!</Bubble>
            </div>
            <Pair l={l} kidBounce />
          </>
        );
      }}
    </Scene>

    {/* 1 · one rule in this house */}
    <Scene timing={T} from={1}>
      {(l) => (
        <>
          <Centre>
            <svg width={940} height={800} viewBox="0 0 940 800">
              <Palm x={150} y={760} s={1.1} t={l} />
              <g transform={`translate(470 ${760 - pop(l, 0.1) * 0})`}>
                <path d="M-240 0 L-240 -300 L0 -480 L240 -300 L240 0 Z" fill="#fff" stroke={C.ink} strokeWidth={8} />
                <path d="M-290 -280 L0 -510 L290 -280" fill="none" stroke={C.coral} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" />
                <rect x={-50} y={-150} width={100} height={150} rx={10} fill={C.gold} stroke={C.ink} strokeWidth={6} />
              </g>
              <g transform={`translate(470 ${390}) rotate(${-4 + Math.sin(l * 3) * 2}) scale(${pop(l, 0.6)})`}>
                <rect x={-250} y={-60} width={500} height={120} rx={20} fill={C.leaf} stroke={C.ink} strokeWidth={7} />
                <text x={0} y={22} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={58} fill="#fff">KERALA RULES</text>
              </g>
            </svg>
          </Centre>
          <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 64, color: C.ink, opacity: pop(l, 0.1)}}>
            Rule no. <span style={{color: C.blue}}>1</span>
          </div>
        </>
      )}
    </Scene>

    {/* 2 · choru venno? chips please */}
    <Scene timing={T} from={2}>
      {(l) => (
        <>
          <div style={{position: 'absolute', left: 80, top: 360}}>
            <Bubble k={pop(l, 0.05)}>
              <Mal size={80}>ചോറ് വേണോ?</Mal>
              <Sub>Want rice?</Sub>
            </Bubble>
          </div>
          <div style={{position: 'absolute', right: 80, top: 630}}>
            <Bubble k={pop(l, 1.0)} tail="right" color={C.blue} ink="#fff">No thanks. Chips please.</Bubble>
          </div>
          <svg width={1080} height={480} viewBox="0 0 1080 480" style={{position: 'absolute', left: 0, top: 760}}>
            {/* rice plate, sliding away */}
            <g transform={`translate(${300 - lin(l, 1.3, 1.9) * 120} 240)`} opacity={1 - lin(l, 1.3, 1.9) * 0.6}>
              <ellipse rx={210} ry={70} fill="#fff" stroke={C.ink} strokeWidth={7} />
              <ellipse cy={-20} rx={140} ry={60} fill="#FBFBF7" stroke={C.ink} strokeWidth={5} />
              {Array.from({length: 26}, (_, i) => <ellipse key={i} cx={-110 + (i % 9) * 27} cy={-40 + Math.floor(i / 9) * 20} rx={9} ry={4} fill="#E8E4D8" />)}
            </g>
            {/* chips, sliding in */}
            <g transform={`translate(${780 + (1 - pop(l, 1.2)) * 300} 250)`}>
              {[-60, -30, 0, 30, 60].map((dx, i) => <rect key={i} x={dx - 10} y={-150 + (i % 2) * 20} width={22} height={140} rx={6} fill={C.gold} stroke={C.ink} strokeWidth={4} transform={`rotate(${dx / 6} ${dx} -40)`} />)}
              <path d="M-110 -40 L110 -40 L80 110 L-80 110 Z" fill={C.red} stroke={C.ink} strokeWidth={7} />
              <text y={50} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={40} fill="#fff">CHIPS</text>
            </g>
          </svg>
        </>
      )}
    </Scene>

    {/* 3 · very polite, wrong language */}
    <Scene timing={T} from={3}>
      {(l) => (
        <Centre>
          <div style={{display: 'flex', flexDirection: 'column', gap: 40}}>
            {[['Polite', true, 0.1], ['Malayalam', false, 0.8]].map(([w, ok, at]) => (
              <div key={w as string} style={{display: 'flex', alignItems: 'center', gap: 30, background: '#fff', border: `6px solid ${C.ink}`, boxShadow: `0 12px 0 ${C.ink}`, borderRadius: 36, padding: '24px 50px', scale: String(pop(l, at as number)), opacity: pop(l, at as number)}}>
                <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 110, color: C.ink, width: 600}}>{w as string}</div>
                {ok ? <Tick size={150} k={lin(l, (at as number) + 0.2, (at as number) + 0.6)} /> : <Cross size={150} k={lin(l, (at as number) + 0.2, (at as number) + 0.7)} />}
              </div>
            ))}
          </div>
        </Centre>
      )}
    </Scene>

    {/* 4 · please, thank you, cheers */}
    <Scene timing={T} from={4}>
      {(l) => {
        const ws = T.words.filter((w) => w.line === 4);
        const at = (k: number) => (ws[Math.min(k, ws.length - 1)]?.s ?? T.lineStarts[4]) - T.lineStarts[4];
        const items: [string, number, number, number][] = [['Please', at(0), 90, 420], ['Thank you', at(1), 360, 640], ['Cheers!', at(3) || at(2), 160, 880]];
        return (
          <>
            {items.map(([w, a, x, y], i) => (
              <div key={w} style={{position: 'absolute', left: x, top: y, rotate: `${[-4, 3, -2][i]}deg`}}>
                <Bubble k={pop(l, a - 0.05)} tail={i === 1 ? 'right' : 'left'} color={[C.blue, '#fff', C.coral][i]} ink={i === 1 ? C.ink : '#fff'} style={{fontSize: 96}}>{w}</Bubble>
              </div>
            ))}
          </>
        );
      }}
    </Scene>

    {/* 5 · all in English, every time */}
    <Scene timing={T} from={5}>
      {(l) => (
        <>
          <Pill t={l} text="LANGUAGE CHECK" />
          <Centre>
            <div style={{width: 860, display: 'flex', flexDirection: 'column', gap: 44}}>
              {[['English', C.blue, 1], ['Malayalam', C.coral, 0]].map(([n, c, v], i) => (
                <div key={n as string}>
                  <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 60, color: C.ink, marginBottom: 14, display: 'flex', justifyContent: 'space-between'}}>
                    <span>{n as string}</span>
                    <span style={{color: c as string}}>{Math.round(lin(l, 0.3 + i * 0.2, 1.8) * (v as number) * 100)}%</span>
                  </div>
                  <div style={{height: 90, borderRadius: 45, border: `6px solid ${C.ink}`, background: '#fff', overflow: 'hidden'}}>
                    <div style={{height: '100%', width: `${lin(l, 0.3 + i * 0.2, 1.8) * (v as number) * 100}%`, background: c as string}} />
                  </div>
                </div>
              ))}
              <div style={{textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: 80, color: C.blue, opacity: lin(l, 1.6, 2.0)}}>every single time</div>
            </div>
          </Centre>
        </>
      )}
    </Scene>

    {/* 6 · not giving up: a seedling, slowly by slowly */}
    <Scene timing={T} from={6}>
      {(l) => {
        const g = lin(l, 0.1, 1.6);
        return (
          <>
            <Pill t={l} text="NOT GIVING UP" color={C.leaf} />
            <Centre>
              <svg width={800} height={800} viewBox="0 0 800 800">
                <path d="M200 640 L600 640 L560 780 L240 780 Z" fill={C.coral} stroke={C.ink} strokeWidth={8} />
                <rect x={180} y={600} width={440} height={60} rx={14} fill={C.coral} stroke={C.ink} strokeWidth={8} />
                <path d={`M400 600 L400 ${600 - g * 330}`} stroke={C.leaf} strokeWidth={18} strokeLinecap="round" />
                <path d="M400 420 q-150 -40 -170 -160 q130 0 170 160" fill={C.leaf} stroke={C.ink} strokeWidth={6} transform={`translate(0 ${(1 - g) * 160}) scale(${g})`} style={{transformOrigin: '400px 420px'}} />
                <path d="M400 360 q150 -50 180 -170 q-140 10 -180 170" fill={C.leaf} stroke={C.ink} strokeWidth={6} transform={`translate(0 ${(1 - g) * 220}) scale(${lin(l, 0.6, 1.8)})`} style={{transformOrigin: '400px 360px'}} />
              </svg>
            </Centre>
          </>
        );
      }}
    </Scene>

    {/* 7 · one day he'll visit Kerala */}
    <Scene timing={T} from={7}>
      {(l) => {
        const p = lin(l, 0.2, 1.8);
        const bx = (u: number) => 180 + u * 640;
        const by = (u: number) => 560 - Math.sin(u * Math.PI) * 330;
        return (
          <>
            <Pill t={l} text="ONE DAY" color={C.sea} />
            <Centre>
              <svg width={1000} height={800} viewBox="0 0 1000 800">
                <path d={`M${bx(0)} ${by(0)} Q500 -100 ${bx(1)} ${by(1)}`} fill="none" stroke={C.mute} strokeWidth={8} strokeDasharray="4 22" strokeLinecap="round" />
                <circle cx={bx(0)} cy={by(0)} r={26} fill={C.blue} stroke={C.ink} strokeWidth={6} />
                <text x={bx(0)} y={by(0) + 90} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={54} fill={C.ink}>UK</text>
                <circle cx={bx(1)} cy={by(1)} r={26} fill={C.leaf} stroke={C.ink} strokeWidth={6} />
                <text x={bx(1)} y={by(1) + 90} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={54} fill={C.ink}>KERALA</text>
                <Palm x={bx(1) + 60} y={by(1) - 10} s={0.55} t={l} />
                <g transform={`translate(${bx(p)} ${by(p) - 30}) rotate(${(0.5 - p) * -60})`}>
                  <path d="M-70 0 L60 -10 Q90 0 60 10 Z" fill="#fff" stroke={C.ink} strokeWidth={6} />
                  <path d="M-10 -4 L-40 -60 L-10 -60 L30 -6 Z" fill={C.blue} stroke={C.ink} strokeWidth={5} />
                  <path d="M-10 4 L-40 60 L-10 60 L30 6 Z" fill={C.blue} stroke={C.ink} strokeWidth={5} />
                  <path d="M-60 -2 L-80 -34 L-64 -34 L-46 -2 Z" fill={C.coral} stroke={C.ink} strokeWidth={4} />
                </g>
              </svg>
            </Centre>
          </>
        );
      }}
    </Scene>

    {/* 8–9 · understand every word the family says */}
    <Scene timing={T} from={8} to={9}>
      {(l) => {
        const lines: [string, string, number, number, number][] = [
          ['സുഖമാണോ?', 'Are you well?', 90, 380, 0.2],
          ['വാ മോനേ', 'Come here, son', 560, 520, 0.9],
          ['ചോറ് ഉണ്ടോ?', 'Have you eaten?', 140, 700, 1.6],
        ];
        return (
          <>
            {lines.map(([ml, en, x, y, a], i) => (
              <div key={i} style={{position: 'absolute', left: x, top: y}}>
                <Bubble k={pop(l, a)} tail={i === 1 ? 'right' : 'left'} style={{padding: '22px 36px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
                    <div>
                      <Mal size={62}>{ml}</Mal>
                      <Sub>{en}</Sub>
                    </div>
                    <Tick size={70} k={lin(l, a + 0.9, a + 1.3)} />
                  </div>
                </Bubble>
              </div>
            ))}
            <svg width={300} height={330} viewBox="0 0 300 330" style={{position: 'absolute', left: 700, top: 880}}>
              <Person x={150} y={190} scale={1.2} color={C.coral} kid />
            </svg>
          </>
        );
      }}
    </Scene>

    {/* 10 · CTA */}
    <Scene timing={T} from={10}>
      {(l) => (
        <>
          <Pill t={l} text="UK MALLU PARENTS" color={C.coral} />
          <Centre>
            <div style={{display: 'flex', flexDirection: 'column', gap: 46, alignItems: 'center'}}>
              {['MALAYALAM', 'ENGLISH'].map((w, i) => (
                <div key={w} style={{fontFamily: SANS, fontWeight: 800, fontSize: 104, color: '#fff', background: i ? C.blue : C.leaf, border: `6px solid ${C.ink}`, boxShadow: `0 14px 0 ${C.ink}`, borderRadius: 40, padding: '26px 56px', scale: String(pop(l, 0.3 + i * 0.4) * (1 + 0.035 * Math.sin(l * 6 + i * 3)))}}>
                  {w}
                </div>
              ))}
              <Bubble k={pop(l, 1.6)}>Comment below</Bubble>
            </div>
          </Centre>
        </>
      )}
    </Scene>

    {/* 11 · loop back to the hook */}
    <Scene timing={T} from={11}>
      {(l) => {
        const cheersAt = (T.words.filter((w) => w.line === 11).pop()?.s ?? T.lineStarts[11] + 2) - T.lineStarts[11];
        return (
          <>
            <Pill t={l} text="STILL TRYING" />
            <div style={{position: 'absolute', left: 80, top: 430}}>
              <Bubble k={pop(l, 0.05)}>
                <Mal size={76}>മലയാളം പറ!</Mal>
                <Sub>Say it in Malayalam!</Sub>
              </Bubble>
            </div>
            <div style={{position: 'absolute', right: 80, top: 640}}>
              <Bubble k={pop(l, cheersAt - 0.1)} tail="right" color={C.blue} ink="#fff">Cheers!</Bubble>
            </div>
            <Pair l={l} kidBounce />
          </>
        );
      }}
    </Scene>
  </>
);

export const Reel6: React.FC = () => (
  <Canvas>
    <Audio src={staticFile('reel6_voice.wav')} />
    <Audio src={staticFile('reel6_sfx.wav')} volume={0.9} />
    <Reel6Scenes />
    <Captions timing={T} emphasis={['malayalam', 'cheers', 'kerala', 'rules', 'chips', 'polite', 'wrong', 'english', 'every', 'giving', 'understand', 'family', 'comment']} />
    <Footer />
  </Canvas>
);
