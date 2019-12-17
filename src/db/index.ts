'use strict';

import conf from '../conf';

import { Pool }             from 'pg';
import { queries }          from './queries';
import { IQueryDescriptor } from './interfaces';


class Database{
    private _pool:    Pool               = new Pool(conf.pg);
    private _queries: IQueryDescriptor[] = queries;

    async query(queryName: string, vals: any[] = [], o: any = {}): Promise<any>{
        
        if(o.rawQuery) return this._exec(queryName, vals);

        const query: IQueryDescriptor = this._queries.filter(q => q.name === queryName)[0];

        if(!query){
            const err = new Error(`Query "${ queryName }" not found`);

            return Promise.reject(err);
        }

        let result: any = await this._exec(query.sql as string, vals);

        if(query.firstRow){
            result = result.rows[0];
        }
        else{
            result = result.rows;
        }

        return result;
    }

    // Alias to this.query
    get q(){ return this.query }

    disconnect(): Promise<void>{
        return this._pool.end();
    }

    /*
        ===============
        PRIVATE METHODS
        ===============
    */
    private _getClient(){ return this._pool.connect() }

    // Base query wrapper
    // Checks out pool clients, execs query, and releases client
    private async _exec(q: string, vals: any[]): Promise<any>{
        const client = await this._getClient();

        try{
            return client.query(q, vals);
        }
        catch(e){
            return Promise.reject(e);
        }
        finally{
            client.release();
        }
    }
}

export const db = new Database();