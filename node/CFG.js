import 'dotenv/config';

const CFG = Object.freeze({
  srcDir: process.argv[2] || process.env.SRC_DIR || './src/',
  outDir: process.argv[3] || process.env.OUT_DIR || './dist/',
  cacheDir: process.env.CACHE_DIR || './.CACHE/',
  processor: process.argv[4] || process.env.HANDLER_SCRIPT_PATH || 'jam-tools/node/build.js',
  
  aiApiKey: process.env.AI_API_KEY,
  aiOrgId: process.env.AI_ORG_ID,
  aiPort: process.env.AI_PORT,
});

export default CFG;

