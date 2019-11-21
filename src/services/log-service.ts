'use strict';

import { db }         from '../db';
import { IDBAuthLog } from '../db/interfaces';
import { AuthLog }    from '../models';

class LogService{

    async getAuthLog(): Promise<AuthLog[]>{
        try{
            const authLog: IDBAuthLog[] = await db.q('get-auth-log');

            return authLog.map(l => AuthLog.fromDb(l));
        }
        catch(e){
            console.error('Error fetching auth log');
            console.error(e.message);

            return [];
        }
    }

    async getClientAuthLog(clientId: number): Promise<AuthLog[]>{
        try{
            const authLog: IDBAuthLog[] = await db.q('get-client-auth-log', [ clientId ]);

            return authLog.map(l => AuthLog.fromDb(l));
        }
        catch(e){
            console.error('Error fetching client auth log');
            console.error(e.message);

            return [];
        }
    }

    async getUserAuthLog(userId: number): Promise<AuthLog[]>{
        try{
            const authLog: IDBAuthLog[] = await db.q('get-user-auth-log', [ userId ]);

            return authLog.map(l => AuthLog.fromDb(l));
        }
        catch(e){
            console.error(`Error fetching auth log for user of Id ${ userId }`);
            console.error(e.message);

            return [];
        }
    }

    async getAuthLogById(id: number): Promise<AuthLog|undefined>{
        try{
            const authLog: IDBAuthLog = await db.q('get-auth-log-by-id', [ id ]);

            return AuthLog.fromDb(authLog);
        }
        catch(e){
            console.error(`Error fetching auth log of Id ${ id }`);
            console.error(e.message);
        }
    }

    async createAuthLog(log: any): Promise<AuthLog|undefined>{
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