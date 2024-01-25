import ExpressAdapter from './application/adapters/ExpressAdapter';
import * as dotenv from 'dotenv';

import OrderRoute from './infrastructure/api/order.route';
import ProductRoute from './infrastructure/api/product.route';
import AWSSQSAdapter from './application/adapters/AWSSqsAdapter';

dotenv.config();
const server = new ExpressAdapter();

const productRoute = new ProductRoute(server);
const orderRoute = new OrderRoute(server);

server.router(OrderRoute);
server.router(ProductRoute);

server.listen(3000);
const queueService = AWSSQSAdapter.getInstance();
