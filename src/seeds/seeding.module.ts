
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSeeder } from './product.seeder';
import { ProductSchema } from 'src/product/schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }])],
  providers: [ProductSeeder],
  exports: [ProductSeeder],
})
export class SeedingModule {}
