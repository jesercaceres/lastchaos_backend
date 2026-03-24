import jwt from 'jsonwebtoken';
import { UserRepository } from '../users/user.repository';
import { GameUserRepository } from '../game/gameUser.repository';
import { comparePassword, hashPassword } from '../../shared/utils/hash';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AppError } from '../../shared/errors/AppError';
import { prisma } from '../../config/prisma';
import { ForgotPasswordDto } from './dtos/forgotPasswd.dto';
import { generateAuthToken, generateResetToken, verifyResetToken } from '../../shared/utils/jwt';
import { MailProvider } from '../../shared/providers/MailProvider';
import { ResetPasswordDto } from './dtos/resetPasswd.dto';


export class AuthService {
  private userRepository = new UserRepository();
  private gameUserRepository = new GameUserRepository();
  private mailProvider = new MailProvider();

  public async register(data: RegisterDto) {

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

  public async login(data: LoginDto) {
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

  public async forgotPassword(data: ForgotPasswordDto) {
    const user = await this.userRepository.findByIdentifier(data.identifier);

    if (!user || !user.email) {
      throw new AppError('Se este usuário existir e tiver um e-mail vinculado, um link de recuperação será enviado.', 200);
    }

    const token = generateResetToken(
      { userCode: user.userCode, email: user.email },
      user.passwd!
    );

    await this.mailProvider.sendPasswordResetMail(user.email, token, user.userId);

    const secretEmail = user.email.replace(/(.{2}).+(@.+)/, '$1****$2');

    return { message: `Link de recuperação enviado para o e-mail: ${secretEmail}` };
  }

 public async resetPassword(data: ResetPasswordDto) {
    
    const decoded = jwt.decode(data.token) as { email: string };

    if (!decoded || !decoded.email) {
      throw new AppError('Token de recuperação inválido.', 400);
    }

    // 3. Busca o usuário para obter o passwd (hash antigo) necessário para validar a assinatura
    const user = await this.userRepository.findByEmail(decoded.email);
    
    if (!user || !user.passwd) {
      throw new AppError('Token de recuperação inválido.', 400);
    }

    try {
      // 4. Agora sim, validamos a assinatura usando o segredo dinâmico
      verifyResetToken(data.token, user.passwd);

      // 5. Gera o novo hash para a nova senha
      const newHashedPassword = await hashPassword(data.newPassword);

      // 6. Atualiza no banco usando o userId (conforme definido no seu esquema)
      await prisma.bgUser.update({
        where: { userId: user.userId },
        data: { 
          passwd: newHashedPassword,
          updateTime: new Date()
        }
      });

      return { message: 'Senha alterada com sucesso!' };

    } catch (error) {
      // Se a assinatura falhar (senha já mudou ou expirou), cai aqui
      throw new AppError('Este link de recuperação expirou ou já foi utilizado.', 401);
    }
  }
}
