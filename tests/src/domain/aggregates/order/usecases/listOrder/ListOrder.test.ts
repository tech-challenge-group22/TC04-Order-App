import { OrderGatewayInterface } from '../../../../../../../src/domain/aggregates/order/interfaces/gateways/OrderGatewayInterface';
import { ListOrderUseCase } from '../../../../../../../src/domain/aggregates/order/usecases/listOrder/ListOrder';

const getOrdersMock = [
  {
    id: 6,
    order_date: '2024-01 - 25T18:01:02.000Z',
    order_total: 4.9,
    customer_id: 1,
    order_status: 1,
    order_items:
      '[{"qty": 1, "item": "Coca-cola", "price": 4.900000095367432}]',
  },
  {
    id: 5,
    order_date: '2024-01 - 26T17: 47: 58.000Z',
    order_total: 5.9,
    customer_id: 1,
    order_status: 2,
    order_items:
      '[{"qty": 1, "item": "Coca-cola", "price": 5.900000095367432}]',
  },
  {
    id: 7,
    order_date: '2024-01 - 26T18:01:02.000Z',
    order_total: 5.9,
    customer_id: 1,
    order_status: 1,
    order_items:
      '[{"qty": 1, "item": "Coca-cola", "price": 5.900000095367432}]',
  },
  {
    id: 8,
    order_date: '2024-01 - 26T18:04: 29.000Z',
    order_total: 5.9,
    customer_id: 1,
    order_status: 4,
    order_items:
      '[{"qty": 1, "item": "Coca-cola", "price": 5.900000095367432}]',
  },
];

const orderGatewayMock: OrderGatewayInterface = {
  getOrders: jest.fn().mockResolvedValue(getOrdersMock),
  newOrder: jest.fn(),
  updateOrderStatus: jest.fn(),
  insertOrderItems: jest.fn(),
  beginTransaction: jest.fn(),
  commit: jest.fn(),
  rollback: jest.fn(),
  getItemPrices: jest.fn(),
};

describe('ListOrderUseCase', () => {
  it('should return a list of orders with 3 order and success status', async () => {
    const result = await ListOrderUseCase.execute({}, orderGatewayMock);

    expect(result.result?.length).toBe(3);
    expect(result.hasError).toBe(false);
  });

  it('should return one order with success status', async () => {
    const orderGatewayOneOrderMock: OrderGatewayInterface = {
      ...orderGatewayMock,
      getOrders: jest.fn().mockResolvedValue([
        {
          id: 6,
          order_date: '2024-01 - 25T18:01:02.000Z',
          order_total: 4.9,
          customer_id: 1,
          order_status: 1,
          order_items:
            '[{"qty": 1, "item": "Coca-cola", "price": 4.900000095367432}]',
        },
      ]),
    };

    const result = await ListOrderUseCase.execute(
      { id: 6 },
      orderGatewayOneOrderMock,
    );

    expect(result.result?.length).toBe(1);
    expect(result.hasError).toBe(false);
  });

  it('should return an empty list of order when not found id 50', async () => {
    const orderGatewayEmptyMock: OrderGatewayInterface = {
      ...orderGatewayMock,
      getOrders: jest.fn().mockResolvedValue([]),
    };

    const result = await ListOrderUseCase.execute(
      { id: 50 },
      orderGatewayEmptyMock,
    );

    expect(result.message).toBe(
      'Order 50 not found. Please, certity that it is a valid Order Number!',
    );
    expect(result.hasError).toBe(true);
    expect(result.httpCode).toBe(404);
  });

  it('should return an empty list of order when not found without id', async () => {
    const orderGatewayEmptyMock: OrderGatewayInterface = {
      ...orderGatewayMock,
      getOrders: jest.fn().mockResolvedValue([]),
    };

    const result = await ListOrderUseCase.execute({}, orderGatewayEmptyMock);

    expect(result.message).toBe(
      'Ops, No Orders found. Something went wrong... :(',
    );
    expect(result.hasError).toBe(true);
    expect(result.httpCode).toBe(404);
  });

  it('should return error in database connection', async () => {
    const orderGatewayEmptyMock: OrderGatewayInterface = {
      ...orderGatewayMock,
      getOrders: jest.fn(() => {
        throw new Error('Erro mockado');
      }),
    };

    const result = await ListOrderUseCase.execute({}, orderGatewayEmptyMock);

    expect(result.message).toBe('Erro mockado');
    expect(result.hasError).toBe(true);
  });
});
