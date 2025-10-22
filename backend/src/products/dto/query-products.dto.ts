import { Type } from 'class-transformer';
import { IsBooleanString, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class QueryProductsDto {
  @IsOptional() @IsString() q?: string;
  @IsOptional() @IsString() team?: string;
  @IsOptional() @IsString() season?: string;
  @IsOptional() @IsString() size?: string;
  @IsOptional() @IsString() kitType?: string;

  @IsOptional() @IsNumber() @Type(() => Number) priceMin?: number;
  @IsOptional() @IsNumber() @Type(() => Number) priceMax?: number;

  @IsOptional() @IsBooleanString() inStock?: string;
  @IsOptional() @IsBooleanString() featured?: string;

  @IsOptional() @IsIn(['price', '-price', 'createdAt', '-createdAt'])
  sort?: 'price' | '-price' | 'createdAt' | '-createdAt';

  @IsOptional() @IsInt() @Type(() => Number) @Min(1)
  page?: number = 1;

  @IsOptional() @IsInt() @Type(() => Number) @IsPositive()
  limit?: number = 12;
}
