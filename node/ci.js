import { build } from './build.js';
import { Log } from './Log.js';

try {
  await build().then(() => {
    process.exit(0);
  }).catch((e) => {
    Log.err(e.message);
    process.exit(1);
  });
} catch (e) {
  Log.err(e.message);
  process.exit(1);
}