import fs from 'fs';

export function getExternalDeps() {
  let pkg = JSON.parse(fs.readFileSync('./package.json').toString());
  return Object.keys(pkg?.dependencies || []);
}