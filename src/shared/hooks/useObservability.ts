import * as Sentry from '@sentry/vue';
import type {
  ErrorType,
  ErrorPayload,
} from 'shared/models/observability.interface';

export const useObservability = () => {
  const trackError = (type: ErrorType, payload: ErrorPayload) => {
    Sentry.addBreadcrumb({
      message: payload.message,
      category: type,
      data: payload.data,
      level: 'error',
    });

    if (payload.error instanceof Error) {
      Sentry.captureException(payload.error);
    } else {
      Sentry.captureMessage(payload.message, 'error');
    }
  };

  return { trackError };
};
