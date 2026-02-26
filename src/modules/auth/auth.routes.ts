
import { Router } from 'express';
import { AuthController } from './auth.controller';

const authRoutes = Router();
const authController = new AuthController();


authRoutes.post('/register', authController.register);

export { authRoutes };