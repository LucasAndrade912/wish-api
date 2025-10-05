import { prismaClient } from '../lib/prismaClient';

export async function deleteProductService(productId: string, userId: string) {
    const productExists = await prismaClient.product.findUnique({
        where: { uuid: productId, user: { uuid: userId } },
    });

    if (!productExists) {
        throw new Error('Product not found');
    }

    await prismaClient.product.delete({
        where: { uuid: productId },
    });
}
