import { OrderItemEntity } from '../../../../../../../src/domain/aggregates/order/core/entities/OrderItemEntity';

describe('OrderItemEntity', () => {
  describe('constructor', () => {
    it('should create an instance with default values if no arguments are provided', () => {
      const orderItem = new OrderItemEntity();
      expect(orderItem.order_id).toBeUndefined();
      expect(orderItem.item_id).toBeUndefined();
      expect(orderItem.order_item_qtd).toBeUndefined();
      expect(orderItem.price).toBeUndefined();
    });

    it('should create an instance with provided values', () => {
      const orderId = 1;
      const itemId = 2;
      const quantity = 3;
      const orderItem = new OrderItemEntity(orderId, itemId, quantity);
      expect(orderItem.order_id).toBe(orderId);
      expect(orderItem.item_id).toBe(itemId);
      expect(orderItem.order_item_qtd).toBe(quantity);
      expect(orderItem.price).toBeUndefined(); // Price is not provided in the constructor
    });
  });
});
