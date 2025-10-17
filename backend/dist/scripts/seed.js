"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const product_schema_1 = require("../src/schemas/product.schema");
async function run() {
    const uri = process.env.MONGO_URL;
    await mongoose_1.default.connect(uri);
    const ProductModel = mongoose_1.default.model(product_schema_1.Product.name, product_schema_1.ProductSchema, 'products');
    await ProductModel.deleteMany({
        slug: { $in: ['camping-tent-2p', 'scout-backpack-40l', 'size-5-football'] },
    });
    await ProductModel.create([
        {
            title: 'Camping Tent 2P',
            slug: 'camping-tent-2p',
            description: 'Lightweight 2-person tent.',
            price: 2_500_000,
            currency: 'LBP',
            stock: 12,
            tags: ['camping', 'tent'],
            images: [{ url: 'https://picsum.photos/seed/tent/600/600' }],
            active: true,
        },
        {
            title: 'Scout Backpack 40L',
            slug: 'scout-backpack-40l',
            description: 'Durable 40L pack.',
            price: 1_800_000,
            currency: 'LBP',
            stock: 20,
            tags: ['scout', 'backpack'],
            images: [{ url: 'https://picsum.photos/seed/backpack/600/600' }],
            active: true,
        },
        {
            title: 'Size 5 Football',
            slug: 'size-5-football',
            description: 'Match-quality ball.',
            price: 900_000,
            currency: 'LBP',
            stock: 30,
            tags: ['sports', 'football'],
            images: [{ url: 'https://picsum.photos/seed/ball/600/600' }],
            active: true,
        },
    ]);
    console.log('Seed done.');
    await mongoose_1.default.disconnect();
}
run().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map