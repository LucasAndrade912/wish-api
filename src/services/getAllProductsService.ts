import { prismaClient } from '../lib/prismaClient';

interface Params {
    limit: number;
    page: number;
}

export async function getAllProductsService({ limit, page }: Params) {
    const countProducts = await prismaClient.product.count();
    const countPages = Math.ceil(countProducts / limit);

    const products = await prismaClient.product.findMany({
        take: limit,
        skip: (page - 1) * limit,
    });

    const mappedProducts = products.map((product) => {
        return {
            id: product.uuid,
            title: product.title,
            price: product.price,
            formattedPrice: new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(product.price / 100),
            photoUrl: product.photoUrl,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    });

    return {
        products: mappedProducts,
        count: countProducts,
        pages: countPages,
    };
}
