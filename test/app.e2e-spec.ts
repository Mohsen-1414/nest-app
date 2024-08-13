import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ProductsService } from '../src/product/products.service';
import { ProductDocument } from '../src/product/schema/product.schema';
import { CreateProductDTO } from 'src/product/dto/create.product.dto';
import { UpdateProductDto } from 'src/product/dto/update.product.dto';
import { UserService } from '../src/user/user.service';
import { AuthService } from '../src/auth/auth.service';


describe('AppController (e2e)', () => {
    let app: INestApplication;
    let productServices: ProductsService
    let userService: UserService;
    let authService: AuthService;

    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();

      productServices = moduleFixture.get<ProductsService>(ProductsService);
      userService = moduleFixture.get<UserService>(UserService); 
      authService = moduleFixture.get<AuthService>(AuthService); 
    });

    afterEach( async()=>{
      await app.close();
    });

    describe('It should get the products', ()=>{
      it('/products (GET)', async ()=>{
        const products: ProductDocument[] = [
          { _id: '1', title: 'Product 1', description: 'Description 1', price: 10, image: 'image-url-1', category: 'Category 1', countInStock: 5, userId:'some id ' },
          { _id: '2', title: 'Product 2', description: 'Description 2', price: 20, image: 'image-url-2', category: 'Category 2', countInStock: 10, userId:'some id' },
        ] as ProductDocument[];
        jest.spyOn(productServices, 'getProducts').mockResolvedValue(products);
    
        const response = await request(app.getHttpServer()).get('/products');
    
        expect(response.status).toBe(200);
        expect(response.body).toEqual(products);
    
      });
    })

    // --------

    describe('It should get one product', ()=>{
      it('/products/:id (GET)', async ()=>{
        const productId = '1';
        const product: ProductDocument = { _id: productId, title: 'Product 1', description: 'Description 1', price: 10, image: 'image-url-1', category: 'Category 1', countInStock: 5, userId:'some id ' } as ProductDocument;
        jest.spyOn(productServices, 'getProduct').mockResolvedValue(product);
    
        const response = await request(app.getHttpServer()).get(`/products/${productId}`);
    
        expect(response.status).toBe(200);
        expect(response.body).toEqual(product);
      });
    })
    
    // --------
    
    describe('It should add a new product', ()=>{
      it('/products (POST)', async () => {
        const newProduct: CreateProductDTO = { name: 'New Product', description: 'Description', price: 10, category: 'Category' };
        const createdProduct = { ...newProduct, id: '3', title: newProduct.name, image:'some url', countInStock:5, userId:''}; // Mocked created product with an ID
        jest.spyOn(productServices, 'addProduct').mockResolvedValue(createdProduct);
    
        const response = await request(app.getHttpServer())
          .post('/products')
          .send(newProduct);
    
        expect(response.status).toBe(201);
        expect(response.body).toEqual(createdProduct);
      });
    })
  
    // ------- 

    // it('/products/:id (PUT)', async () => {
    //   const productId = '1';
    //   const updatedProduct = { id: productId, name: 'Updated Product', description: 'Updated Description', price: 20, category: 'Updated Category' };
    //   jest.spyOn(productServices, 'updateProduct').mockResolvedValue(updatedProduct);

    //   const response = await request(app.getHttpServer())
    //     .put(`/products/${productId}`)
    //     .send(updatedProduct);

    //   expect(response.status).toBe(200);
    //   expect(response.body).toEqual(updatedProduct);
    // });
    

    // --------

    describe('It should delete a product', ()=>{
      it('/products/:id (DELETE)', async () => {
        const productId = '1';
        const deleteMessage = 'Product deleted';
        jest.spyOn(productServices, 'deleteProduct').mockResolvedValue(deleteMessage);
    
        const response = await request(app.getHttpServer()).delete(`/products/${productId}`);
    
        expect(response.status).toBe(200);
        expect(response.text).toEqual(deleteMessage);
      });
    })
    
  //                              ----------------------AUTH---------------------                            //


  describe('Registering in the website', ()=>{
    it('/auth/register (POST)', async () => {
      const newUser = { username: 'testuser', email: 'test@example.com', password: 'password', roles: [] , birthday: '01.01.01', verificationToken:''};
      jest.spyOn(userService, 'addUser').mockResolvedValue(newUser);
    
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(newUser);
    
      expect(response.status).toBe(201);
      expect(response.body).toEqual(newUser);
    });
  })

  // --------

  describe('It should log in ', ()=>{
    it('/auth/login (POST)', async () => {
      const user = {
        username: 'testuser',
        password: 'testpassword',
      };
    
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(user);
    
      const response = await request(app.getHttpServer()).post('/auth/login').send(user)
        
        expect(response.status).toBe(201);// for some reason it creates 201
        expect(response.body).toHaveProperty('access_token');
        });
  });

})