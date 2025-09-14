import { z } from 'zod';
import { FastifyInstance } from 'fastify';

import { IQuerystring } from '../types/request';
import { getAllProductsService } from '../services/getAllProductsService';
import { createProductService } from '../services/createProductService';
import { updateProductService } from '../services/updateProductService';
import { deleteProductService } from '../services/deleteProductService';

export default async function (app: FastifyInstance) {
    const createProductSchema = z.object({
        title: z.string().min(3).max(255),
        price: z.number().min(0),
        photoUrl: z.url(),
        link: z.url(),
    });

    const updateProductSchema = z.object({
        title: z.string().min(3).max(255).optional(),
        price: z.number().min(0).optional(),
        photoUrl: z.url().optional(),
        link: z.url().optional(),
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

    app.put('/products/:id', async (request, reply) => {
        const { id } = request.params as { id: string };

        const result = updateProductSchema.safeParse(request.body);

        if (!result.success) {
            return reply.status(400).send({
                error: 'Invalid request body',
                details: z.prettifyError(result.error),
            });
        }

        try {
            const updatedData = await updateProductService({
                id,
                ...result.data,
            });

            app.log.info(`PUT /products/${id} | Updated product`);

            return reply.send({
                message: 'Product updated successfully',
                data: updatedData,
            });
        } catch (error) {
            if (error instanceof Error) {
                app.log.error(
                    `PUT /products/${id} | Error updating product: ${error.message}`
                );

                return reply.status(400).send({ error: error.message, details: null });
            }
        }
    });

    app.delete('/products/:id', async (request, reply) => {
        const { id } = request.params as { id: string };

        app.log.info(`DELETE /products/${id} | Delete functionality not implemented`);

        try {
            await deleteProductService(id);

            return reply.send({ message: 'Product deleted successfully', data: null });
        } catch (error) {
            if (error instanceof Error) {
                app.log.error(
                    `DELETE /products/${id} | Error deleting product: ${error.message}`
                );

                return reply.status(400).send({ error: error.message, details: null });
            }
        }
    });
}
