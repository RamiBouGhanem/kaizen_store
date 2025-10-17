import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly service;
    constructor(service: ProductsService);
    list(): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("../schemas/product.schema").Product, {}, {}> & import("../schemas/product.schema").Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    bySlug(slug: string): Promise<import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("../schemas/product.schema").Product, {}, {}> & import("../schemas/product.schema").Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
