import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller()
export class ProductsController {
  constructor(private readonly svc: ProductsService) {}

  /** GET /products */
  @Get('products')
  async list(@Query() query: any) {
    return this.svc.findAll(query);
  }

  /** GET /products/:slug */
  @Get('products/:slug')
  async bySlug(@Param('slug') slug: string) {
    const item = await this.svc.findOneBySlug(slug);
    return { item };
  }

  /** POST /admin/products (one or many) */
  @Post('admin/products')
  async create(@Body() body: CreateProductDto | CreateProductDto[]) {
    if (Array.isArray(body)) {
      const docs = await this.svc.createMany(body);
      return { items: docs, total: docs.length };
    }
    const doc = await this.svc.create(body);
    return { item: doc };
  }

  /** PATCH /admin/products/:id */
  @Patch('admin/products/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    const item = await this.svc.update(id, dto);
    return { item };
  }

  /** Optional: “new products” collection */
  @Get('collections/new-products')
  async newProducts(@Query('limit') limit = '12') {
    return this.svc.findAll({ limit, sort: 'createdAt:desc' });
  }
}
