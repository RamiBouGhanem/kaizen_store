import { HydratedDocument, Types } from 'mongoose';
export type ProductDocument = HydratedDocument<Product>;
declare class ProductImage {
    url: string;
}
export declare class Product {
    title: string;
    slug: string;
    description: string;
    price: number;
    currency: string;
    stock: number;
    tags: string[];
    active: boolean;
    categoryId?: Types.ObjectId;
    images: ProductImage[];
}
export declare const ProductSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any, import("mongoose").Document<unknown, any, Product, any, {}> & Product & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Product>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Product> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export {};
