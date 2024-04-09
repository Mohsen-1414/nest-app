import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/product/schema/product.schema';
import { FilterProductDTO } from './dto/filter.product.dto';
import { CreateProductDTO } from './dto/create.product.dto';

@Injectable()
export class ProductsService {
    constructor(@InjectModel('Product') private readonly productModel: Model< ProductDocument >) { }

  async getAllProducts(): Promise<Product[]> {
    const products = await this.productModel.find().exec();
    return products;
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    return product;
  }

  async addProduct(createProductDTO: CreateProductDTO): Promise<Product> {
    const newProduct = await this.productModel.create(createProductDTO);
    return newProduct.save();
  }

  async updateProduct(id: string, createProductDTO: CreateProductDTO): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, createProductDTO, { new: true });
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<any> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id);
    return deletedProduct;
  }

  async getFilteredProducts(filterProductDTO:FilterProductDTO): Promise<Product[]> {
    const { category, search } = filterProductDTO;

    let query = {};

    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: new RegExp(search, 'i') } },
          { description: { $regex: new RegExp(search, 'i') } },
        ],
      };
    }

    if (category) {
      query = { ...query, category };
    }

    const products = await this.productModel.find(query).exec();
    return products;
  }
}

