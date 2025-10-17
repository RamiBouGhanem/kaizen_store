import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  list() {
    return this.service.findAll();
  }

  @Get('slug/:slug')
  bySlug(@Param('slug') slug: string) {
    return this.service.findOneBySlug(slug);
  }
}
