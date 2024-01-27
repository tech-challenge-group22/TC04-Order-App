import IProductCacheRepository from '../../../../../../../src/domain/aggregates/productMaintenance/core/ports/IProductCacheRepository';
import IProductRepository from '../../../../../../../src/domain/aggregates/productMaintenance/core/ports/IProductRepository';
import RefreshListCache from '../../../../../../../src/domain/aggregates/productMaintenance/useCases/refresh-list-cache/RefreshListCache';

const productCacheRepositoryMock: IProductCacheRepository = {
  createProduct: jest.fn(),
  getProducts: jest.fn(),
  getProductById: jest.fn(),
  deleteProduct: jest.fn(),
};

const getProductByCategoryMock = [
  {
    itemName: 'Sorvete de chocolate',
    itemPrice: 15.9,
    itemType: 3,
    itemDescription: 'Soverte de chocolate suiço na casquinha crocante.',
    itemImgUrl:
      'https://www.mrmixbrasil.com.br/arquivos-upload/produtos/casquinha-de-chocolate-05022021111624517024.png',
  },
];

const productSqlRepositoryMock: IProductRepository = {
  createProduct: jest.fn(),
  getProducts: jest.fn().mockResolvedValue(getProductByCategoryMock),
  getProductById: jest.fn(),
  getProductByCategory: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
};

describe('RefreshListCache', () => {
  it('should refresh list and return success', async () => {
    const refreshListCacheUseCase = new RefreshListCache(
      productCacheRepositoryMock,
      productSqlRepositoryMock,
    );

    const result = await refreshListCacheUseCase.execute();

    expect(result.hasError).toBe(false);
    expect(result.message).toBe('Search finished successfully');
  });

  it('should refresh return error when refresh list', async () => {
    const productSqlRepositoryErrorMock = {
      ...productSqlRepositoryMock,
      getProducts: jest.fn(() => {
        throw new Error('Erro mockado');
      }),
    };

    const refreshListCacheUseCase = new RefreshListCache(
      productCacheRepositoryMock,
      productSqlRepositoryErrorMock,
    );

    const result = await refreshListCacheUseCase.execute();

    expect(result.hasError).toBe(true);
    expect(result.message).toBe('Failed to search product');
  });
});
