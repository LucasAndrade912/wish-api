import fastify from 'fastify';
import autoLoad from '@fastify/autoload';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';

import path from 'node:path';

export const app = fastify({ logger: true });

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

if (!process.env.COOKIE_SECRET) {
    throw new Error('COOKIE_SECRET is not defined in environment variables');
}

app.register(cors, {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
});

app.register(cookie, {
    secret: process.env.COOKIE_SECRET,
    hook: 'onRequest',
});

app.register(jwt, {
    secret: process.env.JWT_SECRET,
    cookie: {
        cookieName: 'access_token',
        signed: false,
    },
});

app.register(autoLoad, {
    dir: path.join(__dirname, 'routes'),
    dirNameRoutePrefix: false,
    options: { prefix: '/api' },
    forceESM: true,
});
