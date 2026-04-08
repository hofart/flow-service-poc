import { render, screen } from '@testing-library/vue';
import { vi } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';

vi.mock('shared/contexts/LanguageContext', () => ({
  LanguageProvider: {
    template: '<div><slot /></div>',
  },
  useLanguage: () => ({
    t: (key: string) => key,
    currentLanguage: 'PORTUGUESE',
  }),
}));

vi.mock('shared/contexts/SessionContext', () => ({
  SessionProvider: {
    template: '<div><slot /></div>',
  },
  useSession: () => ({
    isAuthenticated: true,
    user: null,
  }),
}));

const routes = [
  {
    path: '/',
    component: { template: '<div>Home</div>' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

describe('App', () => {
  it('should correctly root routes rendered', async () => {
    render(App, {
      global: {
        plugins: [router],
      },
    });

    await router.push('/');

    const text = screen.getByText('Home');

    expect(text).toBeInTheDocument();
  });
});
