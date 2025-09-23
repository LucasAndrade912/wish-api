export class DomainNotSupportedException extends Error {
    constructor() {
        super('Domain not supported for scraping');
        this.name = 'DomainNotSupportedException';
        this.message = 'Domain not supported for scraping';
    }
}
