import fastify from 'fastify';

import { prismaClient } from './lib/prismaClient';

const app = fastify({ logger: true });

app.get('/', async (request, reply) => {
    const products = await prismaClient.product.findMany();
    return reply.send({ products });
});

app.listen({ port: Number(process.env.PORT) });
