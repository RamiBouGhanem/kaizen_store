import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, type: Number, min: 0 })
  price: number;

  // Store relative paths like: "uploads/products/brazil-kit.png"
  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ trim: true })
  team?: string;

  @Prop({ trim: true })
  season?: string;

  @Prop({ trim: true })
  kitType?: string; // e.g. 'home' | 'away' | 'third' | 'gk'

  @Prop({ default: false })
  isFeatured?: boolean;

  @Prop({ default: false })
  isClearance?: boolean;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Helpful indexes for filtering
ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ title: 'text', team: 'text', season: 'text', kitType: 'text' });
ProductSchema.index({ team: 1, season: 1, kitType: 1, createdAt: -1 });
