// src/seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProductsService } from './products/products.service';

type SeedItem = {
  title: string;
  team: string;       // slug: "brazil", "germany", "france", "real-madrid"
  season: string;     // e.g. "2025-2026"
  kitType: string;    // "home" | "away" | "third" | "gk" | "training" | "fan"
  description: string;
  images: string[];
  sizes: string[];
  stock: number;
  price: number;
  isFeatured?: boolean;
  isClearance?: boolean;
  tags?: string[];
};

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const svc = app.get(ProductsService);

  const season = '2025-2026';

  // Base image URLs served by ServeStatic (/uploads/**)
  const IMG = {
    brazil: '/uploads/products/brazil-kit.jpg',
    germany: '/uploads/products/germany-kit.jpg',
    france: '/uploads/products/france-kit.jpg',
    real: '/uploads/products/realmadrid-kit.jpg',
  };

  const commonDesc =
    'Engineered for match-level performance with breathable mesh zones, lightweight fabric and pro fit.';

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // Helper to make items fast
  const mk = (p: Partial<SeedItem> & Pick<SeedItem, 'title' | 'team' | 'kitType'>): SeedItem => ({
    title: p.title,
    team: p.team,
    season: p.season ?? season,
    kitType: p.kitType,
    description: p.description ?? commonDesc,
    images: p.images ?? [
      p.team === 'brazil' ? IMG.brazil :
      p.team === 'germany' ? IMG.germany :
      p.team === 'france' ? IMG.france : IMG.real
    ],
    sizes: p.sizes ?? sizes,
    stock: p.stock ?? Math.floor(Math.random() * 20) + 5,
    price: p.price ?? (p.kitType === 'training' || p.kitType === 'fan' ? 69 : 99),
    isFeatured: p.isFeatured ?? false,
    isClearance: p.isClearance ?? false,
    tags: p.tags ?? [],
  });

  // 30 products (balanced across teams & kit types)
  const items: SeedItem[] = [
    // BRAZIL (8)
    mk({ title: 'Brazil Home Jersey', team: 'brazil', kitType: 'home', images: [IMG.brazil] }),
    mk({ title: 'Brazil Away Jersey', team: 'brazil', kitType: 'away', images: [IMG.brazil] }),
    mk({ title: 'Brazil Third Jersey', team: 'brazil', kitType: 'third', images: [IMG.brazil] }),
    mk({ title: 'Brazil GK Kit', team: 'brazil', kitType: 'gk', images: [IMG.brazil], price: 95 }),
    mk({ title: 'Brazil Training Top', team: 'brazil', kitType: 'training', price: 59, images: [IMG.brazil] }),
    mk({ title: 'Brazil Fan Jersey', team: 'brazil', kitType: 'fan', price: 69, images: [IMG.brazil] }),
    mk({ title: 'Brazil Pre-Match Shirt', team: 'brazil', kitType: 'training', price: 62, images: [IMG.brazil] }),
    mk({ title: 'Brazil Anthem Jacket', team: 'brazil', kitType: 'fan', price: 89, images: [IMG.brazil] }),

    // GERMANY (8)
    mk({ title: 'Germany Home Jersey', team: 'germany', kitType: 'home', images: [IMG.germany] }),
    mk({ title: 'Germany Away Jersey', team: 'germany', kitType: 'away', images: [IMG.germany] }),
    mk({ title: 'Germany Third Jersey', team: 'germany', kitType: 'third', images: [IMG.germany] }),
    mk({ title: 'Germany GK Kit', team: 'germany', kitType: 'gk', price: 95, images: [IMG.germany] }),
    mk({ title: 'Germany Training Top', team: 'germany', kitType: 'training', price: 59, images: [IMG.germany] }),
    mk({ title: 'Germany Fan Jersey', team: 'germany', kitType: 'fan', price: 69, images: [IMG.germany] }),
    mk({ title: 'Germany Pre-Match Shirt', team: 'germany', kitType: 'training', price: 62, images: [IMG.germany] }),
    mk({ title: 'Germany Anthem Jacket', team: 'germany', kitType: 'fan', price: 89, images: [IMG.germany] }),

    // FRANCE (7)
    mk({ title: 'France Home Jersey', team: 'france', kitType: 'home', images: [IMG.france] }),
    mk({ title: 'France Away Jersey', team: 'france', kitType: 'away', images: [IMG.france] }),
    mk({ title: 'France Third Jersey', team: 'france', kitType: 'third', images: [IMG.france] }),
    mk({ title: 'France GK Kit', team: 'france', kitType: 'gk', price: 95, images: [IMG.france] }),
    mk({ title: 'France Training Top', team: 'france', kitType: 'training', price: 59, images: [IMG.france] }),
    mk({ title: 'France Fan Jersey', team: 'france', kitType: 'fan', price: 69, images: [IMG.france] }),
    mk({ title: 'France Anthem Jacket', team: 'france', kitType: 'fan', price: 89, images: [IMG.france] }),

    // REAL MADRID (7)
    mk({ title: 'Real Madrid Home Jersey', team: 'real-madrid', kitType: 'home', images: [IMG.real] }),
    mk({ title: 'Real Madrid Away Jersey', team: 'real-madrid', kitType: 'away', images: [IMG.real] }),
    mk({ title: 'Real Madrid Third Jersey', team: 'real-madrid', kitType: 'third', images: [IMG.real] }),
    mk({ title: 'Real Madrid GK Kit', team: 'real-madrid', kitType: 'gk', price: 99, images: [IMG.real] }),
    mk({ title: 'Real Madrid Training Top', team: 'real-madrid', kitType: 'training', price: 59, images: [IMG.real] }),
    mk({ title: 'Real Madrid Fan Jersey', team: 'real-madrid', kitType: 'fan', price: 72, images: [IMG.real] }),
    mk({ title: 'Real Madrid Anthem Jacket', team: 'real-madrid', kitType: 'fan', price: 94, images: [IMG.real] }),
  ];

  // Slight variation: featured tags & prices
  items.forEach((p, i) => {
    if (p.kitType === 'home' || p.kitType === 'away') p.isFeatured = true;
    if (!p.tags) p.tags = [];
    p.tags.push(p.team, p.kitType, season);
    // Add subtle price variety
    p.price = p.price + ((i % 3) * 3); // +0, +3, +6
  });

  // Insert all (idempotent-ish by slug collision)
  for (const item of items) {
    try {
      await svc.create(item as any);
      console.log('✓', item.title);
    } catch (e: any) {
      // If re-running seed, slug unique may conflict — ignore duplicates
      if (e?.code === 11000) {
        console.log('• exists:', item.title);
      } else {
        console.error('x failed:', item.title, e?.message || e);
      }
    }
  }

  await app.close();
  console.log('Seed complete.');
}

run();
