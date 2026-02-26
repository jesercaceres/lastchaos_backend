import { prisma } from '../../config/prisma';

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


  // Cria a conta master no site
  async createWebAccount(userId: string, passwordHash: string, email: string) {
    
    // 1. Busca o usuário com o maior userCode atualmente no banco
    const lastUser = await prisma.bgUser.findFirst({
      orderBy: { userCode: 'desc' },
      select: { userCode: true }
    });

    // 2. Se achou, soma 1. Se o banco estiver vazio, começa no ID 1.
    const nextUserCode = (lastUser?.userCode || 0) + 1;

    // 3. Salva no banco enviando o nosso nextUserCode manualmente
    return await prisma.bgUser.create({
      data: {
        userCode: nextUserCode, // <--- Agora nós passamos o ID!
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