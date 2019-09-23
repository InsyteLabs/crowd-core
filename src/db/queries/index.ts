'use strict';

import * as fs   from 'fs';
import * as path from 'path';

import { IQueryDescriptor } from '../../interfaces';

export const queries: IQueryDescriptor[] = [
    /*
        ==============
        CLIENT QUERIES
        ==============
    */
    {
        name: 'get-clients',
        path: './client/get-clients.sql'
    },
    {
        name:     'get-client',
        path:     './client/get-client.sql',
        firstRow: true
    },
    {
        name:     'create-client',
        path:     './client/create-client.sql',
        firstRow: true
    },
    {
        name:     'update-client',
        path:     './client/update-client.sql',
        firstRow: true
    },

    
    /*
        ============
        TYPE QUERIES
        ============
    */
    {
        name: 'get-types',
        path: './type/get-types.sql'
    },
    {
        name:     'get-type',
        path:     './type/get-type.sql',
        firstRow: true
    },
    {
        name:     'create-type',
        path:     './type/create-type.sql',
        firstRow: true
    },
    {
        name:     'update-type',
        path:     './type/update-type.sql',
        firstRow: true
    },
    {
        name: 'get-client-types',
        path: './type/get-client-types.sql'
    },
    {
        name:     'add-client-type',
        path:     './type/add-client-type.sql',
        firstRow: true
    },
    {
        name:     'remove-client-type',
        path:     './type/remove-client-type.sql',
        firstRow: true
    },
    {
        name: 'drop-client-types',
        path: './type/drop-all-client-types.sql'
    },

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
    },

    
    /*
        ============
        ROLE QUERIES
        ============
    */
    {
        name: 'get-roles',
        path: './role/get-roles.sql'
    },
    {
        name:     'get-role',
        path:     './role/get-role.sql',
        firstRow: true
    },
    {
        name:     'create-role',
        path:     './role/create-role.sql',
        firstRow: true
    },
    {
        name:     'update-role',
        path:     './role/update-role.sql',
        firstRow: true
    },
    {
        name:     'get-user-roles',
        path:     './role/get-user-roles.sql'
    },
    {
        name:     'add-user-role',
        path:     './role/add-user-role.sql',
        firstRow: true
    },
    {
        name:     'remove-user-role',
        path:     './role/remove-user-role.sql',
        firstRow: true
    },
    {
        name: 'drop-user-roles',
        path: './role/drop-all-user-roles.sql'
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