import {
  EnqueueLinksOptions,
  EnqueueStrategy,
  createPlaywrightRouter,
} from 'crawlee';

export const router = createPlaywrightRouter();

const enqueueConfig: EnqueueLinksOptions = {
  globs: [
    'https://.*github.com/**',
    'https://linktr.ee/**',
    'https://drive.google.com/**',
    'https://drive.usercontent.google.com/**'
  ],
  label: 'detail',
  strategy: EnqueueStrategy.All,
};

router.addDefaultHandler(async ({ enqueueLinks, log }) => {
  log.info(`enqueueing new URLs`);
  await enqueueLinks(enqueueConfig);
});

router.addHandler(
  'detail',
  async ({ enqueueLinks, request, page, log, pushData }) => {
    const title = await page.title();
    log.info(`${title}`, { url: request.loadedUrl });

    // router.addDefaultHandler(async ({ enqueueLinks, log }) => {
    //     log.info(`enqueueing new URLs`);
    //     await enqueueLinks({...enqueueConfig, globs: [request.loadedUrl!]});
    // });

    await enqueueLinks({
      ...enqueueConfig,
      baseUrl: request.loadedUrl!,
      exclude: [
        'https://linktr.ee/s/**',
        'https://linktr.ee/marketplace/**',
        'https://linktr.ee/register/**',
        'https://linktr.ee/blog/**',
        'https://linktr.ee/login/**',
        'https://linktr.ee/help/**',
        'https://linktr.ee/creator-report/**',
        'https://linktr.ee/admin',
        'https://linktr.ee/mechanicallyincleyend/**',
        'https://linktr.ee/discover/**',
      ],
    });

    await pushData({
      url: request.loadedUrl,
      title,
      data: await page.content(),
    });
  },
);

// router.addHandler(EnqueueStrategy.All,async ({ enqueueLinks, request, log }) => {
//     log.info(`enqueueing new URL ${request.loadedUrl}`);
//     await enqueueLinks({...enqueueConfig, baseUrl: request.loadedUrl });

// })
