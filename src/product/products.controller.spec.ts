import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../product/products.controller';
import { ProductsService } from './products.service';
import { CreateProductDTO } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productService: ProductsService;
  

  const mockProductsService = {
    getProducts: jest.fn(),
    getProduct: jest.fn(),
    addProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
    uploadFile: jest.fn(),
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers:[{provide:ProductsService, useValue:mockProductsService}]
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    productService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  // for getting all fo the products 
  describe('get products', ()=>{
    it('should return all products', async ()=>{
      const mockProducts = [
        {id:'1', title:'wine', price:25, image:'some url', countInStock:6},
        {id:'2', title:'wine2', price:252, image:'some url2', countInStock:62}
      ];
      mockProductsService.getProducts.mockResolvedValue(mockProducts);
      const result = await controller.getProducts({});

      expect(result).toEqual(mockProducts);
    });
  });

  // Posting one product 
  describe('post products', ()=>{
    it('Should add one product', async ()=>{
      const createProductDto:CreateProductDTO = {name:'new product', description: ' have fun !', price: 10, category:'fun'};
      const createdProduct = {id: '3',name:'new product', description: ' have fun !', price: 10, category:'fun'};

      mockProductsService.addProduct.mockResolvedValue(createdProduct);

      const result = await controller.addProduct(createProductDto);

      expect(result).toEqual(createdProduct);
    })
  });

  // Put request 
  describe('Updating products', ()=>{
    it ('Should update the data of products ', async()=>{
      const updateProductDto: UpdateProductDto = {name:'Updated product', category:'fun + beer'};
      const updatedProduct = {id: '2', name:'Updated product',category:'fun + beer'};

      mockProductsService.updateProduct.mockResolvedValue(updatedProduct);

      const result = await controller.updateProduct('2', updateProductDto);

      expect(result).toEqual(updatedProduct);

    })
  });

  // Deleteing the product
  describe('Delete post', ()=>{
    it('should delete the product', async()=>{
      const productId = '2';
      const deleteMessage = 'The product is removed';

      mockProductsService.deleteProduct.mockResolvedValue(deleteMessage);

      const result = await controller.deleteProduct(productId);
      expect(result).toEqual(deleteMessage);
    })
  });

});
