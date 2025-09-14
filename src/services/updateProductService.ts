import { prismaClient } from '../lib/prismaClient';

interface Product {
    id: string;
    title?: string;
    price?: number;
    photoUrl?: string;
    link?: string;
}

export async function updateProductService(product: Product) {
    const existingProduct = await prismaClient.product.findUnique({
        where: { uuid: product.id },
    });

    if (!existingProduct) {
        throw new Error('Product not found');
    }

    const updatedProduct = await prismaClient.product.update({
        where: { uuid: product.id },
        data: {
            title: product.title ? product.title : existingProduct.title,
            price: product.price ? product.price : existingProduct.price,
            photoUrl: product.photoUrl ? product.photoUrl : existingProduct.photoUrl,
            link: product.link ? product.link : existingProduct.link,
        },
    });

    return {
        id: updatedProduct.uuid,
        title: updatedProduct.title,
        price: updatedProduct.price,
        formattedPrice: new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(updatedProduct.price / 100),
        photoUrl: updatedProduct.photoUrl,
        link: updatedProduct.link,
        createdAt: updatedProduct.createdAt,
        updatedAt: updatedProduct.updatedAt,
    };
}
