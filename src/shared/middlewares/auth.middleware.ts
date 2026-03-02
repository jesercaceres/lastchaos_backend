import { Request, Response, NextFunction } from 'express';
import { extractBearerToken, verifyAuthToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: {
    userCode: number;
    userId: string;
  };
}

export const authMidleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    res.status(401).json({ message: 'Token de autenticação ausente.' });
    return;
  }

  try {
    const decoded = verifyAuthToken(token);

    req.user = {
      userCode: decoded.userCode,
      userId: decoded.userId
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido.' });
  }
};
