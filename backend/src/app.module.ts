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

    // Serve /uploads/** from <project>/uploads/**
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'src', 'uploads', 'products'),
      serveRoot: '/uploads/products',
    })
    ,



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
