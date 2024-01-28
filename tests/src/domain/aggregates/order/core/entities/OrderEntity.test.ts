import { OrderEntity } from '../../../../../../../src/domain/aggregates/order/core/entities/OrderEntity';

describe('OrderEntity', () => {
  describe('totalOrderPrice', () => {
    it('should return 0 if no order items are present', () => {
      const order = new OrderEntity();
      expect(order.totalOrderPrice()).toBe(0);
    });

    it('should handle edge case of empty order item array', () => {
      const order = new OrderEntity(undefined, []);
      expect(order.totalOrderPrice()).toBe(0);
    });

    it('should handle edge case of undefined order items', () => {
      const order = new OrderEntity();
      order.order_items = undefined;
      expect(order.totalOrderPrice()).toBe(0);
    });
  });
});
