import { IsArray, IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString() @IsNotEmpty()
  title!: string;

  @IsString() @IsOptional()
  description?: string;

  @IsString() @IsOptional()
  team?: string;

  @IsString() @IsOptional()
  season?: string; // e.g. "2025-2026" or "24/25"

  @IsString() @IsOptional() @IsIn(['home','away','third','gk','training'], { message: 'kitType must be one of home|away|third|gk|training' })
  kitType?: string;

  @IsNumber() @Min(0)
  price!: number;

  @IsArray() @IsString({ each: true }) @IsOptional()
  images?: string[]; // store relative paths like "uploads/products/france-kit.jpg"

  @IsArray() @IsOptional()
  sizes?: Array<{
    size: string;
    stock: number;
  }>;

  @IsBoolean() @IsOptional()
  isFeatured?: boolean;
}
