'use strict';

import conf from '../conf';

import { Pool }             from 'pg';
import { queries }          from './queries';
import { IQueryDescriptor } from '../interfaces';

const pgConf = conf.pg;
const pool = new Pool(pgConf);

function _getClient(){ return pool.connect() }

// Base query wrapper
// Checks out clients from the pool,
// executes queries, and returns a promise
async function _exec(q: string, vals: any[]){
    const client = await _getClient();

    return new Promise(async (resolve, reject) => {
        try{
            const res = await client.query(q, vals);
            resolve(res);
        }
        catch(e){
            reject(e);
        }
        finally{
            client.release();
        }
    });
}

async function query(queryName: string, vals: any[], o: any = {}){

    if(o.rawQuery){
        return _exec(queryName, vals);
    }

    const query: IQueryDescriptor = queries.filter(q => q.name === queryName)[0];

    if(!query){
        throw new Error(`Query "${ queryName }" not found`);
    }

    let result: any = await _exec(query.sql as string, vals);

    if(query.firstRow){
        result = result.rows[0];
    }
    else{
        result = result.rows;
    }

    return result;
}

async function disconnect(){
    return pool.end();
}

module.exports = {
    query,
    q: query,
    queries,
    disconnect
}