import IProductCacheRepository from '../../../../../../../src/domain/aggregates/productMaintenance/core/ports/IProductCacheRepository';
import DeleteListCache from '../../../../../../../src/domain/aggregates/productMaintenance/useCases/delete-list-cache/DeleteListCache';

const productCacheRepositoryMock: IProductCacheRepository = {
  createProduct: jest.fn(),
  getProducts: jest.fn(),
  getProductById: jest.fn(),
  deleteProduct: jest.fn(() => {
    throw new Error('Erro mockado');
  }),
};

describe('DeleteListCache', () => {
  it('should delete list cache and return error', async () => {
    const deleteListCacheUseCase = new DeleteListCache(
      productCacheRepositoryMock,
    );

    const result = await deleteListCacheUseCase.execute();

    expect(result.hasError).toBe(true);
    expect(result.message).toBe('Failed to delete products');
  });
});
