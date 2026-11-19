import React from 'react';
import {Composition} from 'remotion';
import {Reel5, REEL5_SECONDS} from './Reel5';
import {Reel6, REEL6_SECONDS} from './Reel6';

export const Root: React.FC = () => (
  <>
    <Composition id="Reel5" component={Reel5} durationInFrames={Math.ceil(REEL5_SECONDS * 30)} fps={30} width={1080} height={1920} />
    <Composition id="Reel6" component={Reel6} durationInFrames={Math.ceil(REEL6_SECONDS * 30)} fps={30} width={1080} height={1920} />
  </>
);
