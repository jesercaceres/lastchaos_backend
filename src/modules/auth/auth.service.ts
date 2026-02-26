import { UserRepository } from '../users/user.repository';
import { GameUserRepository } from '../game/gameUser.repository';
import { comparePassword, hashPassword } from '../../shared/utils/hash';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import jwt from 'jsonwebtoken';


export class AuthService {
  private userRepository = new UserRepository();
  private gameUserRepository = new GameUserRepository();

  async register(data: RegisterDto) {

    // 1. Validação Inteligente: Vai no DB ver se existe
    const userExists = await this.userRepository.findByUsername(data.userId);
    const emailExists = await this.userRepository.findByEmail(data.email);

    if (userExists) {
      throw new Error('Este nome de usuário já está em uso.');
    }

    if (emailExists) {
      throw new Error('Este e-mail já está em uso.');
    }

    // 2. Faz o hash UMA única vez da senha que já sabemos que está certa
    const hashedPassword = await hashPassword(data.passwd);

    try {
      // 3. Salva no site
      const webAccount = await this.userRepository.createWebAccount(
        data.userId,
        hashedPassword,
        data.email
      );

      // 4. Salva no jogo
      await this.gameUserRepository.createGameAccount(
        data.userId,
        webAccount.userCode // Usa o ID gerado!
      );

      return { message: 'Conta criada com sucesso!', userId: webAccount.userId };

    } catch (error: any) {
      // 👇 AGORA SIM! Vamos cuspir o erro original do Prisma no console!
      console.error("🚨 ERRO REAL DO PRISMA AQUI:", error);

      // E jogamos o erro original pra frente, sem esconder nada
      throw error;
    }
  }

  async login(data: LoginDto) {

    const user = await this.userRepository.findByUsername(data.userId);

    if (!user || !user.passwd) {
      throw new Error('Usuário ou senha incorretos.');
    }

    const isPasswordValid = await comparePassword(data.passwd, user.passwd);

    if (!isPasswordValid) {
      throw new Error('Usuário ou senha incorretos.');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET não configurado');


    const token = jwt.sign(
      {
        userCode: user.userCode,
        userId: user.userId
      },
      secret,
      { expiresIn: '24h' }
    );

    return {
      message: 'Login bem-sucedido!',
      token,
      user: {
        userCode: user.userCode,
        userId: user.userId,
        email: user.email
      }
    };
  }
}