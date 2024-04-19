import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/product/schema/product.schema';
import { FilterProductDTO } from './dto/filter.product.dto';
import { CreateProductDTO } from './dto/create.product.dto';
import { MulterFile } from './types';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateProductDto } from './dto/update.product.dto';

@Injectable()
export class ProductsService {
    constructor(@InjectModel('Product') private readonly productModel: Model< ProductDocument >) { }

  async getProducts(filterProductDTO: FilterProductDTO): Promise<Product[]> {
    if (Object.keys(filterProductDTO).length) {
        return this.getFilteredProducts(filterProductDTO);
    } else {
        return this.productModel.find().exec();;
    }
}

  async getProduct(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product does not exist!');
    }
    return product;
  }


  async addProduct(model: CreateProductDTO): Promise<Product> {
    const newProduct = await this.productModel.create(model);
    return newProduct.save();
  }

  async updateProduct(id: string, model: UpdateProductDto): Promise<Product> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(id, model, { new: true });
    if (!updatedProduct) {
      throw new NotFoundException('Product does not exist!');
    }
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<string> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      throw new NotFoundException('Product does not exist');
    }
    return "Product deleted";
  }


  async uploadFile(file: MulterFile): Promise<string> {
    const uploadDir = path.join(__dirname, '..', 'uploads');

    // to make sure the directory exists, if not create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    try {
      const filename = `${Date.now()}-${file.originalname}`;

      // Define the path where the file will be saved
      const filePath = path.join(uploadDir, filename);

      // Write the file to disk
      await fs.promises.writeFile(filePath, file.buffer);
      return `File ${filename} uploaded successfully. Path: ${filePath}`;
    } catch (error) {
      console.error('Error saving file:', error);
      throw new Error('Failed to save file.');
    }
  }


  async getFilteredProducts(filterProductDTO:FilterProductDTO): Promise<Product[]> {
    const { category, search } = filterProductDTO;

    let query = {};

    if (search) {
      query = {...query,$or: [
          { title: { $regex: new RegExp(search, 'i') } },
          { description: { $regex: new RegExp(search, 'i') } },
        ],
      };
    }

    if (category) {
      query = { ...query, category };
    }

    return await this.productModel.find(query).exec();
    
  }
}

