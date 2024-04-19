import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ProductSeeder } from './seeds/product.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  const productSeeder = app.get(ProductSeeder);
  await productSeeder.seed();

  // Swagger config 
  const config = new DocumentBuilder()
    .setTitle('Your API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
