// Gateways
import { MySQLOrderRepository } from '../gateways/OrderRepository';

// DTOS
import {
  ListOrderInputDTO,
  ListOrderOutputDTO,
} from '../usecases/listOrder/ListOrderDTO';
import {
  NewOrderInputDTO,
  NewOrderOutputDTO,
} from '../usecases/newOrder/NewOrderDTO';

// UseCases
import { ListOrderUseCase } from '../usecases/listOrder/ListOrder';
import { NewOrderUseCase } from '../usecases/newOrder/NewOrder';

// Adapters
import AWSSQSAdapter from '../../../../application/adapters/AWSSqsAdapter';
import { UpdateOrderStatusUseCase } from '../usecases/updateOrderStatus/UpdateOrderStatus';
import { UpdateOrderStatusDTO } from '../usecases/updateOrderStatus/UpdateOrderStatusDTO';

export class OrderController {
  static async getOrders(searchId?: number): Promise<ListOrderOutputDTO> {
    const orderGateway = new MySQLOrderRepository();
    const input: ListOrderInputDTO = {
      id: searchId,
    };
    return await ListOrderUseCase.execute(input, orderGateway);
  }

  static async newOrder(
    body: NewOrderInputDTO,
  ): Promise<ListOrderOutputDTO | null> {
    const orderGateway = new MySQLOrderRepository();
    const queuService = AWSSQSAdapter.getInstance();

    let output: NewOrderOutputDTO = await NewOrderUseCase.execute(
      body,
      orderGateway,
      queuService,
    );

    if (!output.hasError) {
      const input: ListOrderInputDTO = {
        id: output.orderId,
      };
      const outputList: ListOrderOutputDTO = await ListOrderUseCase.execute(
        input,
        orderGateway,
      );
      return outputList;
    } else {
      return output;
    }
  }

  static async updateOrderStatus(params: { order_id: number; status: number }) {
    const orderGateway = new MySQLOrderRepository();
    const queuService = AWSSQSAdapter.getInstance();
    const output: UpdateOrderStatusDTO = await UpdateOrderStatusUseCase.execute(
      params,
      orderGateway,
      queuService,
    );
    return output;
  }
}
