import { IOrderItem } from '../IOrderItem';

export interface OrderGatewayInterface {
  getOrders(orderId?: number): Promise<any>;
  newOrder(
    customerId: number,
    total: number,
    order_status: number,
  ): Promise<number>;
  updateOrderStatus(orderId: number, order_status: number): Promise<any>;
  insertOrderItems(items: IOrderItem[]): Promise<void>;
  beginTransaction(): void;
  commit(): void;
  rollback(): void;
  getItemPrices(items: number[]): Promise<any>;
}
