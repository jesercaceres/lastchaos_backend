import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    
    // 1. Se for um erro que nós criámos e controlamos (AppError)
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
        return;
    }

    // 2. Se for um erro desconhecido (ex: falha na base de dados, sintaxe)
    console.error('🚨 Erro Crítico Não Tratado:', err);
    
    res.status(500).json({
        status: 'error',
        message: 'Ocorreu um erro interno no servidor.',
    });
    return;
};