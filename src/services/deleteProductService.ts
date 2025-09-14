import { prismaClient } from '../lib/prismaClient';

export async function deleteProductService(id: string) {
    const productExists = await prismaClient.product.findUnique({
        where: { uuid: id },
    });

    if (!productExists) {
        throw new Error('Product not found');
    }

    await prismaClient.product.delete({
        where: { uuid: id },
    });
}
