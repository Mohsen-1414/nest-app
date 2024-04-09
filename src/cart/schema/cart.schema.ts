import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CartItem, CartItemSchema } from './cart-item.schema';

export type CartDocument = Cart & Document;

@Schema()
export class Cart {
    // @Prop({ required: true })
    // userId: string;

    @Prop({ required: true })
    userId: Types.ObjectId;
  
    @Prop({ type: [CartItemSchema], default: [] })
    items: CartItem[];
  }

export const CartSchema = SchemaFactory.createForClass(Cart);
