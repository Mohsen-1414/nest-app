
import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import { ProductsModule } from './product/products.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { SeedingModule } from './seeds/seeding.module';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URL), ProductsModule, UserModule, AuthModule,SeedingModule, CartModule, 
    MulterModule.register({
    dest: './uploads', 
    limits: {
      fileSize: 1024 * 1024 * 5, // Maximum file size (5MB in this example)
    }, 
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}


 