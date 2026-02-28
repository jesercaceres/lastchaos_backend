import { prisma } from '../../config/prisma';
import { Prisma } from '@prisma/client'; // 1. Importar o tipo Prisma

export class UserRepository {
  async findByUsername(userId: string) {
    return await prisma.bgUser.findUnique({
      where: { userId }
    });
  }

  async findByEmail(email: string) {
    return await prisma.bgUser.findFirst({
      where: { email }
    });
  }

  async createWebAccount(userId: string, passwordHash: string, email: string, tx: Prisma.TransactionClient = prisma) {
    
    const lastUser = await tx.bgUser.findFirst({
      orderBy: { userCode: 'desc' },
      select: { userCode: true }
    });

    const nextUserCode = (lastUser?.userCode || 0) + 1;

    return await tx.bgUser.create({
      data: {
        userCode: nextUserCode,
        userId: userId,
        passwd: passwordHash,
        email: email,
        activated: 1,
        createDate: new Date(),
        updateTime: new Date(),
        jumin: '0',
        chkService: 'Y',
        partnerId: 'LC',
        cash: 0,
        aCash: 0,
      }
    });
  }
}