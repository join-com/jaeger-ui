import { chromium } from 'playwright';

const generate = async (url, data, opts = {}) => {
  const { type, label } = opts;

  const width = parseInt(opts.width, 10);
  const height = parseInt(opts.height, 10);

  const browser = await chromium.launch(opts.launcher);

  const page = await browser.newPage({
    viewport: {
      width,
      height,
    },
    screen: {
      width,
      height,
    },
  });

  await page.goto(url, {
    waitUntil: 'networkidle',
  });

  page.setDefaultTimeout(60000);

  await page.waitForSelector('#jaeger-ui-root');

  // eslint-disable-next-line no-shadow
  await page.evaluate(
    payload => {
      window.postMessage({ cmd: 'setTrace', payload }, '*');
    },
    { data, label }
  );

  await page.waitForSelector('.plexus');

  await page.waitForTimeout(1000);

  let result;

  if (type === 'pdf') {
    // https://playwright.dev/docs/api/class-page#page-pdf
    result = await page.pdf({
      printBackground: true,
      width,
      height,
    });
  } else {
    // https://playwright.dev/docs/api/class-page#page-screenshot
    result = await page.screenshot({
      type,
      clip: {
        x: 0,
        y: 0,
        width,
        height,
      },
      // omitBackground: true,
    });
  }

  await browser.close();

  return result;
};

export default generate;
