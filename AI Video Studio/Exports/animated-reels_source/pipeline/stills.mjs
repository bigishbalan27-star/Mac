import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'fs';
const [,, id, framesFile, prefix] = process.argv;
const frames = fs.readFileSync(framesFile, 'utf8').trim().split(/\s+/).map(Number);
const serveUrl = await bundle({entryPoint: 'src/index.ts'});
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const composition = await selectComposition({serveUrl, id, browserExecutable});
for (const [i, frame] of frames.entries()) {
  await renderStill({serveUrl, composition, frame, output: `stills/${prefix}_${String(i).padStart(2, '0')}.png`, scale: 0.4, browserExecutable, chromiumOptions: {gl: 'swangle'}});
}
console.log('done', frames.length);
