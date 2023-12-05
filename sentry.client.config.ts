// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import {CaptureConsole} from "@sentry/integrations";

Sentry.init({
  dsn: "https://f6fe003f096a1f008bc56c74224d86d6@o4505969852612608.ingest.sentry.io/4505971938492416",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  enabled: true,
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: true,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    new Sentry.Replay({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
    new CaptureConsole({
      levels: ['error', 'trace', 'warn', 'log', 'debug', 'info']
    })
  ],
});
