import { build } from './build.js';
import { Log } from './Log.js';

try {
  await build({ pdf: process.env.JSDA_PDF === '1' }).then(() => {
    Log.success('JSDA build successful');
    process.exit(0);
  }).catch((e) => {
    Log.err('JSDA build error:', e.message);
    process.exit(1);
  });
} catch (e) {
  Log.err('JSDA CI error:', e.message);
  process.exit(1);
}
