import IProductRepository from '../../../../../../../src/domain/aggregates/productMaintenance/core/ports/IProductRepository';
import DeleteProduct from '../../../../../../../src/domain/aggregates/productMaintenance/useCases/delete-product/DeleteProduct';
import { DeleteProductInputDTO } from '../../../../../../../src/domain/aggregates/productMaintenance/useCases/delete-product/DeleteProductDTO';

const inputMock: DeleteProductInputDTO = {
  itemId: 1,
};

const productRepositoryMock: IProductRepository = {
  createProduct: jest.fn(),
  getProducts: jest.fn(),
  getProductById: jest.fn(),
  getProductByCategory: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
};

describe('DeleteProduct', () => {
  it('should delete product and return success', async () => {
    const deleteUsecase = new DeleteProduct(productRepositoryMock);

    const result = await deleteUsecase.execute(inputMock);

    expect(result.hasError).toBe(false);
    expect(result.message).toBe('Product deleted successfully');
  });

  it('should return error when passa empty input param', async () => {
    const deleteUsecase = new DeleteProduct(productRepositoryMock);

    const inputEmptyMock = {} as DeleteProductInputDTO;

    const result = await deleteUsecase.execute(inputEmptyMock);

    expect(result.hasError).toBe(true);
    expect(result.message).toBe('"Missing ItemId..."');
  });

  it('should return error with database connection', async () => {
    const productRepositoryDatabaseErrorMock: IProductRepository = {
      createProduct: jest.fn(),
      getProducts: jest.fn(),
      getProductById: jest.fn(),
      getProductByCategory: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(() => {
        throw new Error('Erro mockado');
      }),
    };

    const deleteUsecase = new DeleteProduct(productRepositoryDatabaseErrorMock);

    const result = await deleteUsecase.execute(inputMock);

    expect(result.hasError).toBe(true);
    expect(result.message).toBe('Failed to delete product');
  });
});
