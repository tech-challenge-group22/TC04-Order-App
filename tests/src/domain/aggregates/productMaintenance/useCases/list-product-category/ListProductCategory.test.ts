import IProductRepository from '../../../../../../../src/domain/aggregates/productMaintenance/core/ports/IProductRepository';
import ListProductByCategory from '../../../../../../../src/domain/aggregates/productMaintenance/useCases/list-product-category/ListProductByCategory';
import { QueryParamsCategoryDTO } from '../../../../../../../src/domain/aggregates/productMaintenance/useCases/list-product-category/ListProductByCategoryDTO';

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

const productRepositoryMock: IProductRepository = {
  createProduct: jest.fn(),
  getProducts: jest.fn().mockResolvedValue(getProductByCategoryMock),
  getProductById: jest.fn(),
  getProductByCategory: jest.fn().mockResolvedValue(getProductByCategoryMock),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
};

describe('ListProductByCategory', () => {
  it('should list products by category item type 3', async () => {
    const listProductByCategoryUseCase = new ListProductByCategory(
      productRepositoryMock,
    );

    const result = await listProductByCategoryUseCase.execute({ itemType: 3 });

    expect(result.hasError).toBe(false);
    expect(result.message).toBe('Search finished successfully');
    expect(result.result);
  });

  it('should list all products without category type', async () => {
    const listProductByCategoryUseCase = new ListProductByCategory(
      productRepositoryMock,
    );

    const inputEmptyMock = {} as QueryParamsCategoryDTO;
    const result = await listProductByCategoryUseCase.execute(inputEmptyMock);

    expect(result.hasError).toBe(false);
    expect(result.message).toBe('Search finished successfully');
    expect(result.result);
  });

  it('should return error in databa connection when try type 2', async () => {
    const productRepositoryErrorMock: IProductRepository = {
      ...productRepositoryMock,
      getProductByCategory: jest.fn(() => {
        throw new Error('Erro mockado');
      }),
    };

    const listProductByCategoryUseCase = new ListProductByCategory(
      productRepositoryErrorMock,
    );

    const result = await listProductByCategoryUseCase.execute({ itemType: 2 });

    expect(result.hasError).toBe(true);
    expect(result.message).toBe('Failed to search product');
  });
});
