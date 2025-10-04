import fastify from 'fastify';
import autoLoad from '@fastify/autoload';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';

import path from 'node:path';

export const app = fastify({ logger: true });

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

app.register(autoLoad, {
    dir: path.join(__dirname, 'routes'),
    dirNameRoutePrefix: false,
    options: { prefix: '/api' },
    forceESM: true,
});

app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
});

app.register(jwt, {
    secret: process.env.JWT_SECRET,
});
