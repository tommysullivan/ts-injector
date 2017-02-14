export class NotImplementedError extends Error {
    constructor(message:string = '[empty]') {
        super(`Not Implemented. Message: ${message}`);
    }
}