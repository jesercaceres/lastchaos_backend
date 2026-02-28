export class AppError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;

        //Mantém a stack trace correta para onde o erro foi lançado
        Error.captureStackTrace(this, this.constructor);
    }
}