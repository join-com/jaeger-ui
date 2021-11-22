#!/usr/bin/env node
import meow from 'meow';
import fs from 'fs';
import path from 'path';
import ora from 'ora';
import getStdin from 'get-stdin';

import render from './index.mjs';

const absolute = (file = '') => (!file || path.isAbsolute(file) ? file : path.join(process.cwd(), file));

const getDateTime = () => {
  const now = new Date();
  const Y = now.getFullYear();
  const M = now.getMonth();
  const d = now.getDate();
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  return {
    date: [Y, M, d].join('-'),
    time: [h, m, s].join('.'),
  };
};

const cli = meow(
  `
  Usage
    $ jagger-generate-graph

  Options
    -d --out-dir    Directory to save file to
    -f --filename   Specify a custom output filename
    -w --width      Width of image (required)
    -h --height     Height of image (required)
    -t --type       Type of ouptut (png default) (pdf, jpeg or png)
    -l --label      Label for the image
    --launcher      Options for browser launcher in JSON format
`,
  {
    importMeta: import.meta,
    flags: {
      url: {
        type: 'string',
        default: 'http://localhost:3000/generate?uiEmbed=v0',
      },
      outDir: {
        type: 'string',
        alias: 'd',
      },
      filename: {
        type: 'string',
        alias: 'f',
      },
      width: {
        type: 'string',
        alias: 'w',
        isRequired: true,
        default: '10000',
      },
      height: {
        type: 'string',
        alias: 'h',
        isRequired: true,
        default: '10000',
      },
      type: {
        type: 'string',
        alias: 't',
        default: 'png',
      },
      label: {
        type: 'string',
        alias: 'l',
      },
      launcher: {
        type: 'string',
      },
    },
  }
);

const { url } = cli.flags;

const spinner = ora(`Rendering ${url}`).start();

const opts = Object.assign(
  {
    outDir: process.cwd(),
  },
  cli.flags
);

opts.outDir = absolute(opts.outDir);

// https://playwright.dev/docs/api/class-browsertype#browser-type-launch
if (opts.launcher) {
  opts.launcher = JSON.parse(opts.launcher);
}

const run = async () => {
  try {
    const data = await getStdin();
    const { date, time } = getDateTime();
    const fileName = `${opts.filename ? `${opts.filename}-` : ''}${date}-${time}`;
    const outFile = `${fileName}.${opts.type}`;
    const outPath = path.join(opts.outDir, outFile);

    const image = await render(url, JSON.parse(data), {
      label: fileName,
      ...opts,
    });

    const file = fs.createWriteStream(outPath);

    file.on('finish', () => {
      spinner.succeed(`File saved to ${outPath}`);
      process.exit();
    });

    file.on('error', err => {
      spinner.fail(`Error: ${err}`);
    });

    spinner.info(`Saving image ${opts.width}x${opts.height}`);

    file.write(image);
    file.end();
  } catch (err) {
    spinner.fail(`Error: ${err}`);
    process.exit(1);
  }
};

run();
