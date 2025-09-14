import { z } from 'zod';
import { FastifyInstance } from 'fastify';

import { IQuerystring } from '../types/request';
import { getAllProductsService } from '../services/getAllProductsService';
import { createProductService } from '../services/createProductService';

export default async function (app: FastifyInstance) {
    const createProductSchema = z.object({
        title: z.string().min(3).max(255),
        price: z.number().min(0),
        photoUrl: z.url(),
        link: z.url(),
    });

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

    app.post('/products', async (request, reply) => {
        const result = createProductSchema.safeParse(request.body);

        if (!result.success) {
            return reply.status(400).send({
                error: 'Invalid request body',
                details: z.prettifyError(result.error),
            });
        }

        const createdProduct = await createProductService(result.data);

        app.log.info(`POST /products | Created product: ${result.data.title}`);

        return reply
            .status(201)
            .send({ message: 'Product created successfully', data: createdProduct });
    });
}
