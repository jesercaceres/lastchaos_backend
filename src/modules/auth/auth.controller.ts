import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';

export class AuthController {
    private authService = new AuthService();

    public register = async (req: Request, res: Response): Promise<void> => {
        try {
            const registerData: RegisterDto = {
                userId: req.body.userId,
                passwd: req.body.passwd,
                confirmPasswd: req.body.confirmPasswd,
                email: req.body.email
            };

            // 1. Validação Burra: Campos em branco
            if (!registerData.userId || !registerData.passwd || !registerData.email) {
                res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
                return;
            }

            // 2. Validação Burra: Senhas coincidem em texto puro?
            if (registerData.passwd !== registerData.confirmPasswd) {
                res.status(400).json({ message: 'A senha e a confirmação de senha não coincidem.' });
                return;
            }

            // Se passou pelo leão de chácara, manda pro Service!
            const result = await this.authService.register(registerData);
            res.status(201).json(result);

        } catch (error: any) {
            res.status(400).json({ error: error.message });
        };
    };

    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const loginData = {
                userId: req.body.userId,
                passwd: req.body.passwd
            };

            if (!loginData.userId || !loginData.passwd) {
                res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
                return;
            }
            const result = await this.authService.login(loginData);
            res.status(200).json(result);

        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }


}