import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env';

export interface AuthTokenPayload {
  userCode: number;
  userId: string;
}

export interface ResetTokenPayload {
  userCode: number;
  email: string;
}

const DEFAULT_EXPIRES_IN: SignOptions['expiresIn'] = '24h';

export function generateAuthToken(
  payload: AuthTokenPayload,
  expiresIn: SignOptions['expiresIn'] = DEFAULT_EXPIRES_IN
): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (
    typeof decoded !== 'object' ||
    decoded === null ||
    !('userCode' in decoded) ||
    !('userId' in decoded) ||
    typeof decoded.userCode !== 'number' ||
    typeof decoded.userId !== 'string'
  ) {
    throw new Error('Token inválido');
  }

  return {
    userCode: decoded.userCode,
    userId: decoded.userId
  };
}

export function extractBearerToken(authorizationHeader?: string): string | null {
  if (!authorizationHeader) return null;

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer' || !token) return null;

  return token;
}

export function generateResetToken (payload: ResetTokenPayload, userPasswordHash: string): string {
  const resetSecret = env.JWT_SECRET + userPasswordHash;
  return jwt.sign(payload, resetSecret, { expiresIn: '15m' });
}

export function verifyResetToken(token: string, userPasswordHash: string): ResetTokenPayload {
  const resetSecret = env.JWT_SECRET + userPasswordHash;
  const decoded = jwt.verify(token, resetSecret);

  if (
    typeof decoded !== 'object' ||
    decoded === null ||
    !('userCode' in decoded) ||
    !('email' in decoded) ||
    typeof decoded.userCode !== 'number' ||
    typeof decoded.email !== 'string'
  ) {
    throw new Error('Token de recuperação inválido ou expirado');
  }

  return {
    userCode: decoded.userCode,
    email: decoded.email
  };
}