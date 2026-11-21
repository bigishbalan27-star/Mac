// Cartoon presenter (me, in navy nurse scrubs), lip-synced to the voice.
// Mouth comes from per-frame audio analysis (open amount + roundness), the
// hand pose from the script (finger count on "Number N", palm, chest, point).
import React from 'react';
import {interpolate} from 'remotion';

export type Pose = 'palm' | 'count' | 'chest' | 'down' | 'thumb' | 'think';

const SKIN = '#B9784C';
const SKIN_LIGHT = '#CB8D60';
const SKIN_DARK = '#9A5F3A';
const HAIR = '#17110D';
const SCRUB = '#1E3557';
const SCRUB_LIGHT = '#2B4A78';
const SCRUB_DARK = '#142540';

/** Hand drawn at the wrist origin, pointing up; `fingers` 0-5 raised. */
const Hand: React.FC<{fingers: number; palm?: boolean; thumbUp?: boolean}> = ({fingers, palm, thumbUp}) => {
  if (thumbUp) {
    return (
      <g>
        <rect x={-34} y={-58} width={68} height={62} rx={24} fill={SKIN} stroke={SKIN_DARK} strokeWidth={3} />
        <rect x={-14} y={-108} width={26} height={60} rx={13} fill={SKIN_LIGHT} stroke={SKIN_DARK} strokeWidth={3} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M-30 ${-46 + i * 13} h52`} stroke={SKIN_DARK} strokeWidth={2.5} strokeLinecap="round" opacity={0.6} />)}
      </g>
    );
  }
  const lens = [70, 80, 76, 64];
  const xs = [-30, -11, 8, 26];
  return (
    <g>
      <path d="M-40 -40 Q-44 8 -16 10 L22 10 Q42 6 40 -40 Z" fill={SKIN} stroke={SKIN_DARK} strokeWidth={3} />
      {xs.map((x, i) => {
        const up = palm || i < Math.min(fingers, 4);
        const h = up ? lens[i] : 18;
        return <rect key={i} x={x - 9} y={-40 - h + 10} width={18} height={h} rx={9} fill={up ? SKIN_LIGHT : SKIN} stroke={SKIN_DARK} strokeWidth={3} />;
      })}
      {palm || fingers >= 5 ? (
        <rect x={-56} y={-44} width={20} height={54} rx={10} fill={SKIN_LIGHT} stroke={SKIN_DARK} strokeWidth={3} transform="rotate(-28 -40 4)" />
      ) : (
        <rect x={-38} y={-30} width={40} height={18} rx={9} fill={SKIN_LIGHT} stroke={SKIN_DARK} strokeWidth={3} />
      )}
    </g>
  );
};

/** Arm angles per pose. a1 = upper arm from straight down (clockwise +), a2 = forearm
 *  relative to it; a1 + a2 near 180 holds the forearm upright beside the face. */
export const poseAngles = (pose: Pose, sway = 0) => {
  switch (pose) {
    case 'count': return {a1: 32 + sway * 3, a2: 142, handRot: 4};
    case 'palm': return {a1: 38 + sway * 6, a2: 70 + sway * 10, handRot: 20 + sway * 8};
    case 'chest': return {a1: 8, a2: -118, handRot: -10};
    case 'down': return {a1: 34, a2: 18 + sway * 4, handRot: 0};
    case 'thumb': return {a1: 32, a2: 142, handRot: 4};
    case 'think': return {a1: 14, a2: 176, handRot: 10};
  }
};

/** Upper arm + forearm + hand. Angles in degrees; 0 = straight down. */
const Arm: React.FC<{sx: number; sy: number; a1: number; a2: number; hand: React.ReactNode; handRot?: number}> = ({sx, sy, a1, a2, hand, handRot = 0}) => (
  <g transform={`translate(${sx} ${sy}) rotate(${a1})`}>
    <rect x={-34} y={-10} width={68} height={150} rx={34} fill={SCRUB} stroke={SCRUB_DARK} strokeWidth={4} />
    <g transform={`translate(0 130) rotate(${a2})`}>
      <rect x={-24} y={-6} width={48} height={124} rx={24} fill={SKIN} stroke={SKIN_DARK} strokeWidth={3} />
      <g transform={`translate(0 118) rotate(${180 + handRot})`}>{hand}</g>
    </g>
  </g>
);

export const Avatar: React.FC<{
  open: number; // 0..1 mouth opening
  round: number; // 0..1 how rounded (O/U) vs wide (E/I)
  blink: number; // 0..1 eyelid closed
  pose: Pose;
  fingers: number;
  sway: number; // -1..1 gesture motion
  tilt: number; // head tilt degrees
  bob: number; // px
  brow: number; // 0..1 raised
  gaze: number; // -1 (look left at content) .. 1
  wink?: number;
  arm?: {a1: number; a2: number; handRot: number};
}> = ({open, round, blink, pose, fingers, sway, tilt, bob, brow, gaze, wink = 0, arm}) => {
  const mw = interpolate(round, [0, 1], [62, 34]) + open * 6;
  const mh = 4 + open * interpolate(round, [0, 1], [34, 40]);
  const lid = Math.max(blink, 0);
  const gx = gaze * 5;

  const ang = arm ?? poseAngles(pose, sway);
  const {a1, a2, handRot} = ang;
  const hand: React.ReactNode = pose === 'thumb' ? <Hand fingers={0} thumbUp /> : pose === 'count' ? <Hand fingers={fingers} /> : pose === 'down' || pose === 'think' ? <Hand fingers={1} /> : <Hand fingers={0} palm />;

  return (
    <svg viewBox="0 0 620 780" width={620} height={780} style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id="scrub" x1="0" x2="1">
          <stop offset="0" stopColor={SCRUB_LIGHT} />
          <stop offset="0.55" stopColor={SCRUB} />
          <stop offset="1" stopColor={SCRUB_DARK} />
        </linearGradient>
        <radialGradient id="face" cx="0.42" cy="0.38" r="0.7">
          <stop offset="0" stopColor={SKIN_LIGHT} />
          <stop offset="0.7" stopColor={SKIN} />
          <stop offset="1" stopColor={SKIN_DARK} />
        </radialGradient>
        <linearGradient id="hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A1F18" />
          <stop offset="1" stopColor={HAIR} />
        </linearGradient>
      </defs>

      <g transform="translate(430 470) rotate(-14)">
        <rect x={-34} y={-10} width={68} height={190} rx={34} fill={SCRUB_DARK} />
      </g>

      <g transform={`translate(0 ${bob * 0.4})`}>
        <path d="M120 780 Q118 560 190 482 Q240 440 310 436 Q380 440 430 482 Q502 560 500 780 Z" fill="url(#scrub)" stroke={SCRUB_DARK} strokeWidth={4} />
        <path d="M262 452 L310 540 L358 452" fill={SKIN} stroke={SCRUB_DARK} strokeWidth={6} strokeLinejoin="round" />
        <path d="M250 446 L310 556 L370 446" fill="none" stroke={SCRUB_LIGHT} strokeWidth={10} strokeLinejoin="round" />
        <rect x={360} y={590} width={84} height={70} rx={8} fill={SCRUB_DARK} opacity={0.55} />
        <rect x={378} y={566} width={10} height={40} rx={4} fill="#E8E8E8" />
        <rect x={394} y={572} width={10} height={34} rx={4} fill="#C6F432" />
        <g transform="translate(180 600) rotate(-6)">
          <rect x={0} y={0} width={70} height={92} rx={10} fill="#F4F4F2" />
          <rect x={10} y={12} width={50} height={36} rx={6} fill={SKIN_LIGHT} />
          <text x={35} y={76} textAnchor="middle" fontFamily="ReelSans" fontWeight={800} fontSize={22} fill={SCRUB}>RN</text>
        </g>
      </g>

      <path d={`M272 ${380 + bob * 0.6} L272 460 Q310 478 348 460 L348 ${380 + bob * 0.6} Z`} fill={SKIN_DARK} />

      <g transform={`translate(310 ${260 + bob}) rotate(${tilt})`}>
        <ellipse cx={-118} cy={8} rx={22} ry={34} fill={SKIN} stroke={SKIN_DARK} strokeWidth={3} />
        <ellipse cx={118} cy={8} rx={22} ry={34} fill={SKIN} stroke={SKIN_DARK} strokeWidth={3} />
        <path d="M-112 -40 Q-114 70 -66 118 Q-30 150 0 152 Q30 150 66 118 Q114 70 112 -40 Q100 -140 0 -144 Q-100 -140 -112 -40 Z" fill="url(#face)" stroke={SKIN_DARK} strokeWidth={3} />
        <path d="M-118 -20 Q-128 -110 -70 -150 Q-10 -190 60 -170 Q128 -150 122 -60 Q118 -36 112 -18 Q104 -80 70 -96 Q30 -112 -20 -104 Q-72 -98 -96 -64 Q-108 -44 -118 -20 Z" fill="url(#hair)" />
        <path d="M-60 -150 Q0 -196 80 -160 Q40 -168 -10 -150 Z" fill="#3A2C22" opacity={0.7} />
        <g transform={`translate(0 ${-brow * 10})`}>
          <path d="M-82 -48 Q-56 -64 -26 -52" stroke={HAIR} strokeWidth={11} fill="none" strokeLinecap="round" />
          <path d="M26 -52 Q56 -64 82 -48" stroke={HAIR} strokeWidth={11} fill="none" strokeLinecap="round" />
        </g>
        {[-54, 54].map((x, i) => {
          const w = i === 1 ? Math.max(lid, wink) : lid;
          const h = 15 * (1 - w);
          return (
            <g key={x}>
              <ellipse cx={x} cy={-14} rx={24} ry={Math.max(1.5, h)} fill="#FFFFFF" />
              {h > 4 && (
                <g>
                  <circle cx={x + gx} cy={-13} r={Math.min(11, h)} fill="#3B2416" />
                  <circle cx={x + gx} cy={-13} r={Math.min(5.5, h * 0.5)} fill="#0B0705" />
                  <circle cx={x + gx + 4} cy={-17} r={3} fill="#FFFFFF" />
                </g>
              )}
              <path d={`M${x - 26} ${-14 - h} Q${x} ${-14 - h - 8} ${x + 26} ${-14 - h}`} stroke={SKIN_DARK} strokeWidth={4} fill="none" strokeLinecap="round" />
            </g>
          );
        })}
        <path d="M-6 0 Q-14 40 -18 52 Q-2 62 16 52" stroke={SKIN_DARK} strokeWidth={5} fill="none" strokeLinecap="round" />
        <g transform="translate(0 92)">
          {open < 0.06 ? (
            <path d={`M${-mw / 2} 0 Q0 ${10} ${mw / 2} 0`} stroke="#5A2A1C" strokeWidth={6} fill="none" strokeLinecap="round" />
          ) : (
            <g>
              <ellipse cx={0} cy={mh / 2 - 4} rx={mw / 2} ry={mh / 2 + 4} fill="#3A1410" />
              <rect x={-mw / 2 + 6} y={-6} width={mw - 12} height={Math.min(12, mh * 0.4)} rx={4} fill="#F7F3EC" />
              <ellipse cx={0} cy={mh - 4} rx={mw * 0.28} ry={Math.max(2, mh * 0.18)} fill="#C2504A" />
              <ellipse cx={0} cy={mh / 2 - 4} rx={mw / 2} ry={mh / 2 + 4} fill="none" stroke="#5A2A1C" strokeWidth={5} />
            </g>
          )}
        </g>
      </g>

      <Arm sx={170} sy={500} a1={a1} a2={a2} hand={hand} handRot={handRot} />
    </svg>
  );
};
