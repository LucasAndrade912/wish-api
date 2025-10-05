import bcrypt from 'bcrypt';

import { prismaClient } from '../lib/prismaClient';
import { InvalidEmailOrPasswordException } from '../exceptions/invalidEmailOrPasswordException';
import { SignOptions, SignPayloadType } from '@fastify/jwt';

interface Params {
    email: string;
    password: string;
    signTokenFn: (payload: SignPayloadType, options?: Partial<SignOptions>) => string;
}

export async function loginService({ email, password, signTokenFn }: Params) {
    const user = await prismaClient.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new InvalidEmailOrPasswordException();
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new InvalidEmailOrPasswordException();
    }

    const accessToken = signTokenFn(
        {
            email: user.email,
            name: user.name,
        },
        {
            sub: user.uuid,
            expiresIn: '12h',
        }
    );

    return {
        id: user.uuid,
        email: user.email,
        name: user.name,
        accessToken,
    };
}
