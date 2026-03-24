import nodemailer from 'nodemailer';
import { env } from '../../config/env';

export class MailProvider {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS,
      },
    });
  }

  async sendPasswordResetMail(to: string, token: string, userId: string) {
    // URL que o usuário clicará no e-mail
    const resetLink = `http://localhost:5173/recovery?token=${token}&userId=${userId}`;

    await this.transporter.sendMail({
      from: env.MAIL_FROM,
      to,
      subject: 'Recuperação de Senha',
      html: `
        <div style="font-family: sans-serif;">
          <h1>Recuperação de Senha</h1>
          <p>Você solicitou a alteração de senha para a conta: <strong>${userId}</strong></p>
          <p>Clique no link abaixo para definir uma nova senha (válido por 15 min):</p>
          <a href="${resetLink}" style="color: #7c3aed;">Redefinir minha senha</a>
        </div>
      `
    });
  }
}