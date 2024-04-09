import { Controller, Post, Body, Param, Get, Delete, Put } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':userId/add/:productId')
  async addToCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Body() body: { quantity: number }
  ) {
    return this.cartService.addItem(userId, { productId, quantity: body.quantity });
  }

  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Put(':userId/update/:productId')
  async updateCartItem(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Body() body: { quantity: number }
  ) {
    return this.cartService.updateCartItem(userId, productId, body.quantity);
  }

  @Delete(':userId/delete/:productId')
  async deleteCartItem(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.deleteCartItem(userId, productId);
  }


  @Delete(':userId')
  async deleteCart(@Param('userId') userId: string) {
    return this.cartService.deleteCart(userId);
  }
}
