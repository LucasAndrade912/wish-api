export class InvalidEmailOrPasswordException extends Error {
    constructor() {
        super('Invalid email or password');
        this.name = 'InvalidEmailOrPasswordException';
        this.message = 'Invalid email or password';
    }
}
