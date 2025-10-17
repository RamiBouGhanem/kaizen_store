import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const uri = cfg.get<string>('MONGO_URL');
        if (!uri) {
          // helpful hard error if .env missing
          throw new Error('MONGO_URL is not set');
        }
        return { uri };
      },
    }),
    ProductsModule,
  ],
})
export class AppModule {}
