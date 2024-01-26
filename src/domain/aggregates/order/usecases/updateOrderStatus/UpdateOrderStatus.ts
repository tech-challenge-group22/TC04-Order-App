import IQueueService from '../../../../../application/ports/IQueueService';
import { OrderGatewayInterface } from '../../interfaces/gateways/OrderGatewayInterface';
import {
  UpdateOrderStatusDTO,
  UpdateOrderStatusParams,
} from './UpdateOrderStatusDTO';

export class UpdateOrderStatusUseCase {
  static async execute(
    params: UpdateOrderStatusParams,
    orderGateway: OrderGatewayInterface,
    queueService: IQueueService,
  ): Promise<UpdateOrderStatusDTO> {
    try {
      orderGateway.beginTransaction();

      if (params.status === 3) {
        const message = {
          order_id: params.order_id,
        };
        queueService.sendMessage({
          message,
          QueueOutputUrl: `${process.env.AWS_OUTPUT_ORDER_QUEUE_RECEIVED_URL}`,
          MessageGroupId: `${process.env.AWS_MESSAGE_GROUP}`,
        });
      }

      orderGateway.updateOrderStatus(params.order_id, params.status);

      orderGateway.commit();

      const result: UpdateOrderStatusDTO = {
        hasError: false,
        orderId: params.order_id,
        httpCode: 201,
        message: 'Status atualizado com sucesso',
      };
      return result;
    } catch (error) {
      const output: UpdateOrderStatusDTO = {
        orderId: 0,
        hasError: true,
        message: 'Error by inserting update order.',
        httpCode: 500,
      };

      return output;
    }
  }
}
