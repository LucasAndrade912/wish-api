import { prismaClient } from '../lib/prismaClient';

interface Params {
    limit: number;
    page: number;
    userId: string;
}

export async function getAllProductsService({ limit, page, userId }: Params) {
    const countProducts = await prismaClient.product.count();
    const countPages = Math.ceil(countProducts / limit);

    const products = await prismaClient.product.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: { user: { uuid: userId } },
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
            link: product.link,
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
