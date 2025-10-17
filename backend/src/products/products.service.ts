import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async findAll() {
    return this.productModel.find({ active: true }).sort({ createdAt: -1 }).lean().exec();
  }

  async findOneBySlug(slug: string) {
    const doc = await this.productModel.findOne({ slug, active: true }).lean().exec();
    if (!doc) throw new NotFoundException('Product not found');
    return doc;
  }
}
