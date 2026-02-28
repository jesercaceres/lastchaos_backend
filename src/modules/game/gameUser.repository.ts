import { prisma } from '../../config/prisma';
import { Prisma } from '@prisma/client'; 

export class GameUserRepository {
 
  async createGameAccount(userId: string, portalIndex: number, tx: Prisma.TransactionClient = prisma) {
    
    return await tx.t_users.create({
      data: {
        a_idname: userId,
        a_portal_index: portalIndex, 
        a_regi_date: new Date(),
        a_end_date: new Date('2099-12-31'), 
        a_enable: 1, 
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