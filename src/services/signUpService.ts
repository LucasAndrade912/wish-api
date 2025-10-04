import bcrypt from 'bcrypt';
import { SignOptions, SignPayloadType } from '@fastify/jwt';

import { prismaClient } from '../lib/prismaClient';
import { EmailAlreadyUsedException } from '../exceptions/emailAlreadyUsedException';

interface Params {
    email: string;
    password: string;
    name: string;
    signTokenFn: (payload: SignPayloadType, options?: Partial<SignOptions>) => string;
}

export async function signUpService({ email, password, name, signTokenFn }: Params) {
    const user = await prismaClient.user.findUnique({
        where: { email },
    });

    if (user) {
        throw new EmailAlreadyUsedException();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await prismaClient.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    });

    const accessToken = signTokenFn(
        {
            email: createdUser.email,
            name: createdUser.name,
        },
        {
            sub: createdUser.uuid,
            expiresIn: '12h',
        }
    );

    return {
        id: createdUser.uuid,
        email: createdUser.email,
        name: createdUser.name,
        accessToken,
    };
}
