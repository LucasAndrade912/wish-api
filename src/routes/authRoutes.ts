import { z } from 'zod';
import { FastifyInstance } from 'fastify';

import { signUpService } from '../services/signUpService';
import { EmailAlreadyUsedException } from '../exceptions/emailAlreadyUsedException';
import { loginService } from '../services/loginService';
import { InvalidEmailOrPasswordException } from '../exceptions/invalidEmailOrPasswordException';

const MAX_AGE_COOKIE_12_HOURS = 12 * 60 * 60; // 12 hours in seconds

export default async function (app: FastifyInstance) {
    const loginSchema = z.object({
        email: z.email(),
        password: z.string().min(8).max(128),
    });

    const signUpSchema = z.object({
        email: z.email(),
        password: z.string().min(8).max(128),
        name: z.string().min(3).max(100),
    });

    app.post('/auth/login', async (request, reply) => {
        const result = loginSchema.safeParse(request.body);

        if (!result.success) {
            return reply.status(400).send({
                error: 'Invalid request body',
                details: z.prettifyError(result.error),
            });
        }

        const { email, password } = result.data;

        try {
            const user = await loginService({
                email,
                password,
                signTokenFn: app.jwt.sign,
            });

            reply.setCookie('access_token', user.accessToken, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: MAX_AGE_COOKIE_12_HOURS,
            });

            app.log.info(`POST /auth/login | User logged in: ${user.email}`);

            return reply.send({
                data: user,
                message: 'Login successful',
            });
        } catch (error) {
            if (error instanceof InvalidEmailOrPasswordException) {
                app.log.error(`POST /auth/login | ${error.message}`);
                return reply.status(401).send({
                    error: error.message,
                });
            }

            app.log.error(`POST /auth/login | Unexpected error`);
            return reply.status(500).send({ error: 'Unexpected error' });
        }
    });

    app.post('/auth/sign-up', async (request, reply) => {
        const result = signUpSchema.safeParse(request.body);

        if (!result.success) {
            return reply.status(400).send({
                error: 'Invalid request body',
                details: z.prettifyError(result.error),
            });
        }

        const { email, password, name } = result.data;

        try {
            const newUser = await signUpService({
                email,
                password,
                name,
                signTokenFn: app.jwt.sign,
            });

            reply.setCookie('access_token', newUser.accessToken, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: MAX_AGE_COOKIE_12_HOURS,
            });

            app.log.info(`POST /auth/sign-up | New user created: ${newUser.email}`);

            return reply.status(201).send({
                data: newUser,
                message: 'User created successfully',
            });
        } catch (error) {
            if (error instanceof EmailAlreadyUsedException) {
                app.log.error(`POST /auth/sign-up | ${error.message}`);
                return reply.status(400).send({
                    error: error.message,
                });
            }

            app.log.error(`POST /auth/sign-up | Unexpected error`);
            return reply.status(500).send({ error: 'Unexpected error' });
        }
    });
}
