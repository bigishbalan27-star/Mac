import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Avatar, Pose} from './Avatar';
import './kit';
const poses: [Pose, number, number, number][] = [['chest',0,0.1,0],['count',1,0.7,0.2],['count',3,0.5,0.9],['count',5,0.3,0.5],['palm',0,0.9,0.1],['down',0,0.4,0.6],['thumb',0,0,0],['think',0,0.2,0.8]];
export const AvatarTest: React.FC = () => (
  <AbsoluteFill style={{background: '#0B0B0D', display: 'flex', flexWrap: 'wrap'}}>
    {poses.map(([p,f,o,r],i) => <div key={i} style={{width: 540, height: 480, overflow: 'hidden', position: 'relative'}}><div style={{scale: '0.55', transformOrigin: '0 0', position: 'absolute', left: 130, top: 20}}><Avatar open={o} round={r} blink={i===6?0.9:0} pose={p} fingers={f} sway={0} tilt={i%2?3:-3} bob={0} brow={i===4?1:0} gaze={-0.6} wink={i===7?1:0} /></div></div>)}
  </AbsoluteFill>
);
