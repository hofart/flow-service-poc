import { serviceFlowHandlers } from 'modules/service-flow/__mocks__/handlers/serviceFlow';
import { setupWorker } from 'msw/browser';
import { isMockEnabled } from 'shared/utils/mock';

export const worker = setupWorker(...serviceFlowHandlers);

export const initMsw = async () => {
  if (isMockEnabled()) {
    const { worker } = await import('core/msw');
    await worker.start({
      serviceWorker: { url: '/mockServiceWorker.js' },
      onUnhandledRequest: 'bypass',
    });
  }
};
