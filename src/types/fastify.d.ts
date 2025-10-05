import '@fastify/jwt';

declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: {
            email: string;
            name: string;
            sub: string;
            iat: number;
            exp: number;
        };
    }
}
