import { useObservability } from './useObservability';
import type { ErrorType } from 'shared/models/observability.interface';

export const useErrorHandler = () => {
  const { trackError } = useObservability();

  const handleError = (
    type: ErrorType,
    message: string,
    data?: Record<string, any>,
    error?: any
  ) => {
    trackError(type, { message, data, error });
  };

  return { handleError };
};
