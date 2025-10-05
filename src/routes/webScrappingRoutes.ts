import { FastifyInstance } from 'fastify';

import { IQuerystringScrape } from '../types/request';
import { webScrappingService } from '../services/webScrappingService';
import { DomainNotSupportedException } from '../exceptions/domainNotSupportedException';
import { authenticate } from '../hook/authenticate';

export default async function (app: FastifyInstance) {
    app.addHook('onRequest', authenticate);

    app.get<{ Querystring: IQuerystringScrape }>('/scrape', async (request, response) => {
        const url = request.query.url;

        try {
            const scrapeResult = await webScrappingService(url);

            return response.send({
                data: scrapeResult,
                message: 'Scrapping already done',
            });
        } catch (error) {
            if (error instanceof DomainNotSupportedException) {
                return response.status(400).send({
                    error: error.message,
                });
            }

            return response.status(500).send({
                error: 'Internal server error',
            });
        }
    });
}
