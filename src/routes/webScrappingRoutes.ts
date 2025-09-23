import { FastifyInstance } from 'fastify';
import { webScrappingService } from '../services/webScrappingService';
import { IQuerystringScrape } from '../types/request';

export default async function (app: FastifyInstance) {
    app.get<{ Querystring: IQuerystringScrape }>('/scrape', async (request, response) => {
        const url = request.query.url;
        const scrapeResult = await webScrappingService(url);

        return response.send({
            data: scrapeResult,
            message: 'Scrapping already done',
        });
    });
}
