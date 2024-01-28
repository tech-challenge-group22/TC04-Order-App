import Product from '../../../../../../../src/domain/aggregates/productMaintenance/core/entities/Product';

describe('Product', () => {
  it('should create product with valid properties', () => {
    const product = new Product('Name', 10, 1, 'Description', 'image.jpg', 1);
    expect(product).toBeDefined();
    expect(product.itemName).toBe('Name');
    expect(product.itemPrice).toBe(10);
    expect(product.itemType).toBe(1);
    expect(product.itemDescription).toBe('Description');
    expect(product.itemImgUrl).toBe('image.jpg');
    expect(product.itemId).toBe(1);
  });
});
