import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FilterProductDTO } from './dto/filter.product.dto';
import { CreateProductDTO } from './dto/create.product.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Product } from './schema/product.schema';
import { UpdateProductDto } from './dto/update.product.dto';


@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor ( private productService: ProductsService ){}

    @Get('/')
    async getProducts(@Query() queryParams): Promise<Product[]> {
        return this.productService.getProducts(queryParams);
    };

    @Post('/')
      async addProduct(@Body() createProductDTO: CreateProductDTO): Promise<Product> {
        return this.productService.addProduct(createProductDTO);
        
      };

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
      async uploadProductFile(@UploadedFile() file): Promise<string> {
        return this.productService.uploadFile(file);
    }

    
    @Get('/:id')
      async getProduct(@Param('id') id: string): Promise <Product> {
        return this.productService.getProduct(id);
      };


    @Put('/:id')
      async updateProduct(@Param('id') id: string, @Body() updateProductDTO: UpdateProductDto): Promise <Product> {
        return  this.productService.updateProduct(id, updateProductDTO);
      };

      @Delete('/:id')
      async deleteProduct(@Param('id') id: string): Promise<string> {
        return this.productService.deleteProduct(id);
      };
}
