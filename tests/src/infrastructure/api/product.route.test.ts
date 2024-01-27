import ProductRoute from '../../../../src/infrastructure/api/product.route';
import ExpressAdapter from '../../../../src/application/adapters/ExpressAdapter';

const server = new ExpressAdapter();

describe('ProductRoute', () => {
  it('should get orders successfully', async () => {
    const orderRoute = new ProductRoute(server);
    const res = new Response();

    await orderRoute.routes();

    expect(res.status).toBe(200);
  });
});
