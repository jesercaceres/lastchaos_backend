import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';


export interface AuthRequest extends Request {
    user?: {
        userCode:number;
        userId: string;
    };
}       
    
export const authMidleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ message: 'Token de autenticação ausente.' });
        return;
    }

    const [, token] = authHeader.split(' ');

    try{
        const secret = process.env.JWT_SECRET;

        if (!secret) throw new Error('JWT_SECRET não configurado');
        
        const decoded = jwt.verify(token, secret) as { userCode: number, userId: string };

        req.user = {
            userCode: decoded.userCode,
            userId: decoded.userId
        };
        
        next();

    } catch (error) {
        res.status(401).json({ message: 'Token inválido.' });
    }
}