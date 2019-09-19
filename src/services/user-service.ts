'use strict';

const db = require('../db');

import { User } from '../models';

export class UserService{
    async getUsers(): Promise<User[]>{
        try{
            const users = await db.query('get-users');
    
            return users.map((u: any) => new User(u));
        }
        catch(e){
            console.error('Failed to get users from database');
            console.log(e);
            return [];
        }
    }

    async getUser(id: number): Promise<User>{
        try{
            const user = await db.query('get-user', [ id ]);
    
            return new User(user);
        }
        catch(e){
            console.error(`Failed to get user of ID "${ id }"`);
            console.error(e);
            return new User({});
        }
    }
}