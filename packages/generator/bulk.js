import fs from 'fs/promises';
import childProcess from 'child_process';

async function run() {
  const files = await fs.readdir('input');

  for (const file of files) {
    if (file.endsWith('.json')) {
      const fileName = file.replace('.json', '');

      childProcess.execSync(
        `cat input/${file} | node ./cli.js --out-dir assets --filename "${fileName}"  --type png`
      );

      childProcess.execSync(
        `cat input/${file} | node ./cli.js --out-dir assets --filename "${fileName}" --type pdf`
      );
    }
  }
}

run();
