import fastify from 'fastify';

const app = fastify({ logger: true });

app.get('/', async (request, reply) => {
    return reply.send({ message: 'Hello, World!' });
});

app.listen({ port: 3000 });
