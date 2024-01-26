// DTOs
import { NewOrderInputDTO, NewOrderOutputDTO } from './NewOrderDTO';

// Interfaces
import { IOrderItem } from '../../interfaces/IOrderItem';

// Gateways
import { OrderGatewayInterface } from '../../interfaces/gateways/OrderGatewayInterface';

// Entities
import { OrderEntity } from '../../core/entities/OrderEntity';
import { OrderItemEntity } from '../../core/entities/OrderItemEntity';

import IQueueService from '../../../../../application/ports/IQueueService';

export class NewOrderUseCase {
  static async execute(
    body: NewOrderInputDTO,
    orderGateway: OrderGatewayInterface,
    queueService: IQueueService,
  ): Promise<NewOrderOutputDTO> {
    let _order: OrderEntity;
    let _orderItems: OrderItemEntity[] = [];

    try {
      const { customer_id, order_items } = body;

      _orderItems = await this.loadItemPrices(orderGateway, body.order_items);
      _order = new OrderEntity(body.customer_id, _orderItems);
      const order_total = _order.totalOrderPrice();

      orderGateway.beginTransaction();

      let order_id = await orderGateway.newOrder(
        customer_id ?? 1,
        order_total,
        1,
      );

      //insert order_items
      const formated_order_items = NewOrderUseCase.formatOrderItems(
        order_id,
        order_items,
      );
      await orderGateway.insertOrderItems(formated_order_items);

      orderGateway.commit();

      const message = {
        order_id: 1,
        payment_method: 1,
      };

      //Send message to PaymentQueueReceived.fifo
      queueService.sendMessage({
        message,
        QueueOutputUrl: `${process.env.AWS_OUTPUT_PAYMENT_QUEUE_RECEIVED_URL}`,
        MessageGroupId: `${process.env.AWS_MESSAGE_GROUP}`,
      });

      let output: NewOrderOutputDTO = {
        hasError: false,
        orderId: 1,
        httpCode: 200,
      };

      return output;
    } catch (error) {
      console.log(
        'Error by inserting a new order. Please, check your data.',
        error,
      );
      orderGateway.rollback();

      let output: NewOrderOutputDTO = {
        orderId: 0,
        hasError: true,
        message: 'Error by inserting a new order. Please, check your data.',
        httpCode: 500,
      };

      return output;
    }
  }

  static formatOrderItems(
    order_id: number,
    order_items: IOrderItem[],
  ): IOrderItem[] {
    let queryParams: IOrderItem[] = [];
    for (let i in order_items) {
      const { item_id, order_item_qtd } = order_items[i];

      queryParams.push({
        order_id: order_id,
        item_id: item_id,
        order_item_qtd: order_item_qtd,
      });
    }
    return queryParams;
  }

  static async loadItemPrices(
    gateway: OrderGatewayInterface,
    order_items: IOrderItem[],
  ) {
    let ids: number[] = [];
    let items = new Map<number, IOrderItem>();
    let ret: OrderItemEntity[] = [];

    for (let i in order_items) {
      ids.push(order_items[i].item_id);
      items.set(order_items[i].item_id, order_items[i]);
    }

    let result = await gateway.getItemPrices(ids);
    for (let row of result) {
      let ordemItem = new OrderItemEntity();
      ordemItem.item_id = row.id;
      ordemItem.order_item_qtd = items.get(row.id)?.order_item_qtd;
      ordemItem.price = row.item_price;

      ret.push(ordemItem);
    }

    return ret;
  }
}
