import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ _id: false })
class ProductImage {
  @Prop({ type: String, required: true })
  url!: string;
}
const ProductImageSchema = SchemaFactory.createForClass(ProductImage);

@Schema({ timestamps: true, collection: 'products' })
export class Product {
  @Prop({ required: true }) title!: string;

  @Prop({ required: true, unique: true, index: true }) slug!: string;

  @Prop({ required: true }) description!: string;

  // store price in cents
  @Prop({ type: Number, required: true, min: 0 }) price!: number;

  @Prop({ type: String, default: 'LBP' }) currency!: string;

  @Prop({ type: Number, default: 0, min: 0 }) stock!: number;

  @Prop({ type: [String], default: [] }) tags!: string[];

  @Prop({ type: Boolean, default: true }) active!: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: false })
  categoryId?: Types.ObjectId;

  @Prop({ type: [ProductImageSchema], default: [] })
  images!: ProductImage[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
