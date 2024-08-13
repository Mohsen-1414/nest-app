import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CartItem, CartItemDocument, CartItemSchema } from './cart-item.schema';

export type CartDocument = Cart & Document;

@Schema()
export class Cart {

    @Prop({ required: true })
    userId: Types.ObjectId;
    
  
    @Prop({ type: [CartItemSchema], default: [] })
    items: CartItemDocument[];
  }

export const CartSchema = SchemaFactory.createForClass(Cart);
