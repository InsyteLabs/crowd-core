'use strict';

import { db }         from '../db';
import { IDBAuthLog } from '../db/interfaces';

class LogService{

    async getAuthLog(): Promise<IDBAuthLog[]>{
        return [];
    }

    async getClientAuthLog(): Promise<IDBAuthLog[]>{
        return []
    }

    async getAuthLogById(id: number): Promise<void>{

    }

    async createAuthLog(log: any): Promise<void>{
        try{
            const newLog: { id: number } = await db.q('create-auth-log', [
                log.clientId,
                log.userId,
                log.ip,
                log.success
            ]);

            return this.getAuthLogById(newLog.id);
        }
        catch(e){
            console.error('Error creating auth log');
            console.error(e.message);
        }
    }
}

export const logService = new LogService();