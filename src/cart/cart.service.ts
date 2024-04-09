import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schema/cart.schema';
import { CreateCartItemDto } from './dto/item.dto';
import * as fs from 'fs';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class CartService {
    constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

    async addItem(userId: string, createCartItemDto: CreateCartItemDto): Promise<Cart> {
        let cart = await this.cartModel.findOne({ userId }).exec();

        if (!cart) {
            cart = new this.cartModel({ userId, items: [] });
        }

        const existingItem = cart.items.find(item => item.productId === createCartItemDto.productId);

        if (existingItem) {
            existingItem.quantity += createCartItemDto.quantity;
        } else {
            cart.items.push({ productId: createCartItemDto.productId, quantity: createCartItemDto.quantity });
        }

        return cart.save();
    }

    async getCart(userId: string): Promise<Cart> {
        return this.cartModel.findOne({ userId }).exec();
    }

    async updateCartItem(userId: string, productId: string, quantity: number): Promise<Cart> {
        const cart = await this.cartModel.findOne({ userId }).exec();

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const item = cart.items.find(item => item.productId === productId);

        if (!item) {
            throw new NotFoundException('Item not found in cart');
        }

        item.quantity = quantity;

        return cart.save();
    }

    async deleteCartItem(userId: string, productId: string): Promise<Cart> {
        const cart = await this.cartModel.findOne({ userId }).exec();

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        cart.items = cart.items.filter(item => item.productId !== productId);

        return cart.save();
    }

    async deleteCart(userId: string): Promise<void> {
        await this.cartModel.deleteOne({ userId }).exec();
    }

//     async generateCartPdf(userId: string): Promise<void> {
//       const cart = await this.cartModel.findOne({ userId }).populate('items.productId').exec();
  
//       if (!cart) {
//           throw new NotFoundException('Cart not found');
//       }
  
//       const doc = new PDFDocument();
//       const outputPath = cart_${userId}.pdf;
//       const outputStream = fs.createWriteStream(outputPath);
//       doc.pipe(outputStream);
  
//       doc.fontSize(14).text(User ID: ${userId}, { align: 'center' });
//       doc.moveDown();
//       doc.fontSize(20).text('Your Cart:', { align: 'center' });
//       doc.moveDown();
  
//       for (let i = 0; i < cart.items.length; i++) {
//           const item = cart.items[i];
//           const product = item.productId; // Assuming productId is the reference to the product
  
//           doc.fontSize(14).text(Item ${i + 1}: ${product.title}, { continued: true });
//           doc.text(Price: ${product.price});
//           doc.moveDown();
//       }
  
//       doc.end();
//   }
  
}