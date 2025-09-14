import { prismaClient } from '../lib/prismaClient';

interface Product {
    title: string;
    price: number;
    photoUrl: string;
    link: string;
}

export async function createProductService(product: Product) {
    const createdProduct = await prismaClient.product.create({
        data: { ...product },
    });

    return {
        id: createdProduct.uuid,
        title: createdProduct.title,
        price: createdProduct.price,
        formattedPrice: new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(createdProduct.price / 100),
        photoUrl: createdProduct.photoUrl,
        link: createdProduct.link,
        createdAt: createdProduct.createdAt,
        updatedAt: createdProduct.updatedAt,
    };
}
