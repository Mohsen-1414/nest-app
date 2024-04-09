import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema, Product} from 'src/product/schema/product.schema';

@Module({
  imports:[MongooseModule.forFeature([{name: Product.name, schema: ProductSchema}])],
  providers: [ProductsService],
  controllers: [ProductsController]
})
export class ProductsModule {}
 