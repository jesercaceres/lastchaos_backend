import { prisma } from '../../config/prisma';

export class GameUserRepository {
  // Cria a conta que o executável do jogo vai ler
  async createGameAccount(userId: string, portalIndex: number) {
    return await prisma.t_users.create({
      data: {
        a_idname: userId,
        a_portal_index: portalIndex, // Aqui está o vínculo com a BgUser!
        a_regi_date: new Date(),
        a_end_date: new Date('2099-12-31'), // Uma data bem no futuro para a conta não expirar
        a_enable: 1, // 1 = Permitido logar no jogo
        
        // --- Valores default para não quebrar o Last Chaos ---
        a_server_num: -1,
        a_subnum: -1,
        a_zone_num: -1,
        a_eventpoint: 10,
        a_block_time: 0,
        a_fail_count: 0
      }
    });
  }
}