import { UserRepository } from '../users/user.repository';
import { GameUserRepository } from '../game/gameUser.repository';
import { comparePassword, hashPassword } from '../../shared/utils/hash';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AppError } from '../../shared/errors/AppError';
import { prisma } from '../../config/prisma'; 
import { ForgotPasswordDto } from './dtos/forgotPasswd.dto';
import { generateAuthToken } from '../../shared/utils/jwt';

export class AuthService {
  private userRepository = new UserRepository();
  private gameUserRepository = new GameUserRepository();

  async register(data: RegisterDto) {

    const userExists = await this.userRepository.findByUsername(data.userId);
    const emailExists = await this.userRepository.findByEmail(data.email);

    if (userExists) {
      throw new AppError('Este nome de usuário já está em uso.', 409);
    }

    if (emailExists) {
      throw new AppError('Este e-mail já está em uso.', 409);
    }

    const hashedPassword = await hashPassword(data.passwd);

    try {
      let createdUserId = '';

      await prisma.$transaction(async (tx) => {
        const webAccount = await this.userRepository.createWebAccount(
          data.userId,
          hashedPassword,
          data.email,
          tx 
        );

        await this.gameUserRepository.createGameAccount(
          data.userId,
          webAccount.userCode,
          tx 
        );

        createdUserId = webAccount.userId;
      });

      return { message: 'Conta criada com sucesso!', userId: createdUserId };

    } catch (error: any) {
      console.error("🚨 ERRO INTERNO AO CRIAR CONTA (PRISMA):", error);
      throw new AppError('Ocorreu um erro interno ao processar o seu registo. Tente novamente mais tarde.', 500);
    }
  }

  async login(data: LoginDto) {
    const user = await this.userRepository.findByUsername(data.userId);

    if (!user || !user.passwd) {
      throw new AppError('Usuário ou senha incorretos.', 401);
    }

    const isPasswordValid = await comparePassword(data.passwd, user.passwd);

    if (!isPasswordValid) {
      throw new AppError('Usuário ou senha incorretos.', 401);
    }

    const token = generateAuthToken({ userCode: user.userCode, userId: user.userId });

    return {
      message: 'Login bem-sucedido!',
      token,
      user: { userCode: user.userCode, userId: user.userId, email: user.email }
    };
  }

}
