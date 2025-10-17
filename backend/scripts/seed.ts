import mongoose from 'mongoose';
import { config } from 'dotenv';
config();
import { Product, ProductSchema } from '../src/schemas/product.schema';

async function run() {
  const uri = process.env.MONGO_URL!;
  await mongoose.connect(uri);
  const ProductModel = mongoose.model(Product.name, ProductSchema, 'products');

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
  await mongoose.disconnect();
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
