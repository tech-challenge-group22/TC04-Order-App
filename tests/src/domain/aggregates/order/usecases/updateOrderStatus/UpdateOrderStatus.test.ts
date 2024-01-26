import IQueueService from '../../../../../../../src/application/ports/IQueueService';
import { OrderGatewayInterface } from '../../../../../../../src/domain/aggregates/order/interfaces/gateways/OrderGatewayInterface';
import { UpdateOrderStatusUseCase } from '../../../../../../../src/domain/aggregates/order/usecases/updateOrderStatus/UpdateOrderStatus';

const orderGatewayMock: OrderGatewayInterface = {
  getOrders: jest.fn(),
  newOrder: jest.fn(),
  updateOrderStatus: jest.fn(),
  insertOrderItems: jest.fn(),
  beginTransaction: jest.fn(),
  commit: jest.fn(),
  rollback: jest.fn(),
  getItemPrices: jest.fn(),
};

const mockQueueService: IQueueService = {
  sendMessage: jest.fn(),
  receiveMessagePaymentProcessed: jest.fn(),
  receiveMessageFinishOrder: jest.fn(),
  messageID: jest.fn(),
};

describe('UpdateOrderStatusUseCase', () => {
  it('should update a order with status 3', async () => {
    const result = await UpdateOrderStatusUseCase.execute(
      { order_id: 3, status: 3 },
      orderGatewayMock,
      mockQueueService,
    );

    expect(result.hasError).toBe(false);
    expect(result.orderId).toBe(3);
    expect(result.httpCode).toBe(201);
    expect(result.message).toBe('Status atualizado com sucesso');
  });

  it('should return error when update a order', async () => {
    const orderGatewayErrorMock: OrderGatewayInterface = {
      ...orderGatewayMock,
      updateOrderStatus: jest.fn(() => {
        throw new Error('Erro mockado');
      }),
    };
    const result = await UpdateOrderStatusUseCase.execute(
      { order_id: 1, status: 3 },
      orderGatewayErrorMock,
      mockQueueService,
    );

    expect(result.hasError).toBe(true);
    expect(result.orderId).toBe(0);
    expect(result.httpCode).toBe(500);
    expect(result.message).toBe('Error by inserting update order.');
  });
});
