import OrderRoute from '../../../../src/infrastructure/api/order.route';
import ExpressAdapter from '../../../../src/application/adapters/ExpressAdapter';

const server = new ExpressAdapter();

describe('OrderRoute', () => {
  it('should get orders successfully', async () => {
    const orderRoute = new OrderRoute(server);
    const res = new Response();

    await orderRoute.routes();

    expect(res.status).toBe(200);
  });
});
