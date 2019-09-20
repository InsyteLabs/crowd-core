'use strict';

import * as fs   from 'fs';
import * as path from 'path';

import { IQueryDescriptor } from '../../interfaces';

export const queries: IQueryDescriptor[] = [
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
    },
    {
        name:     'get-user-by-username',
        path:     './user/get-user-by-username.sql',
        firstRow: true
    },
    {
        name:    'create-user',
        path:    './user/create-user.sql',
        firstRow: true
    },
    {
        name:     'update-user',
        path:     './user/update-user.sql',
        firstRow: true
    }
].map((q: any) => {
    try{
        q.sql = fs.readFileSync(path.resolve(__dirname, q.path), 'utf8');
    }
    catch(e){
        console.error(`Error loading query file "${ q.name }"`);
        console.error(e);
    }

    return q;
});