'use strict';

import * as bcrypt from 'bcrypt';

import { db }    from '../db';
import { User }  from '../models';
import { IRole } from '../interfaces';

class UserService{

    private SALT_ROUNDS: number = 15;


    /*
        ============
        USER METHODS
        ============
    */
    async getUsers(): Promise<User[]>{
        try{
            const users = await db.q('get-users');

            for(let i = 0, len = users.length; i < len; i++){
                const user = users[i];

                const roles: IRole[] = await this.getUserRoles(user.id);

                user.roles = roles.map(r => r.name);
            }
    
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
            const user  = await db.query('get-user', [ id ]),
                  roles = await this.getUserRoles(id);
            
            user.roles = roles.map(r => r.name);
    
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
        ============
        ROLE METHODS
        ============
    */
    async getRoles(): Promise<IRole[]>{
        try{
            return await db.q('get-roles');
        }
        catch(e){
            console.error('Failed to get roles from database');
            console.error(e);

            return Promise.resolve([]);
        }
    }

    async getRoleIds(): Promise<number[]>{
        try{
            const roles = await this.getRoles();

            const validRoleIds: number[] = roles.reduce((acc: number[], r: IRole) => {
                acc.push(r.id as number);
    
                return acc;
            }, []);

            return validRoleIds;
        }
        catch(e){
            return Promise.reject(e);
        }
    }

    async getRole(id: number): Promise<IRole>{
        try{
            return await db.q('get-role', [ id ]);
        }
        catch(e){
            console.error(`Failed to get role "${ id }" from database`);
            console.error(e);

            return Promise.resolve({id: null, name: ''});
        }
    }

    async createRole(role: IRole): Promise<IRole>{
        try{
            return await db.q('create-role', [ role.name ]);
        }
        catch(e){
            console.error(`Failed to create role "${ role.name }"`);
            console.error(e);

            return Promise.reject({id: null, name: ''});
        }
    }

    async updateRole(role: IRole): Promise<IRole>{
        let curRole;
        try{
            curRole = await this.getRole(role.id as number);
        }
        catch(e){
            return Promise.reject(e);
        }

        for(let prop in role){
            if(role[prop] !== undefined){
                curRole[prop] = role[prop];
            }
        }
        return db.q('update-role', [ curRole.id, curRole.name ]);
    }

    async getUserRoles(userId: number): Promise<IRole[]>{

        try{
            const roles = await db.query('get-user-roles', [ userId ]);

            return roles;
        }
        catch(e){
            console.error(`Failed to get roles for userID "${ userId }"`);
            console.error(e);

            return [];
        }
    }

    async updateUserRoles(userId: number, roles: number[]){
        let validRoles: number[];
        try{
            validRoles = await this.getRoleIds();
        }
        catch(e){
            return Promise.reject(e);
        }

        // Filter out roles that are not valid
        roles = roles.filter(r => validRoles.includes(r));

        // Drop all roles for the user
        try{
            await this.dropUserRoles(userId);
        }
        catch(e){
            return Promise.reject(e);
        }

        // Set the provided roles
        try{
            const rolesAdded = await this.addUserRoles(userId, roles);

            return rolesAdded;
        }
        catch(e){
            return Promise.reject(e);
        }
    }

    async addUserRoles(userId: number, roles: number[]){
        try{
            const insertedRoles = [];
            for(let i = 0, len = roles.length; i < len; i++){
                const inserted = await db.q('add-user-role', [ roles[i], userId ]);

                inserted && insertedRoles.push(inserted.role_id);
            }

            return insertedRoles;
        }
        catch(e){
            console.error('Error adding user roles to database');
            console.error(e);

            return [];
        }
    }

    async removeUserRoles(userId: number, roles: number[]){
        try{
            const deletedRoles = [];
            for(let i = 0, len = roles.length; i < len; i++){
                const deleted = await db.q('remove-user-role', [ roles[i], userId ]);

                deleted && deletedRoles.push(deleted.role_id);
            }

            return deletedRoles.filter(r => r);
        }
        catch(e){
            console.error('Error deleting user roles from database');
            console.error(e);

            return [];
        }
    }

    async dropUserRoles(userId: number){
        try{
            const droppedRoles = await db.q('drop-user-roles', [ userId ]);

            return droppedRoles.reduce((acc: number[], r: any) => {
                acc.push(r.role_id);

                return acc;
            }, []);
        }
        catch(e){
            console.error(`Failed to drop roles for userID "${ userId }"`);
            console.error(e);

            return [];
        }
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