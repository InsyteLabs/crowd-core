'use strict';

import * as bcrypt from 'bcrypt';

import { db }   from '../db';
import { User } from '../models';

class UserService{

    private SALT_ROUNDS: number = 15;

    async getUsers(): Promise<User[]>{
        try{
            const users = await db.q('get-users');
    
            return users.map((u: any) => new User(u));
        }
        catch(e){
            console.error('Failed to get users from database');
            console.error(e);
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

    async createUser(newUser: User): Promise<User>{
        return new Promise(async (resolve, reject) => {
            let hash;
            try{
                hash = await this._hashPassword(newUser.password);
            }
            catch(e){
                return reject('Password hashing error');
            }

            const args = [
                newUser.clientId || null,
                newUser.firstName,
                newUser.lastName,
                newUser.email,
                newUser.username,
                hash
            ];

            try{
                const user = await db.query('create-user', args);
                
                resolve(new User(user));
            }
            catch(e){
                console.error(e);
                reject('Error saving user to database');
            }
        });
    }

    async checkUserPassword(username: string, password: string): Promise<boolean>{
        let user;
        try{
            user = await db.q('get-user-by-username', [ username ]);
        }
        catch(e){
            return Promise.reject(false);
        }

        if(!user) return Promise.reject(false);

        return this._checkPassword(password, user.password);
    }

    async updateUser(user: User): Promise<User>{
        let curUser;
        try{
            curUser = await this.getUser(user.id as number);
        }
        catch(e){
            return Promise.reject(e);
        }

        for(let prop in user){
            if(user[prop] !== undefined){
                curUser[prop] = user[prop];
            }
        }

        const args = [
            curUser.id,
            curUser.firstName,
            curUser.lastName,
            curUser.email,
            curUser.username,
            curUser.password,
            curUser.isDisabled,
            curUser.disabledComment
        ];

        return new Promise(async (resolve, reject) => {
            try{
                const updated = await db.q('update-user', args);

                resolve(new User(updated));
            }
            catch(e){
                console.error(e);
                reject('Error updating user');
            }
        });      
    }

    async disableUser(id: number, comment: string): Promise<User>{
        let user;
        try{
            user = await this.getUser(id);
        }
        catch(e){
            return Promise.reject(e);
        }

        user.isDisabled      = true;
        user.disabledComment = comment;

        return this.updateUser(user);
    }

    async enableUser(id: number): Promise<User>{
        let user;
        try{
            user = await this.getUser(id);
        }
        catch(e){
            return Promise.reject(e);
        }

        user.isDisabled      = false;
        user.disabledComment = null;

        return this.updateUser(user);
    }

    /*
        ===============
        PRIVATE METHDOS
        ===============
    */
    private _hashPassword(password: string): Promise<string>{
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, this.SALT_ROUNDS, (err, hash) => err ? reject(err) : resolve(hash));
        });
    }

    private _checkPassword(password: string, hash: string): Promise<boolean>{
        return new Promise((resolve, reject) => {
            if(!(password && hash)){
                return resolve(false);
            }
            bcrypt.compare(password, hash, (err, result) => resolve(err ? false : result));
        });
    }
}

export const userService = new UserService();