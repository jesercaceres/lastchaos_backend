import { Request, Response, NextFunction } from 'express'; // 1. Adicionado NextFunction
import { AuthService } from './auth.service';
import { registerSchema } from './dtos/register.dto';
import { loginSchema } from './dtos/login.dto';

export class AuthController {
    private authService = new AuthService();

    // 2. Adicionado o parâmetro 'next'
    public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const validation = registerSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({ errors: validation.error.format() });
                return;
            }

            const result = await this.authService.register(validation.data);
            res.status(201).json(result);

        } catch (error) {
            // 3. Passa o erro para o Middleware Global (error.middleware.ts)
            next(error);
        };
    };

    // 2. Adicionado o parâmetro 'next'
    public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const validation = loginSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({ errors: validation.error.format() });
                return;
            }

            const result = await this.authService.login(validation.data);
            res.status(200).json(result);

        } catch (error) {
            // 3. A MÁGICA: Passa o erro para o Middleware Global
            next(error);
        }
    }
}