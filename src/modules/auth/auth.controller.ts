import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { registerSchema } from './dtos/register.dto';
import { loginSchema } from './dtos/login.dto';

export class AuthController {
    private authService = new AuthService();

    public register = async (req: Request, res: Response): Promise<void> => {
        try {
            // 2. O Zod pega o req.body e testa contra todas aquelas regras que criámos
            const validation = registerSchema.safeParse(req.body);

            // 3. Se chumbou na validação (ex: e-mail inválido, senha sem maiúscula)
            if (!validation.success) {
                res.status(400).json({ errors: validation.error.format() });
                return;
            }

            // 4. Se passou, o Zod entrega-nos os dados perfeitos e tipados dentro do "validation.data"
            const result = await this.authService.register(validation.data);
            res.status(201).json(result);

        } catch (error: any) {
            res.status(400).json({ error: error.message });
        };
    };

    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            // Fazemos o mesmo para o Login
            const validation = loginSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({ errors: validation.error.format() });
                return;
            }

            // Passamos os dados validados para o Service
            const result = await this.authService.login(validation.data);
            res.status(200).json(result);

        } catch (error: any) {
            res.status(401).json({ error: error.message }); // 401 = Unauthorized
        }
    }
}