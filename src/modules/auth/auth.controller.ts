import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { registerSchema } from './dtos/register.dto';
import { loginSchema } from './dtos/login.dto';
import { forgotPasswordSchema } from './dtos/forgotPasswd.dto'; // Importado
import { resetPasswordSchema } from './dtos/resetPasswd.dto';   // Importado

export class AuthController {
    private authService = new AuthService();

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
            next(error);
        }
    };

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
            next(error);
        }
    };

    // NOVO: Solicitação de link (Esqueci minha senha)
    public forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const validation = forgotPasswordSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({ errors: validation.error.format() });
                return;
            }

            const result = await this.authService.forgotPassword(validation.data);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    // NOVO: Redefinição final com a nova senha
    public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const validation = resetPasswordSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({ errors: validation.error.format() });
                return;
            }

            const result = await this.authService.resetPassword(validation.data);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
}