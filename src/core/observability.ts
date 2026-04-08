import { VITE_SENTRY_DSN } from 'shared/constants/variables';
import * as Sentry from '@sentry/vue';
import type { App } from 'vue';

export const initObservability = (app: App, router: any) => {
  const dsn = VITE_SENTRY_DSN;

  if (!dsn) {
    console.warn(
      'VITE_SENTRY_DSN not configured, observability will not be initialized'
    );
    return;
  }

  Sentry.init({
    app,
    dsn,
    environment: import.meta.env.MODE,
    sendDefaultPii: true,
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,
    beforeSend(event) {
      return event;
    },
  });
};
