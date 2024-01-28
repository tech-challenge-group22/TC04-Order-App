import IProductCacheRepository from '../../../../../../../src/domain/aggregates/productMaintenance/core/ports/IProductCacheRepository';
import CreateProductCache from '../../../../../../../src/domain/aggregates/productMaintenance/useCases/create-product-cache/CreateProductCache';
import { CreateProductInputDTO } from '../../../../../../../src/domain/aggregates/productMaintenance/useCases/create-product/CreateProductDTO';

const createProductMock = {
  fieldCount: 0,
  affectedRows: 1,
  insertId: 5,
  serverStatus: 2,
  warningCount: 0,
  message: '',
  protocol41: true,
  changedRows: 0,
};

const productCacheRepositoryMock: IProductCacheRepository = {
  createProduct: jest.fn().mockResolvedValue(createProductMock),
  getProducts: jest.fn(),
  getProductById: jest.fn(),
  deleteProduct: jest.fn(),
};

const inputMock: CreateProductInputDTO = {
  itemId: 50,
  itemName: 'Sorvete de chocolate',
  itemPrice: 15.9,
  itemType: 3,
  itemDescription: 'Soverte de chocolate suiço na casquinha crocante.',
  itemImgUrl:
    'https://www.mrmixbrasil.com.br/arquivos-upload/produtos/casquinha-de-chocolate-05022021111624517024.png',
};

describe('CreateProductCache', () => {
  it('should create a product on cache and return success', async () => {
    const createUseCase = new CreateProductCache(productCacheRepositoryMock);

    const result = await createUseCase.execute(inputMock);

    expect(result.hasError).toBe(false);
    expect(result.message).toBe('Item inserted successfully on cache');
    expect(result.result).toBe(createProductMock);
  });

  it('should return an error when try to create a product without input and return error', async () => {
    const productRepositoryErrorMock: IProductCacheRepository = {
      createProduct: jest.fn(() => {
        throw new Error('Erro mockado');
      }),
      getProducts: jest.fn(),
      getProductById: jest.fn(),
      deleteProduct: jest.fn(),
    };

    const inputErrorMock = {} as CreateProductInputDTO;

    const createUseCase = new CreateProductCache(productRepositoryErrorMock);

    const result = await createUseCase.execute(inputErrorMock);
    expect(result.hasError).toBe(true);
    expect(result.message).toBe('Failed to create product on cache');
  });

  it('should return an error when create a product and return error', async () => {
    const productRepositoryErrorMock: IProductCacheRepository = {
      ...productCacheRepositoryMock,
      createProduct: jest.fn(() => {
        throw new Error('Erro mockado');
      }),
    };

    const createUseCase = new CreateProductCache(productRepositoryErrorMock);

    const result = await createUseCase.execute(inputMock);
    expect(result.hasError).toBe(true);
    expect(result.message).toBe('Failed to create product on cache');
  });
});
