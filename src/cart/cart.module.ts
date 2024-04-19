import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schema/cart.schema';
import { PdfService } from './pdf.services';
import { Product, ProductSchema } from 'src/product/schema/product.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { CartItem, CartItemSchema } from './schema/cart-item.schema';

@Module({
  imports:[MongooseModule.forFeature([{name: Cart.name, schema: CartSchema},{ name: Product.name, schema: ProductSchema },
    { name: User.name, schema: UserSchema },{ name: CartItem.name, schema: CartItemSchema }])],
  providers: [CartService, PdfService], 
  controllers: [CartController]
})
export class CartModule {}
