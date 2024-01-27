import IProductCacheRepository from '../../../../../../../src/domain/aggregates/productMaintenance/core/ports/IProductCacheRepository';
import IProductRepository from '../../../../../../../src/domain/aggregates/productMaintenance/core/ports/IProductRepository';
import ListProducts from '../../../../../../../src/domain/aggregates/productMaintenance/useCases/list-products/ListProducts';
import { ListProductInputDTO } from '../../../../../../../src/domain/aggregates/productMaintenance/useCases/list-products/ListProductsDTO';

const getProductByIdMock = [
  {
    id: 1,
    item_name: 'Sorvete de chocolate',
    item_price: 15.9,
    item_type_id: 3,
    item_description: 'Soverte de chocolate suiço na casquinha crocante.',
    item_img_url:
      'https://www.mrmixbrasil.com.br/arquivos-upload/produtos/casquinha-de-chocolate-05022021111624517024.png',
  },
];

const mockResult: ListProductInputDTO = {
  itemId: 1,
  itemName: 'Sorvete de chocolate',
  itemPrice: 15.9,
  itemType: 3,
  itemDescription: 'Soverte de chocolate suiço na casquinha crocante.',
  itemImgUrl:
    'https://www.mrmixbrasil.com.br/arquivos-upload/produtos/casquinha-de-chocolate-05022021111624517024.png',
};

const productCacheRepositoryMock: IProductCacheRepository = {
  createProduct: jest.fn(),
  getProducts: jest.fn(),
  getProductById: jest.fn().mockResolvedValue(getProductByIdMock),
  deleteProduct: jest.fn(),
};

const productRepositoryMock: IProductRepository = {
  createProduct: jest.fn(),
  getProducts: jest.fn(),
  getProductById: jest.fn().mockResolvedValue(getProductByIdMock),
  getProductByCategory: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
};

describe('ListProducts', () => {
  it('should list products in cache with success', async () => {
    const listProductsUsecase = new ListProducts(
      productCacheRepositoryMock,
      productRepositoryMock,
    );

    const result = await listProductsUsecase.execute({ itemId: 1 });

    expect(result.hasError).toBe(false);
    expect(result.message).toBe('Search finished successfully');
    expect(result.result).toStrictEqual(mockResult);
  });

  it('should list products in sql without cache with success', async () => {
    const productCacheRepositoryEmptyMock: IProductCacheRepository = {
      ...productCacheRepositoryMock,
      getProductById: jest.fn().mockResolvedValue({}),
    };

    const listProductsUsecase = new ListProducts(
      productCacheRepositoryEmptyMock,
      productRepositoryMock,
    );

    const result = await listProductsUsecase.execute({ itemId: 1 });

    expect(result.hasError).toBe(false);
    expect(result.message).toBe('Search finished successfully');
    expect(result.result).toStrictEqual(mockResult);
  });

  it('should return database connection error', async () => {
    const productCacheRepositoryEmptyMock: IProductCacheRepository = {
      ...productCacheRepositoryMock,
      getProductById: jest.fn(() => {
        throw new Error('Erro mockado');
      }),
    };
    const listProductsUsecase = new ListProducts(
      productCacheRepositoryEmptyMock,
      productRepositoryMock,
    );

    const result = await listProductsUsecase.execute({ itemId: 1 });

    expect(result.hasError).toBe(true);
    expect(result.message).toBe('Failed to search product');
  });

  it('should return all products when without itemId or itemId 0', async () => {
    const productRepositoryItemId0Mock: IProductRepository = {
      ...productRepositoryMock,
      getProducts: jest.fn().mockResolvedValue([mockResult]),
    };

    const listProductsUsecase = new ListProducts(
      productCacheRepositoryMock,
      productRepositoryItemId0Mock,
    );

    const result = await listProductsUsecase.execute({ itemId: 0 });

    expect(result.hasError).toBe(false);
    expect(result.message).toBe('Search finished successfully');
    expect(result.result).toStrictEqual([mockResult]);
  });
});
