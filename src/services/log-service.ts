'use strict';

import { db }                          from '../db';
import { IDbAuthLog, IDbEventViewLog } from '../db/interfaces';
import { AuthLog, EventView }          from '../models';

class LogService{

    /*
        ================
        AUTH LOG METHODS
        ================
    */
    async getAuthLog(): Promise<AuthLog[]>{
        try{
            const authLog: IDbAuthLog[] = await db.q('get-auth-log');

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
            const authLog: IDbAuthLog[] = await db.q('get-client-auth-log', [ clientId ]);

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
            const authLog: IDbAuthLog[] = await db.q('get-user-auth-log', [ userId ]);

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
            const authLog: IDbAuthLog = await db.q('get-auth-log-by-id', [ id ]);

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


    /*
        ======================
        EVENT VIEW LOG METHODS
        ======================
    */
    async getEventViews(eventId: number): Promise<EventView[]>{
        try{
            const views: IDbEventViewLog[] = await db.q('get-event-views', [ eventId ]);

            return views.map(v => EventView.fromDb(v));
        }
        catch(e){
            console.error(`Error fetching views for event of ID ${ eventId }`);
            console.error(e.message);

            return [];
        }
    }

    async getEventView(viewId: number): Promise<EventView|undefined>{
        try{
            const view: IDbEventViewLog = await db.q('get-event-view', [ viewId ]);

            return EventView.fromDb(view);
        }
        catch(e){
            console.error(`Error fetching event view of ID ${ viewId }`);
            console.error(e.message);
        }
    }

    async createEventView(clientId: number, userId: number, eventId: number): Promise<EventView|undefined>{
        try{
            const eventView: any = await db.q('create-event-view', [
                `${ userId }:${ eventId }`, // code, to limit 1 view per user/event
                clientId,
                userId,
                eventId
            ]);

            return this.getEventView(eventView.id);
        }
        catch(e){
            console.error(`Error creating event view for event of ID ${ eventId } and user ${ userId }`);
            console.error(e.message);
        }
    }
}

export const logService = new LogService();