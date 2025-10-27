import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProductsModule } from './products/products.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Serve disk uploads at /api/uploads/** so it matches VITE_API_URL that ends with /api
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), process.env.UPLOADS_DIR || 'uploads/products'),
      serveRoot: '/api/uploads',
      serveStaticOptions: { index: false, fallthrough: true, redirect: false },
    }),



    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        uri: cfg.get<string>('MONGO_URI'),
      }),
    }),

    ProductsModule,
    UploadsModule,
  ],
})
export class AppModule { }
