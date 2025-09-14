import { FastifyInstance } from 'fastify';

import { IQuerystring } from '../types/request';
import { getAllProductsService } from '../services/getAllProductsService';

export default async function (app: FastifyInstance) {
    app.get<{ Querystring: IQuerystring }>('/products', async (request, reply) => {
        const limit = Number(request.query.limit) || 10;
        const page = Number(request.query.page) || 1;

        const { products, count, pages } = await getAllProductsService({
            limit,
            page,
        });

        app.log.info(`GET /products | Retrieved ${products.length} products`);

        return reply.send({
            data: products,
            message: 'Products retrieved successfully',
            totalRecords: count,
            totalPages: pages,
        });
    });
}
