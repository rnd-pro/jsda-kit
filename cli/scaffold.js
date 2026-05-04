import fs from 'fs';
import path from 'path';
import { Log } from '../node/Log.js';
import { execSync } from 'child_process';

export function scaffold() {
  try {
    Log.info('JSDA CLI:', 'Fetching template from https://github.com/rnd-pro/jsda-template...');
    execSync('npx -y degit rnd-pro/jsda-template .', { stdio: 'inherit' });

    if (fs.existsSync('./package.json')) {
      let folderName = path.basename(process.cwd());
      let pkgStr = fs.readFileSync('./package.json', 'utf8');
      let pkg = JSON.parse(pkgStr);
      pkg.name = folderName;
      pkg.version = '0.0.1';
      fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n', 'utf8');
      Log.success('JSDA CLI:', `Updated package.json project name to "${folderName}"`);
    }

    if (fs.existsSync('./package-lock.json')) {
      fs.unlinkSync('./package-lock.json');
    }

    let secretsDir = path.join(process.cwd(), 'secrets');
    if (!fs.existsSync(secretsDir)) {
      fs.mkdirSync(secretsDir, { recursive: true });
    }
    fs.writeFileSync(path.join(secretsDir, 'access.js'), 'export default \'\';\n', 'utf8');

    Log.success('JSDA CLI:', 'Project scaffolded successfully! Run `npm install` to get started.');
  } catch (e) {
    Log.err('JSDA CLI:', 'Failed to scaffold project from template: ' + e.message);
  }
}
