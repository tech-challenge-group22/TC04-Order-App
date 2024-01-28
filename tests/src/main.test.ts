import ExpressAdapter from '../../src/application/adapters/ExpressAdapter';
import OrderRoute from '../../src/infrastructure/api/order.route';
import ProductRoute from '../../src/infrastructure/api/product.route';
import AWSSQSAdapter from '../../src/application/adapters/AWSSqsAdapter';

describe('server setup', () => {
  it('should create an Express server instance', () => {
    const server = new ExpressAdapter();
    expect(server).toBeInstanceOf(ExpressAdapter);
  });

  it('should create route instances', () => {
    const server = new ExpressAdapter();
    const productRoute = new ProductRoute(server);
    const orderRoute = new OrderRoute(server);

    expect(productRoute).toBeInstanceOf(ProductRoute);
    expect(orderRoute).toBeInstanceOf(OrderRoute);
  });

  it('should create an instance of AWSSQSAdapter', () => {
    const queueService = AWSSQSAdapter.getInstance();
    expect(queueService).toBeInstanceOf(AWSSQSAdapter);
  });
});
