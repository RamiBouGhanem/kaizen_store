import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProductsService } from './products/products.service';

type SeedItem = {
  title: string;
  team: string;
  season: string;
  kitType: string;
  description: string;
  images: string[];
  sizes: string[];
  stock: number;
  oldPrice: number;
  newPrice: number;
  price: number;
  isFeatured?: boolean;
  isClearance?: boolean;
  tags?: string[];
};

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const svc = app.get(ProductsService);

  const items: SeedItem[] = [
    // 1. Argentina Black
    {
      title: 'Argentina Black 3-Star Special Edition 2024',
      team: 'argentina',
      season: '2024',
      kitType: 'special',
      description: 'Argentina 2024 black-and-gold special edition jersey celebrating three World Cup titles.',
      images: [
        '/uploads/products/argentinamessi10black/argentinamessi10black1',
        '/uploads/products/argentinamessi10black/argentinamessi10black2',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 15,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99,
      tags: ['argentina', 'special', '2024', 'black', 'gold']
    },

    // 2. Arsenal Home 22/23
    {
      title: 'Arsenal Home 2022/23',
      team: 'arsenal',
      season: '2022/23',
      kitType: 'home',
      description: "Classic red-and-white Arsenal home jersey featuring the Adidas design, 'Emirates Fly Better' sponsor, and premium lightweight fabric for comfort and performance.",
      images: [
        '/uploads/products/arsenaljesus22-23/arsenaljesus22-231',
        '/uploads/products/arsenaljesus22-23/arsenaljesus22-232',
        '/uploads/products/arsenaljesus22-23/arsenaljesus22-233',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 15,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99,
      tags: ['arsenal', 'home', '2022/23', 'red-white', 'adidas']
    },

    // 3. Barcelona Retro
    {
      title: 'Barcelona Retro',
      team: 'barcelona',
      season: '2023',
      kitType: 'retro',
      description: 'Retro Barcelona jersey featuring classic Blaugrana stripes with a nod to historic kits.',
      images: [
        '/uploads/products/barca-retro/barca-retro1',
        '/uploads/products/barca-retro/barca-retro2',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 15,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99,
      tags: ['barcelona', 'retro', 'classic', 'historical']
    },

    // 4. Barcelona Black Veins Special Edition
    {
      title: 'Barcelona Black Veins Special Edition 2024',
      team: 'barcelona',
      season: '2024',
      kitType: 'special',
      description: 'Unique black Barcelona special edition jersey featuring red and blue vein-inspired design, Nike logo, Spotify sponsor, and premium athletic fabric for comfort and performance.',
      images: [
        '/uploads/products/barcelonablackveins/barcelonablackveins1',
        '/uploads/products/barcelonablackveins/barcelonablackveins2',
        '/uploads/products/barcelonablackveins/barcelonablackveins3',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 15,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99,
      tags: ['barcelona', 'special', '2024', 'black', 'veins', 'nike']
    },

    // 5. Barcelona Home 23/24
    {
      title: 'Barcelona Home 2023/24',
      team: 'barcelona',
      season: '2023/24',
      kitType: 'home',
      description: "Classic blue and red striped home jersey with subtle diamond pattern, honoring the women's team. Features Spotify sponsor and Nike Dri-FIT material. Back features Lamine Yamal's name and number 19.",
      images: [
        '/uploads/products/barcelonahome23-24/barcelonahome23-241',
        '/uploads/products/barcelonahome23-24/barcelonahome23-242',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 15,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99,
      tags: ['barcelona', 'home', '2023/24', 'blue-red', 'nike', 'diamond pattern', 'Lamine Yamal', 'number 19']
    },

    // 6. Barcelona Home 25/26
    {
      title: 'Barcelona Home 2025/26',
      team: 'barcelona',
      season: '2025/26',
      kitType: 'home',
      description: "Striking home jersey with iconic Blaugrana vertical stripes with gradient effect. Logos in yellow. Back displays Lamine Yamal number 10 with UNHCR logo. Nike Dri-FIT ADV technology.",
      images: [
        '/uploads/products/barcelonahome25-26/barcelonahome25-261',
        '/uploads/products/barcelonahome25-26/barcelonahome25-262',
        '/uploads/products/barcelonahome25-26/barcelonahome25-263',
        '/uploads/products/barcelonahome25-26/barcelonahome25-264',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 15,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99, tags: ['barcelona', 'home', '2025/26', 'blaugrana', 'gradient', 'Nike', 'Spotify', 'Lamine Yamal', 'number 10']
    },

    // 7. Brazil Home 24/25
    {
      title: 'Brazil Home 2024/25',
      team: 'brazil',
      season: '2024/25',
      kitType: 'home',
      description: "Classic yellow home jersey with subtle light-yellow graphic print, V-shaped green collar, CBF crest centralized. Back features Neymar Jr. number 10 in green. Nike Dri-FIT technology.",
      images: [
        '/uploads/products/brazilhome24-25/brazilhome24-251',
        '/uploads/products/brazilhome24-25/brazilhome24-252',
        '/uploads/products/brazilhome24-25/brazilhome24-253',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 18,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99, tags: ['brazil', 'home', '2024/25', 'yellow', 'Nike', 'CBF', 'Canarinho', 'Neymar Jr', 'number 10']
    },

    // 8. Brazil Home 2004
    {
      title: 'Brazil Home 2004',
      team: 'brazil',
      season: '2004',
      kitType: 'home',
      description: "Vintage yellow jersey with deep green accents on collar and trim, curved green side panels, Nike Total 90 template, customized with Ronaldinho number 10.",
      images: [
        '/uploads/products/brazilhome2004/brazilhome20041',
        '/uploads/products/brazilhome2004/brazilhome20042',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 10,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99, tags: ['brazil', 'home', '2004', 'yellow', 'retro', 'Nike', 'Ronaldinho', 'number 10']
    },

    // 9. Brazil Training Set 24
    {
      title: 'Brazil Training Set 2024',
      team: 'brazil',
      season: '2024',
      kitType: 'training',
      description: "Long-sleeve quarter-zip training top with dark blue geometric graphic pattern, neon green Nike swoosh, and Brasil crest. Includes matching pants.",
      images: [
        '/uploads/products/braziltrainingset24/braziltrainingset241',
        '/uploads/products/braziltrainingset24/braziltrainingset242',
        '/uploads/products/braziltrainingset24/braziltrainingset243',
      ],
      sizes: ['M', 'L', 'XL'],
      stock: 25,
      oldPrice: 25,
      newPrice: 19.99,
      price: 19.99, tags: ['brazil', 'training', '2024', 'Nike', 'CBF', 'Blue', 'Technical', 'Quarter-Zip']
    },

    // 10. France Pre-Match 2024
    {
      title: 'France Pre-Match 2024',
      team: 'france',
      season: '2024',
      kitType: 'pre-match',
      description: "France Pre-Match top 2024. Blackened Blue base with multicolor horizontal pinstripe. FFF crest and Nike Swoosh in Club Gold. Nike Dri-FIT.",
      images: [
        '/uploads/products/franceprematch2024/franceprematch20241',
        '/uploads/products/franceprematch2024/franceprematch20242',
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      stock: 45,
      oldPrice: 25,
      newPrice: 19.99,
      price: 19.99, tags: ['France', 'Pre-Match', '2024', 'Nike', 'Blue', 'Gold', 'Stripes', 'Euro 2024', 'Training']
    },

    // 11. France Away 2024
    {
      title: 'France Away 2024',
      team: 'france',
      season: '2024',
      kitType: 'away',
      description: "France 2024 Away Shirt, white base with vertical gradient pinstripes. Oversized gold cockerel crest with two stars. Customized with MBAPPÉ number 10.",
      images: [
        '/uploads/products/franceaway2024/franceaway20241',
        '/uploads/products/franceaway2024/franceaway20242',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 12,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99, tags: ['France', 'Away Kit', '2024', 'Nike', 'White', 'Blue', 'Red', 'Tricolore', 'Mbappé', 'Number 10', 'Euro 2024']
    },

    // 12. Germany Pre-Match 2024
    {
      title: 'Germany Pre-Match 2024',
      team: 'germany',
      season: '2024',
      kitType: 'pre-match',
      description: "Official Adidas Germany Pre-Match Jersey 2024. Black base with eagle-feather pattern. Adidas AEROREADY.",
      images: [
        '/uploads/products/germanyprematch2024/germanyprematch20241',
        '/uploads/products/germanyprematch2024/germanyprematch20242',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 45,
      oldPrice: 25,
      newPrice: 19.99,
      price: 19.99, tags: ['Germany', 'Pre-Match', '2024', 'Adidas', 'Black', 'Graphic', 'Eagle', 'AEROREADY', 'Euro 2024', 'Training']
    },

    // 13. Inter Milan Away 2024
    {
      title: 'Inter Milan Away 2024',
      team: 'Inter Milan',
      season: '2024',
      kitType: 'away',
      description: "Nike Inter Milan Away Shirt 2023/24. White base with black-blue diagonal sash inspired by 63/64 European Cup kit. Sponsor Paramount+. Nike Dri-FIT.",
      images: [
        '/uploads/products/interaway2024/interaway20241',
        '/uploads/products/interaway2024/interaway20242',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 10,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99, tags: ['Inter Milan', 'Away Kit', '2024', 'Nike', 'White', 'Blue', 'Black', 'Sash', 'Paramount+', 'Lautaro Martínez', 'Number 10', 'Serie A']
    },

    // 14. Italy Away 2024
    {
      title: 'Italy Away Jersey (Chiesa 14)',
      team: 'Italy',
      season: '2024',
      kitType: 'away',
      description: "Italy 2024 Away shirt combines white base with blue logos. Side panel stripe nod to 2006 Teamgeist kits. Red, white, green Tricolore elements. Made with recycled material, AEROREADY. Customized with CHIESA 14.",
      images: [
        '/uploads/products/italyaway2024/italyaway20241',
        '/uploads/products/italyaway2024/italyaway20242',
        '/uploads/products/italyaway2024/italyaway20243',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 90,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99, tags: ['Italy', 'Azzurri', 'Away', 'Chiesa', '14', '2024', 'Euro 2024', 'Adidas', 'White', 'Teamgeist', 'AEROREADY', 'Official Printing']
    },

    // 15. Liverpool Drill Top 2024
    {
      title: 'Liverpool Drill Top 2024',
      team: 'Liverpool',
      season: '2024',
      kitType: 'training',
      description: "Liverpool FC long-sleeve drill top for 2024 season. Technical fabric for performance and comfort.",
      images: [
        '/uploads/products/liverpooldrilltop2024/liverpooldrilltop20241',
        '/uploads/products/liverpooldrilltop2024/liverpooldrilltop20242',
        '/uploads/products/liverpooldrilltop2024/liverpooldrilltop20243',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 30,
      oldPrice: 25,
      newPrice: 19.99,
      price: 19.99, tags: ['Liverpool', 'Training', '2024', 'Nike', 'Red', 'Drill Top']
    },

    // 16. Liverpool Home 23/24
    {
      title: 'Liverpool Home 2023-2024',
      team: 'Liverpool',
      season: '2023-24',
      kitType: 'home',
      description: "Nike Liverpool Home Jersey 2023-24. Deep red with subtle graphic pattern, white V-neck collar with red/gold trim. Front features Nike swoosh, Liverpool crest with '97 Hillsborough emblem, Standard Chartered sponsor. Back: MAC ALLISTER 10. Nike Dri-FIT ADV.",
      images: [
        '/uploads/products/liverpoolhome23-24/liverpoolhome23-241',
        '/uploads/products/liverpoolhome23-24/liverpoolhome23-242',
        '/uploads/products/liverpoolhome23-24/liverpoolhome23-243',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 95,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99, tags: ['Liverpool', 'Home', '2023-2024', 'Nike', 'Red', 'Dri-FIT ADV', 'Mac Allister', 'Premier League', 'Mac Allister 10']
    },

    // 17. Liverpool Third 24-25
    {
      title: 'Liverpool Third 2024-2025',
      team: 'Liverpool',
      season: '2024-25',
      kitType: 'third',
      description: "Nike Liverpool Third Jersey 2024-25. Dark 'Night Forest' with bright teal accents. Subtle graphic on fabric. Nike Dri-FIT.",
      images: [
        '/uploads/products/liverpoolthird24-25/liverpoolthird24-251',
        '/uploads/products/liverpoolthird24-25/liverpoolthird24-252',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 85,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99, tags: ['Liverpool', 'Third', '2024-2025', 'Nike', 'Black', 'Teal', 'Dri-FIT']
    },

    // 18. Manchester City Home 24-25
    {
      title: 'Manchester City Home 2024-25',
      team: 'Manchester City',
      season: '2024-25',
      kitType: 'home',
      description: "Puma Manchester City Home Jersey 2024/25. Sky blue with dark navy/white accents, '0161' graffiti-inspired pattern on collar/cuffs. Authentic: ULTRAWEAVE. Replica: dryCELL RE:FIBRE.",
      images: [
        '/uploads/products/mancityhome24-25/mancityhome24-251',
        '/uploads/products/mancityhome24-25/mancityhome24-252',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 95,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99, tags: ['ManchesterCity', 'ManCity', 'MCFC', '2024', '2025', 'Puma', 'SkyBlue', '0161', 'Home', 'Replica']
    },

    // 19. Manchester United Away 24-25
    {
      title: 'Manchester United Away 2024-25',
      team: 'Manchester United',
      season: '2024-25',
      kitType: 'away',
      description: "Adidas Manchester United Away Jersey 2024/25. Night Indigo base with subtle zig-zag 'M' monogram pattern. Sponsor Snapdragon, adidas stripes in metallic silver. Polo collar with light blue tribute to 3 rivers. Fan version: AEROREADY, 100% recycled materials.",
      images: [
        '/uploads/products/manunitedhome24-25/manunitedaway24-251',
        '/uploads/products/manunitedhome24-25/manunitedaway24-252',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 100,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99, tags: ['ManchesterUnited', 'ManUtd', 'MUFC', '2024', '2025', 'adidas', 'Navy', 'Indigo', 'Polo', 'Snapdragon', 'Away', 'Replica']
    },

    // 20. Portugal Home Retro 2002
    {
      title: 'Portugal Home Retro 2002',
      team: 'Portugal',
      season: '2002',
      kitType: 'home',
      description: "Retro Portugal home jersey 2002, dark red with green/yellow accents. Customized with RONALDO number 7.",
      images: [
        '/uploads/products/portugalhome2002retro/portugalhome2002retro1',
        '/uploads/products/portugalhome2002retro/portugalhome2002retro2',
        '/uploads/products/portugalhome2002retro/portugalhome2002retro3',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 120,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99, tags: ['Portugal', 'Nike', 'Red', 'Green', 'Yellow', 'Retro', 'Home', 'Ronaldo', 'CR7', 'Customized', 'NationalTeam']
    },

    // 21. Portugal Home 2014
    {
      title: 'Portugal Home 2014',
      team: 'Portugal',
      season: '2014',
      kitType: 'home',
      description: "Portugal 2014 World Cup Home Shirt, red base with green collar, Nike Dri-FIT. Ronaldo number 7 on back.",
      images: [
        '/uploads/products/portugalhome2014/portugalhome20141',
        '/uploads/products/portugalhome2014/portugalhome20142',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 150,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99, tags: ['Portugal', 'Home', '2014', 'Nike', 'Red', 'Green', 'Ronaldo', 'CR7']
    },

    // 22. PSG Away 2022
    {
      title: 'PSG Away 2022',
      team: 'Paris Saint-Germain',
      season: '2022',
      kitType: 'away',
      description: "PSG 2022 Away Jersey, white base with Hechter stripe-inspired details, Jordan Jumpman and sponsor logos.",
      images: [
        '/uploads/products/psgaway2022/psgaway20221',
        '/uploads/products/psgaway2022/psgaway20222',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 95,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99, tags: ['PSG', 'Paris', 'Away', 'Nike', 'Jordan', 'White', 'Hechter', 'Stripe', 'Replica', '2022']
    },

    // 23. PSG Fourth 2024
    {
      title: 'PSG Fourth 2024',
      team: 'Paris Saint-Germain',
      season: '2024',
      kitType: 'fourth',
      description: "PSG Jordan Brand Fourth Jersey 2024. Special edition pastel tones with gradient design, Dri-FIT replica version.",
      images: [
        '/uploads/products/pspfourth2024/pspfourth20241',
        '/uploads/products/pspfourth2024/pspfourth20242',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 100,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99, tags: ['PSG', 'Paris', 'Fourth', 'Jordan', 'Nike', 'Pink', 'Gradient', 'Replica', 'QatarAirways', '2024']
    },

    // 24. PSG Home 2022
    {
      title: 'PSG Home 2022',
      team: 'Paris Saint-Germain',
      season: '2022',
      kitType: 'home',
      description: "PSG Home Jersey 2022, Nike Dri-FIT, modern Hechter stripe with blue/red/white gradient.",
      images: [
        '/uploads/products/psghome2022/psghome20221',
        '/uploads/products/psghome2022/psghome20222',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 95,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99, tags: ['PSG', 'Paris', 'Nike', 'Navy', 'Obsidian', 'Red', 'Stripe', 'Home', 'Replica', 'QatarAirways', '2022', '2023']
    },

    // 25. Real Madrid 2012-13 Home
    {
      title: 'Real Madrid 2012-2013 Home Shirt (110th Anniversary)',
      team: 'Real Madrid CF',
      season: '2012-2013',
      kitType: 'home',
      description: "Traditional white home shirt with V-neck, black adidas stripes, black/gold 110th Anniversary patch, subtle vertical striping. Sponsor: bwin.",
      images: [
        '/uploads/products/realmadridhome2012/realmadridhome2012-1',
        '/uploads/products/realmadridhome2012/realmadridhome2012-2',
        '/uploads/products/realmadridhome2012/realmadridhome2012-3',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 10,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99, tags: ['RealMadrid', 'RM', 'adidas', 'HomeKit', 'White', 'bwin', '2012', '2013', '110Years', 'LaLiga']
    },

    // 26. Real Madrid Home 2024
    {
      title: 'Real Madrid Home 2024',
      team: 'Real Madrid CF',
      season: '2024',
      kitType: 'home',
      description: "Real Madrid Home 2024, Adidas kit, white with subtle gradient lines, sponsor: Emirates. Replica version.",
      images: [
        '/uploads/products/realmadridhome2024/realmadridhome20241',
        '/uploads/products/realmadridhome2024/realmadridhome20242',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 95,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99, tags: ['RealMadrid', 'RM', 'adidas', 'HomeKit', 'White', 'Emirates', '2024']
    },

    // 27. Real Madrid Home 2024 v2
    {
      title: 'Real Madrid Home 2024 v2',
      team: 'Real Madrid CF',
      season: '2024',
      kitType: 'home',
      description: "Alternative Real Madrid Home 2024 kit, slightly different detailing and sponsor placement.",
      images: [
        '/uploads/products/realmadridhome2024v2/realmadridhome2024v21',
        '/uploads/products/realmadridhome2024v2/realmadridhome2024v22',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 95,
      oldPrice: 25,
      newPrice: 19.99,
      price: 19.99, tags: ['RealMadrid', 'RM', 'adidas', 'HomeKit', 'White', 'Emirates', '2024', 'v2']
    },

    // 28. Real Madrid Third 2024
    {
      title: 'Real Madrid Third 2024',
      team: 'Real Madrid CF',
      season: '2024',
      kitType: 'third',
      description: "Real Madrid Third Jersey 2024, dark/navy base, subtle geometric pattern, Adidas stripes, sponsor Emirates. Replica version.",
      images: [
        '/uploads/products/realmadridthird2024/realmadridthird20241',
        '/uploads/products/realmadridthird2024/realmadridthird20242',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 95,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99, tags: ['RealMadrid', 'RM', 'adidas', 'ThirdKit', 'Dark', 'Emirates', '2024']
    },
    // 29. germany pink away 2024
    {
      title: 'Germany Away/Third Kit 2024',
      team: 'Germany National Team',
      season: '2024',
      kitType: 'away/third',
      description: "Germany Away/Third Jersey 2024, pink and dark blue gradient design, Adidas stripes, DFB crest. Replica version.",
      images: [
        '/uploads/products/germanyaway2024/germanyaway20241', // Front view of the jersey
        '/uploads/products/germanyaway2024/germanyaway20242', // Back view of the jersey
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 120,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99,
      tags: ['Germany', 'DFB', 'adidas', 'AwayKit', 'Pink', 'Blue', '2024']
    },
    // 30. Germany White Training Set
    {
      title: 'Germany Training Set 2024',
      team: 'Germany National Team',
      season: '2024',
      kitType: 'training set',
      description: "Germany Training Set 2024. White 1/4 zip top with black Adidas stripes and DFB crest, paired with black shorts. Replica version.",
      images: [
        '/uploads/products/germanytrainingset2024/germanytrainingset20241', // Top and shorts view
        '/uploads/products/germanytrainingset2024/germanytrainingset20242', // Back of top
        '/uploads/products/germanytrainingset2024/germanytrainingset20243',

      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 75,
      oldPrice: 25,
      newPrice: 19.99,
      price: 19.99,
      tags: ['Germany', 'DFB', 'adidas', 'TrainingSet', 'White', 'Black', '2024']
    },
    {
      title: 'Manchester City - Haaland 9',
      team: 'Manchester City',
      season: '2024/25',
      kitType: 'third kit',
      description: "Manchester City Haaland 9. White base with electric blue abstract graphic pattern, Puma design, Etihad Airways sponsor, and UCL sleeve details. Replica version.",
      images: [
        '/uploads/products/mancity-haaland-electric/mancity-haaland-electric1',
        '/uploads/products/mancity-haaland-electric/mancity-haaland-electric2',
        '/uploads/products/mancity-haaland-electric/mancity-haaland-electric3',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 75,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99,
      tags: ['ManchesterCity', 'ManCity', 'Puma', 'Haaland', 'ThirdKit', 'White', 'Blue', '2024']
    },

    {
      title: 'Lebanon Kit 2024',
      team: 'Lebanon National Team',
      season: '2024',
      kitType: 'home kit',
      description: "Lebanon Kit 2024. Clean white design with red Adidas accents, featuring the official Lebanon FA crest and classic V-neck finish. Replica version.",
      images: [
        '/uploads/products/lebanon-whitekit/lebanon-whitekit1',
        '/uploads/products/lebanon-whitekit/lebanon-whitekit2',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 75,
      oldPrice: 25,
      newPrice: 19.99,
      price: 19.99,
      tags: ['Lebanon', 'LFA', 'Adidas', 'HomeKit', 'White', 'Red', '2024']
    },

    {
      title: 'Lebanon National Team Home Jersey',
      team: 'Lebanon National Team',
      season: '2024/2025',
      kitType: 'home jersey',
      description: "Lebanon National Team Home Shirt. Classic red jersey featuring white side panels, white V-neck collar, and white Adidas stripes on the shoulders. Features the 'LEBANON' wordmark on the front and the federation crest.",
      images: [
        '/uploads/products/lebanon-redkit/lebanon-redkit1',
        '/uploads/products/lebanon-redkit/lebanon-redkit2',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 50,
      oldPrice: 25,
      newPrice: 19.99,
      price: 19.99,
      tags: ['Lebanon', 'NationalTeam', 'Jersey', 'Home', 'Red', 'Adidas', '2024']
    },

    {
      title: 'FC Barcelona Pre-Match Shirt 2023/2024',
      team: 'FC Barcelona',
      season: '2023/2024',
      kitType: 'pre-match shirt',
      description: "FC Barcelona Pre-Match Top in striking neon green with a subtle all-over pattern. Features the club crest, Nike logo, and the Spotify sponsor print in blue. Worn by the players while warming up before matches. Replica version.",
      images: [
        '/uploads/products/barcelona-2425third/barcelona-2425third1',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 90,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99,
      tags: ['Barcelona', 'Barça', 'Nike', 'Spotify', 'PreMatch', 'Training', 'Green', 'Neon', '2023', '2024']
    },

    {
      title: 'FC Barcelona Special Edition Dark Jersey',
      team: 'FC Barcelona',
      season: '2024',
      kitType: 'special/pre-match shirt',
      description: "FC Barcelona Special Edition Dark Shirt. Black/Dark Navy jersey with a tonal stripe pattern. Features a large red Spotify sponsor logo, subtle blue/red trim on the sides, and a blacked-out club crest and Nike logo.",
      images: [
        '/uploads/products/barcelona-2425-away/barcelona-2425-away1', // Front view
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 85,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99,
      tags: ['Barcelona', 'Barça', 'Nike', 'Spotify', 'Dark', 'Black', 'SpecialEdition', '2024']
    },

    {
      title: 'Real Madrid Third/Away Jersey 2012/2013',
      team: 'Real Madrid CF',
      season: '2012/2013',
      kitType: 'third/away jersey',
      description: "Real Madrid 2012/2013 Green Third/Away Shirt. Classic retro design with a dark green base and white and gold trim, featuring the bwin sponsor, Adidas logo, and club crest. Includes LFP badge on the sleeve. Replica version.",
      images: [
        '/uploads/products/realmadridaway2012/realmadridaway20121', // Front view
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 65,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99,
      tags: ['RealMadrid', 'LosBlancos', 'adidas', 'bwin', 'Green', 'Vintage', 'Retro', '2012', '2013']
    },

    {
      title: 'Portugal National Team Home Jersey 2024 - Nani 17',
      team: 'Portugal National Team',
      season: '2024',
      kitType: 'home jersey',
      description: "Portugal 2024 Home Shirt. Deep red base with green and gold trim on the collar and cuffs. Features **Nani's number 17** print on the chest. Includes the national crest and Nike logo. Replica version.",
      images: [
        '/uploads/products/portugal-nani17/portugal-nani171', // Front view
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 70,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99,
      tags: ['Portugal', 'NationalTeam', 'Jersey', 'Home', 'Nike', 'Red', 'Nani', '17', '2024']
    },

    {
      title: 'Inter Miami CF Home Jersey - Messi 10',
      team: 'Inter Miami CF',
      season: '2023/2024',
      kitType: 'home jersey',
      description: "Inter Miami CF iconic pink Home Shirt, famously worn by Lionel Messi. Features a ribbed polo collar, the XBTO sponsor logo, and the official Messi #10 print on the back. Made with AEROREADY moisture-absorbing fabric. Replica version.",
      images: [
        '/uploads/products/intermiamimessi10/intermiamimessi101', // Front view
        '/uploads/products/intermiamimessi10/intermiamimessi102', // Back view (with print)
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 120,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99,
      tags: ['InterMiami', 'IMCF', 'Messi', '10', 'GOAT', 'Pink', 'MLS', 'adidas', '2023', '2024']
    },

    {
      title: 'Brazil National Team Away Shirt - Neymar Jr. 10',
      team: 'Brazil National Team',
      season: '2024',
      kitType: 'away jersey',
      description: "Brazil National Team Away/Pre-Match Shirt in blue with striking yellow/green patterned sleeves. Features the CBF crest and a 'Neymar Jr. 10' print on the back in yellow. Replica version.",
      images: [
        '/uploads/products/brazil-neymar10-yellowdots/brazil-neymar10-yellowdots1', // Front view (from your other upload)
        '/uploads/products/brazil-neymar10-yellowdots/brazil-neymar10-yellowdots2', // Back view (Neymar Jr. 10)
        // Add more image paths here if available
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 70,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99,
      tags: ['Brazil', 'CBF', 'NationalTeam', 'Jersey', 'Away', 'Neymar', '10', 'Nike', 'Blue', '2024']
    },

    {
      title: 'Real Madrid Training Jersey 2024/2025 - Yellow',
      team: 'Real Madrid CF',
      season: '2024/2025',
      kitType: 'training jersey',
      description: "Real Madrid Training Jersey in vibrant yellow with contrasting blue Adidas stripes on the shoulders and blue side panels. Features the club crest and the Emirates 'Fly Better' sponsor logo. Made with moisture-absorbing technology. Replica version.",
      images: [
        '/uploads/products/realmadridaway2425/realmadridaway24251',
        '/uploads/products/realmadridaway2425/realmadridaway24252',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 80,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99,
      tags: ['RealMadrid', 'LosBlancos', 'adidas', 'Training', 'Yellow', 'Blue', 'Emirates', '2024']
    },

    {
      title: 'Germany Home Jersey 2024 - Kimmich 6',
      team: 'Germany National Team',
      season: '2024',
      kitType: 'home jersey',
      description: "Germany 2024 Home Shirt. Classic white jersey with a prominent black central vertical stripe. Features gold accents on the collar and adidas logo. Customized with Kimmich #6, featuring the unique camouflage-style numbering for the tournament. Replica version.",
      images: [
        '/uploads/products/germany-blackwhite-kimmich6/germany-blackwhite-kimmich61', // Front view (White with Black stripe)
        '/uploads/products/germany-blackwhite-kimmich6/germany-blackwhite-kimmich62', // Back view (Kimmich 6 camo numbers)
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 95,
      oldPrice: 20,
      newPrice: 14.99,
      price: 14.99,
      tags: ['Germany', 'DFB', 'adidas', 'Home', 'Kimmich', '6', 'White', 'Black', '2024', 'Euro2024']
    },

    {
      title: 'Germany Home Jersey 2024 - Long Sleeve',
      team: 'Germany National Team',
      season: '2024',
      kitType: 'home jersey',
      description: "Germany 2024 Home Shirt (Long Sleeve Version). Classic white jersey with a prominent black central vertical stripe and gold accents. Ideal for cooler weather. Features the DFB crest and adidas logo. Replica version.",
      images: [
        '/uploads/products/germany-blackwhite-fullsleeve/germany-blackwhite-fullsleeve1',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 60,
      oldPrice: 15,
      newPrice: 9.99,
      price: 9.99,
      tags: ['Germany', 'DFB', 'adidas', 'Home', 'LongSleeve', 'White', 'Black', '2024', 'Euro2024']
    },

    {
      title: 'FC Barcelona - White Long Sleeve',
      team: 'FC Barcelona',
      season: '2024/2025',
      kitType: 'long sleeve training/pre-match shirt',
      description: "FC Barcelona White Long Sleeve Pre-Match/Training Top. Features a light grey/white color with a subtle, textured geometric pattern. Includes the club crest, blue Spotify sponsor logo, and Nike swoosh. Ideal for training in cooler weather. Replica version.",
      images: [
        '/uploads/products/barcelona-grey-fullsleeve/barcelona-grey-fullsleeve1',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 70,
      oldPrice: 15,
      newPrice: 9.99,
      price: 9.99,
      tags: ['Barcelona', 'Barça', 'Nike', 'Spotify', 'Training', 'White', 'LongSleeve', '2024', '2025']
    },

    {
      title: 'Brazil National Team - Long Sleeve',
      team: 'Brazil National Team',
      season: '2022',
      kitType: 'home jersey',
      description: "Brazil 2022 Home Shirt (Long Sleeve Version). Iconic yellow jersey featuring a subtle tonal jungle/cheetah pattern, a unique buttoned collar, and the FIFA World Cup 2022 badge. Replica version.",
      images: [
        '/uploads/products/brazil-fullsleeve/brazil-fullsleeve1',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 65,
      oldPrice: 15,
      newPrice: 9.99,
      price: 9.99,
      tags: ['Brazil', 'CBF', 'NationalTeam', 'Jersey', 'Home', 'LongSleeve', 'Yellow', 'Nike', '2022', 'WorldCup']
    },

    {
      title: 'FC Barcelona Special Edition Dark',
      team: 'FC Barcelona',
      season: '2024',
      kitType: 'special/pre-match shirt',
      description: "FC Barcelona Special Edition Dark Shirt. Black/Dark Navy jersey with a tonal stripe pattern. Features a large red Spotify sponsor logo, subtle blue/red trim on the sides, and a blacked-out club crest and Nike logo. Replica version.",
      images: [
        '/uploads/products/barcelona-blackpink-quarterzip/barcelona-blackpink-quarterzip1', // Front view
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 85,
      oldPrice: 25,
      newPrice: 19.99,
      price: 19.99,
      tags: ['Barcelona', 'Barça', 'Nike', 'Spotify', 'Dark', 'Black', 'SpecialEdition', '2024']
    },

    {
      title: 'FC Barcelona Black',
      team: 'FC Barcelona',
      season: '2024/2025',
      kitType: 'training top',
      description: "FC Barcelona Black 1/4 Zip. Ideal for cold weather training, featuring a high collar, long sleeves, the classic FC Barcelona crest, and the Nike swoosh. Fleece-lined interior for warmth. Replica version.",
      images: [
        '/uploads/products/barcelona-black-quarterzip/barcelona-black-quarterzip1', // Front view
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 75,
      oldPrice: 25,
      newPrice: 19.99,
      price: 19.99,
      tags: ['Barcelona', 'Barça', 'Nike', 'Training', 'Top', 'Black', '1/4Zip', '2024']
    },

    {
      title: 'Real Madrid Black 1/4 Zip 2024/2025',
      team: 'Real Madrid CF',
      season: '2024/2025',
      kitType: 'training',
      description: "Real Madrid Black 1/4 Zip Training Top. Features a black body with white three-stripe detailing on the shoulders and light gray side panels. Includes the club crest and adidas logo. Ideal for cool-weather training. Replica version.",
      images: [
        '/uploads/products/realmadrid-black-quarterzip/realmadrid-black-quarterzip1', // Front view
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 85,
      oldPrice: 25,
      newPrice: 19.99,
      price: 19.99,
      tags: ['RealMadrid', 'LosBlancos', 'adidas', 'Training', 'Top', 'Black', 'White', '1/4Zip', '2024']
    },

  ];


  // Delete all old products
  try {
    await svc.deleteAll(); // <- Make sure your ProductsService has a deleteAll method
    console.log('All old products deleted.');
  } catch (err: any) {
    console.error('Failed to delete old products:', err.message);
  }

  // Add new products
  for (const item of items) {
    const sizesWithStock = item.sizes.map((size) => ({
      size,
      stock: item.stock,
    }));

    try {
      await svc.create({ ...item, sizes: sizesWithStock });
      console.log(`Created product: ${item.title}`);
    } catch (err: any) {
      console.error(`Failed to create ${item.title}:`, err.message);
    }
  }

  console.log('Database seeding complete!');
  await app.close();
}

run();
