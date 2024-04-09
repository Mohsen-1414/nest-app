import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Date, Document, Types} from 'mongoose';
import { User } from 'src/user/schema/user.schema';


export type ProductDocument = Product & Document ;

@Schema()
export class Product {

    @Prop({ required: true, type: String })
    title: string

    @Prop({type: String})
    description: string

    @Prop({ required: true })
    price: number

    @Prop({ required: true})
    image: string

    @Prop({ type: Types.ObjectId, ref: 'Category' })
    category: string


    @Prop({ required: true, default: 0 })
    countInStock: number;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    userId: User

};

export const ProductSchema = SchemaFactory.createForClass(Product);
 