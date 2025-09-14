import { app } from './app';

const port = Number(process.env.PORT);

async function start() {
    try {
        await app.listen({ port });
        app.log.info(`Server is running on http://localhost:${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

start();
