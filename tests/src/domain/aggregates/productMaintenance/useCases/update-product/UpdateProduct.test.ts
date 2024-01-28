import IProductRepository from '../../../../../../../src/domain/aggregates/productMaintenance/core/ports/IProductRepository';
import UpdateProduct from '../../../../../../../src/domain/aggregates/productMaintenance/useCases/update-product/UpdateProduct';
import { UpdateProductInputDTO } from '../../../../../../../src/domain/aggregates/productMaintenance/useCases/update-product/UpdateProductDTO';

const productRepositoryMock: IProductRepository = {
  createProduct: jest.fn(),
  getProducts: jest.fn(),
  getProductById: jest.fn(),
  getProductByCategory: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
};

const updateProductInputMock: UpdateProductInputDTO = {
  itemId: 1,
  itemName: 'Sorvete de creme',
  itemPrice: 10.9,
  itemType: 3,
  itemDescription: 'Delicioso sorvete de creme',
  itemImgUrl:
    'https://www.mrmixbrasil.com.br/arquivos-upload/produtos/casquinha-de-chocolate-05022021111624517024.png',
};

describe('UpdateProduct', () => {
  it('should update a product and return success', async () => {
    const updateProductUseCase = new UpdateProduct(productRepositoryMock);

    const result = await updateProductUseCase.execute(updateProductInputMock);

    expect(result.hasError).toBe(false);
    expect(result.message).toBe('Product changed successfully');
  });

  it('should try to update a product and return error in database', async () => {
    const productRepositoryErrorMock = {
      ...productRepositoryMock,
      updateProduct: jest.fn(() => {
        throw new Error('Erro mockado');
      }),
    };
    const updateProductUseCase = new UpdateProduct(productRepositoryErrorMock);

    const result = await updateProductUseCase.execute(updateProductInputMock);

    expect(result.hasError).toBe(true);
    expect(result.message).toBe('Failed to update product');
  });

  it('should return error when param is empty', async () => {
    const productRepositoryErrorMock = {
      ...productRepositoryMock,
      updateProduct: jest.fn(() => {
        throw new Error('Erro mockado');
      }),
    };
    const updateProductUseCase = new UpdateProduct(productRepositoryErrorMock);

    const result = await updateProductUseCase.execute(
      {} as UpdateProductInputDTO,
    );

    expect(result.hasError).toBe(true);
    expect(result.message).toBe('["Missing body."]');
  });
});
