import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

function slugify(parts: (string | undefined)[]) {
  const s = parts.filter(Boolean).join(' ').toLowerCase();
  return s
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private model: Model<ProductDocument>) {}

  async create(dto: CreateProductDto) {
    const slugBase = slugify([dto.team, dto.title, dto.kitType, dto.season]);
    const slug = `${slugBase}-${Date.now()}`;
    const doc = await this.model.create({ ...dto, slug });
    return doc.toObject();
  }

  // FIX: add a bulk creator used by controller
  async createMany(dtos: CreateProductDto[]) {
    const toInsert = dtos.map((dto) => {
      const base = slugify([dto.team, dto.title, dto.kitType, dto.season]);
      const slug = `${base}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      return { ...dto, slug };
    });
    const docs = await this.model.insertMany(toInsert, { ordered: false });
    return docs.map((d) => d.toObject());
  }

  async findAll(query: any) {
    const {
      page = 1,
      limit = 24,
      team,
      kitType,
      season,
      q,
      isFeatured,
      sort = 'createdAt:desc',
    } = query;

    const filter: any = {};
    if (team) filter.team = new RegExp(`^${team}$`, 'i');
    if (kitType) filter.kitType = new RegExp(`^${kitType}$`, 'i');
    if (season) filter.season = season;
    if (typeof isFeatured !== 'undefined')
      filter.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (q) {
      // If you have a text index, you can use $text. Otherwise use regex on title
      filter.title = new RegExp(q, 'i');
    }

    // FIX: make a strongly-typed sort object for mongoose
    const [field, dir] = String(sort).split(':');
    const sortObj: Record<string, SortOrder> =
      field && (dir === 'asc' || dir === 'desc')
        ? { [field]: dir === 'asc' ? 1 : -1 }
        : { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .sort(sortObj as any) // mongoose’s types are broad; cast to keep TS happy
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      this.model.countDocuments(filter),
    ]);

    return { items, total, page: Number(page), limit: Number(limit) };
  }

  // FIX: this is the method the controller now calls
  async findOneBySlug(slug: string) {
    const doc = await this.model.findOne({ slug }).lean();
    if (!doc) throw new NotFoundException('Product not found');
    return doc;
  }

  async update(id: string, dto: UpdateProductDto) {
    const current = await this.model.findById(id);
    if (!current) throw new NotFoundException('Product not found');

    // recompute slug if any identity field changed
    let nextSlug = current.slug;
    if (dto.title || dto.team || dto.season || dto.kitType) {
      const base = slugify([
        dto.team ?? current.team,
        dto.title ?? current.title,
        dto.kitType ?? current.kitType,
        dto.season ?? current.season,
      ]);
      nextSlug = `${base}-${current._id.toString().slice(-6)}`;
    }

    Object.assign(current, dto, { slug: nextSlug });
    await current.save();
    return current.toObject();
  }
}
