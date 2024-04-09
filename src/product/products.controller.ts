import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FilterProductDTO } from './dto/filter.product.dto';
import { CreateProductDTO } from './dto/create.product.dto';

@Controller('products')
export class ProductsController {
    constructor ( private productService: ProductsService ){}


    @Get('/')
    async getProducts(@Query() filterProductDTO: FilterProductDTO) {
      if (Object.keys(filterProductDTO).length) {
          return this.productService.getFilteredProducts(filterProductDTO);
      } else {
          return this.productService.getAllProducts();
      }
  };

    @Post('/')
      async addProduct(@Body() createProductDTO: CreateProductDTO) {
        const product = await this.productService.addProduct(createProductDTO);
        return product;
      };

    
    @Get('/:id')
      async getProduct(@Param('id') id: string) {
        const product = await this.productService.getProduct(id);
        if (!product) throw new NotFoundException('Product does not exist!');
        return product;
      };

    @Put('/:id')
      async updateProduct(@Param('id') id: string, @Body() createProductDTO: CreateProductDTO) {
        const product = await this.productService.updateProduct(id, createProductDTO);
        if (!product) throw new NotFoundException('Product does not exist!');
        return product;
      };

      @Delete('/:id')
      async deleteProduct(@Param('id') id: string) {
        const product = await this.productService.deleteProduct(id);
        if (!product) throw new NotFoundException('Product does not exist');
        return product;
      };
}
