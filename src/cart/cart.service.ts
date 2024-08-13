import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schema/cart.schema';
import { CreateCartItemDto } from './dto/item.dto';
import { PdfService } from './pdf.services';
import { Product, ProductDocument } from '../product/schema/product.schema';
import { User, UserDocument } from '../user/schema/user.schema';
import { CartItem, CartItemDocument } from './schema/cart-item.schema';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name) private cartModel: Model<CartDocument>, 
        @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectModel(CartItem.name) private cartItemModel: Model<CartItemDocument>,
        private readonly pdfService: PdfService
    ) {}

    async addItem(userId: string, createCartItemDto: CreateCartItemDto): Promise<CartDocument> {
        let cart = await this.cartModel.findOne({ userId }).exec();

        if (!cart) {
            cart = new this.cartModel({ userId, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(item => item.productId === createCartItemDto.productId);
        if (existingItemIndex !== -1) {
            // If the item already exists, update its quantity
            cart.items[existingItemIndex].quantity += createCartItemDto.quantity;
        } else {
            // Create a new CartItemDocument and push it to the items array
            const newCartItem = new this.cartItemModel(createCartItemDto); // Assuming cartItemModel is the Mongoose model for CartItemDocument
            cart.items.push(newCartItem);
        }
    
        return cart.save();
    }

    async getCart(userId: string): Promise<CartDocument> {
        return this.cartModel.findOne({ userId }).exec();
    }

    async updateCartItem(userId: string, productId: string, quantity: number): Promise<CartDocument> {
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

    async generateReport(userId: string): Promise<void> {
        const cart = await this.getCart(userId);
        const products = await this.getProductsInCart(cart);
        const user = await this.getUserById(userId);
        const cartItems = cart.items;
        try {
            this.pdfService.generateReport(products, cart, user, cartItems);
        } catch (error) {
            if (error instanceof NotFoundException) {
              throw new NotFoundException(error.message);
            } else {
              throw error;
            }
          }



    }

    private async getProductsInCart(cart: CartDocument): Promise<ProductDocument[]> {
        const productIds = cart.items.map(item => item.productId);
        return this.productModel.find({ _id: { $in: productIds } }).exec();
    }

    private async getUserById(userId: string): Promise<UserDocument> {
        return this.userModel.findById(userId).exec();
    }
}
