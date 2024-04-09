
import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import { ProductsModule } from './product/products.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URL), ProductsModule, UserModule, AuthModule, CartModule],
  controllers: [],
  providers: [],
})
export class AppModule {}


 