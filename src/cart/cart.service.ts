import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartDto } from './dto';
import { UpdateCartDto } from './dto/update.cart.dto';
import { UUID } from 'crypto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getAllCartProducts(id: string) {
    return this.prisma.cart_Has_Product.findMany({
      where: { cartId: id },
      orderBy: {
        productId: 'desc',
      },
      select: {
        productId: true,
        quantity: true,
      },
    });
  }

  async addCartProduct(dto: CartDto, id: string) {
    const newCartProduct = await this.prisma.cart_Has_Product.create({
      data: {
        cartId: id,
        productId: dto.productId,
        quantity: dto.quantity,
      },
    });
    return {
      message: 'Product added to cart !',
      newCartProduct: newCartProduct,
    };
  }

  async updateCartProduct(
    cartId: string,
    productId: string,
    dto: UpdateCartDto,
  ) {
    const existingCart = await this.prisma.cart_Has_Product.findUnique({
      where: {
        cartId_productId: {
          cartId: cartId,
          productId: productId,
        },
      },
    });

    if (!existingCart || !existingCart.cartId || !existingCart.productId) {
      throw new ForbiddenException('Unexisting cart or product');
    }

    const updatedCartProduct = await this.prisma.cart_Has_Product.update({
      where: {
        cartId_productId: {
          cartId: cartId,
          productId: productId,
        },
      },
      data: { quantity: dto.quantity },
    });
    return {
      message: 'Cart product updated !',
      updatedCartProduct: updatedCartProduct,
    };
  }

  async deleteCartProduct(cartId: string, productId: string) {
    const existingCart = await this.prisma.cart_Has_Product.findUnique({
      where: {
        cartId_productId: {
          cartId: cartId,
          productId: productId,
        },
      },
    });

    if (!existingCart || !existingCart.cartId || !existingCart.productId) {
      throw new ForbiddenException('Unexisting cart or product');
    }

    const deletedCartProduct = await this.prisma.cart_Has_Product.delete({
      where: {
        cartId_productId: {
          cartId: cartId,
          productId: productId,
        },
      },
    });
    return {
      message: 'Cart product deleted !',
      deletedCartProduct: deletedCartProduct,
    };
  }
}