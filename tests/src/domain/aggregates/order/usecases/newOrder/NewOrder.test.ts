import IQueueService from '../../../../../../../src/application/ports/IQueueService';
import { IOrderItem } from '../../../../../../../src/domain/aggregates/order/interfaces/IOrderItem';
import { OrderGatewayInterface } from '../../../../../../../src/domain/aggregates/order/interfaces/gateways/OrderGatewayInterface';
import { NewOrderUseCase } from '../../../../../../../src/domain/aggregates/order/usecases/newOrder/NewOrder';

const itemPrices = [
  {
    id: 1,
    item_price: 11.99,
  },
];

const orderItemsMock: IOrderItem[] = [
  {
    order_id: 1,
    item_id: 2,
    order_item_qtd: 5,
  },
];

const orderGatewayMock: OrderGatewayInterface = {
  getOrders: jest.fn(),
  newOrder: jest.fn().mockResolvedValue(60),
  updateOrderStatus: jest.fn(),
  insertOrderItems: jest.fn(),
  beginTransaction: jest.fn(),
  commit: jest.fn(),
  rollback: jest.fn(),
  getItemPrices: jest.fn().mockResolvedValue(itemPrices),
};

const mockQueueService: IQueueService = {
  sendMessage: jest.fn(),
  receiveMessagePaymentProcessed: jest.fn(),
  receiveMessageFinishOrder: jest.fn(),
  messageID: jest.fn(),
};

describe('NewOrderUseCase', () => {
  it('should add a new order and return with not identified customer success', async () => {
    const result = await NewOrderUseCase.execute(
      { order_items: orderItemsMock, payment_method: 1 },
      orderGatewayMock,
      mockQueueService,
    );
    expect(result.hasError).toBe(false);
    expect(result.orderId).toBe(60);
    expect(result.httpCode).toBe(201);
  });

  it('should add a new order and return with identified customer success', async () => {
    const result = await NewOrderUseCase.execute(
      { order_items: orderItemsMock, customer_id: 3, payment_method: 1 },
      orderGatewayMock,
      mockQueueService,
    );
    expect(result.hasError).toBe(false);
    expect(result.orderId).toBe(60);
    expect(result.httpCode).toBe(201);
  });

  it('should return error in database connection', async () => {
    const orderGatewayErrorMock: OrderGatewayInterface = {
      ...orderGatewayMock,
      newOrder: jest.fn(() => {
        throw new Error('Erro mockado');
      }),
    };

    const result = await NewOrderUseCase.execute(
      { order_items: orderItemsMock, customer_id: 1, payment_method: 1 },
      orderGatewayErrorMock,
      mockQueueService,
    );
    expect(result.hasError).toBe(true);
    expect(result.orderId).toBe(0);
    expect(result.httpCode).toBe(500);
    expect(result.message).toBe(
      'Error by inserting a new order. Please, check your data.',
    );
  });
});
