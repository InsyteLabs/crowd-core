'use strict';

const pgConf = require('../conf').pg;

const { Pool } = require('pg'),
        pool   = new Pool(pgConf);

const queries = require('./queries');

function _getClient(){ return pool.connect() }

// Base query wrapper
// Checks out clients from the pool,
// executes queries, and returns a promise
async function _exec(q, vals){
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

async function query(queryName, vals, o={}){

    if(o.rawQuery){
        return _exec(queryName, vals);
    }

    const query = queries.filter(q => q.name === queryName)[0];

    if(!query){
        throw new Error(`Query "${ queryName }" not found`);
    }

    let result = await _exec(query.sql, vals);

    if(query.firstRow){
        result = result.rows[0];
    }
    else{
        result = result.rows;
    }

    if(query.model){

        const Model = models[query.model];

        if(Array.isArray(result)){
            result = result.map(item => new Model(item));
        }
        else{
            result = new Model(result);
        }
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