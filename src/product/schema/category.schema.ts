import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document} from 'mongoose';


export type CategoryDocument = Category & Document ;

@Schema()

export class Category{
    
    @Prop({ required: true})
    title_of_category: string
};

export const CategorySchema = SchemaFactory.createForClass(Category);
