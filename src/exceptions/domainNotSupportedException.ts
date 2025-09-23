export class DomainNotSupportedException extends Error {
    constructor() {
        super('Domain not supported for scraping. Supported domains: pt.aliexpress.com');
        this.name = 'DomainNotSupportedException';
        this.message =
            'Domain not supported for scraping. Supported domains: pt.aliexpress.com';
    }
}
