import { createAppRouter } from 'router/routes';

describe('App Routes', () => {
  it('should have service-flow and not-found routes', async () => {
    const router = createAppRouter();
    const routes = router.getRoutes();
    const routeNames = routes.map((route) => route.name);

    expect(routeNames).toContain('serviceflow');
    expect(routeNames).toContain('not-found');
  });

  it('should have a 404 not-found route', async () => {
    const router = createAppRouter();
    const routes = router.getRoutes();
    const notFoundRoute = routes.find((route) => route.name === 'not-found');

    expect(notFoundRoute?.path).toBe('/:pathMatch(.*)*');
  });
});
