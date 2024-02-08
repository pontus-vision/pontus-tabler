// For more information, see https://crawlee.dev/
import { PlaywrightCrawler, ProxyConfiguration } from 'crawlee';

import { router } from './routes.js';

const startUrls = [
  'https://drive.google.com/drive/folders/1jRNQj96sWIRvfFmbaH0ZnISfogySeL5r',
//   'https://linktr.ee/exto_incorporadora',
];

const crawler = new PlaywrightCrawler({
  // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
  requestHandler: router,
  // Comment this option to scrape the full website.
  maxRequestsPerCrawl: 2000,
});

await crawler.run(startUrls);
