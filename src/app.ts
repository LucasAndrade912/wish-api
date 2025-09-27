import fastify from 'fastify';
import autoLoad from '@fastify/autoload';
import cors from '@fastify/cors';
import path from 'node:path';

export const app = fastify({ logger: true });

app.register(autoLoad, {
    dir: path.join(__dirname, 'routes'),
    dirNameRoutePrefix: false,
    options: { prefix: '/api' },
    forceESM: true,
});

app.register(cors, {
    origin: '*',
});
