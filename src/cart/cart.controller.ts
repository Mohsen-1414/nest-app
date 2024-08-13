import { Controller, Post, Body, Param, Get, Delete, Put, NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/item.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartItemFromBody } from './interface/interface';
import { Cart, CartDocument } from './schema/cart.schema';


@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':userId/add/:productId')
  @ApiResponse({ status: 201, description: 'Item added to cart successfully.' })
  async addToCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Body() body: CartItemFromBody
  ): Promise<CartDocument> {
    return this.cartService.addItem(userId, body);
  }

  @Get(':userId')
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully.' })
  async getCart(@Param('userId') userId: string):Promise<CartDocument> {
    return this.cartService.getCart(userId);
  }

  @Put(':userId/update/:productId')
  @ApiResponse({ status: 200, description: 'Item quantity updated successfully.' })
  async updateCartItem(
    @Param('userId') userId: string,
    @Param('productId') productId: string, 
    @Body() body: CartItemFromBody
  ): Promise<CartDocument> {
    return this.cartService.updateCartItem(userId, productId, body.quantity);
  }

  @Delete(':userId/delete/:productId')
  @ApiResponse({ status: 200, description: 'Item deleted from cart successfully.' })
  async deleteCartItem(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ): Promise <Cart> {
    return this.cartService.deleteCartItem(userId, productId);
  }


  @Delete(':userId')
  @ApiResponse({ status: 200, description: 'Cart deleted successfully.' }) 
  async deleteCart(@Param('userId') userId: string): Promise<void> {
    return this.cartService.deleteCart(userId);
  }

  @Get(':userId/report')
    async generateCartReport(@Param('userId') userId: string): Promise<void> {
    return this.cartService.generateReport(userId);
  }


}
