'use strict';

const fs   = require('fs'),
      path = require('path');

const queries = [
    /*
        ============
        USER QUERIES
        ============
    */
    {
        name: 'get-users',
        path: './user/get-users.sql'
    },
    {
        name:     'get-user',
        path:     './user/get-user.sql',
        firstRow: true
    }
].map(q => {
    try{
        q.sql = fs.readFileSync(path.resolve(__dirname, q.path), 'utf8');
    }
    catch(e){
        console.error(`Error loading query file "${ q.name }"`);
        console.error(e);
    }

    return q;
});

module.exports = queries;