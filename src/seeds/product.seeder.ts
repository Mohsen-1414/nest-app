
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/product/schema/product.schema';
import { productsSeed } from './product.seeds';

@Injectable()
export class ProductSeeder {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>) {}

  async seed() {
    try {
      await this.productModel.deleteMany({}); 
      await this.productModel.create(productsSeed);
      console.log('Products seeded successfully.');
    } catch (error) {
      console.error('Error seeding products:', error);
    }
  }
}
