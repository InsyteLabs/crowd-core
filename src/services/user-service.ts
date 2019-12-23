'use strict';

import * as bcrypt from 'bcrypt';
import uuid        from 'uuid/v4';

import { db }                            from '../db';
import { User }                          from '../models';
import { IRole, IUserPost, IUserPut }    from '../interfaces';
import { IDbUser, IDbRole, IDbUserRole } from '../db/interfaces';

class UserService{

    private SALT_ROUNDS: number = 15;


    /*
        ============
        USER METHODS
        ============
    */
    async getUsers(): Promise<User[]>{
        try{
            const users: IDbUser[] = await db.q('get-users');

            return users.map(u => User.fromDb(u));
        }
        catch(e){
            console.error('Failed to get users from database');
            console.error(e);

            return [];
        }
    }

    async getUsersByClient(clientId: number): Promise<User[]>{
        try{
            const users: IDbUser[] = await db.q('get-users-by-client', [ clientId ]);

            return users.map(u => User.fromDb(u));
        }
        catch(e){
            console.error(`Failed to get users of clientId ${ clientId }`);
            console.error(e);

            return [];
        }
    }

    async getUser(id: number): Promise<User|undefined>{
        try{
            const user  = await db.query('get-user', [ id ]);

            return user ? User.fromDb(user) : undefined;
        }
        catch(e){
            console.error(`Failed to get user of ID "${ id }"`);
            console.error(e);
        }
    }

    async getUserByUsername(username: string): Promise<User|undefined>{
        try{
            const user: IDbUser = await db.q('get-user-by-username', [ username ]);

            return user ? User.fromDb(user) : undefined;
        }
        catch(e){
            console.error(`Failed to get user of username ${ username }`);
            console.error(e);
        }
    }

    async createUser(newUser: IUserPost): Promise<User|undefined>{
        let hash;
        try{
            hash = await this._hashPassword(newUser.password);
        }
        catch(e){
            console.error(`Error hashing password for new user "${ newUser.username || newUser.email }"`);
            console.error(e.message);

            return;
        }

        let user: IDbUser;
        try{
            user = await db.query('create-user', [
                newUser.clientId || null,
                newUser.firstName,
                newUser.lastName,
                newUser.email,
                newUser.username,
                hash
            ]);

            if(!user) return;
        }
        catch(e){
            console.error(`Error saving new user "${ newUser.username || newUser.email }"`);
            console.error(e);

            return;
        }

        if(newUser.roles && newUser.roles.length){
            await this.setUserRoles(user.id, newUser.roles);
        }

        return this.getUser(user.id);
    }

    async createAnonymousUser(clientId: number): Promise<User|undefined>{
        try{
            const user: IDbUser|undefined = await db.q('create-anonymous-user', [ clientId, uuid() ]);

            return user ? this.getUser(user.id) : undefined;
        }
        catch(e){
            console.error('Error creating anonymous user');
            console.error(e.message);
        }
    }

    async updateUser(user: IUserPut): Promise<User|undefined>{
        const curUser: User|undefined = await this.getUser(<number>user.id);

        if(!curUser) return;

        user.firstName       !== undefined && (curUser.firstName       =   user.firstName);
        user.lastName        !== undefined && (curUser.lastName        =   user.lastName);
        user.email           !== undefined && (curUser.email           =   user.email);
        user.username        !== undefined && (curUser.username        =   user.username);
        user.isDisabled      !== undefined && (curUser.isDisabled      = !!user.isDisabled);
        user.disabledComment !== undefined && (curUser.disabledComment =   user.disabledComment);

        let updated;
        try{
            updated = await db.q('update-user', [
                curUser.id,
                curUser.firstName,
                curUser.lastName,
                curUser.email,
                curUser.username,
                curUser.isDisabled,
                curUser.disabledComment
            ]);
        }
        catch(e){
            console.error(`Error updating user "${ user.username || user.email }"`);
            console.error(e.message);

            return;
        }

        if(user.roles && user.roles.length){
            await this.setUserRoles(<number>user.id, user.roles);
        }

        return this.getUser(updated.id);
    }
    
    async deleteUser(id: number): Promise<User|undefined>{
        const curUser: User|undefined = await this.getUser(id);

        if(!curUser) return;

        try{
            await db.q('delete-user', [ id ]);
            
            return curUser;
        }
        catch(e){
            console.error(`Error deleting user of Id ${ id }`);
            console.error(e.message);

            return;
        }
    }

    async setUserPassword(userId: number, password: string): Promise<User|undefined>{
        const hash = await this._hashPassword(password);

        try{
            const user: IDbUser = await db.q('update-user-password', [ userId, hash ]);

            return this.getUser(user.id);
        }
        catch(e){
            console.error(`Failed to update password for user of ID ${ userId }`);
            console.error(e);

            return;
        }
    }

    async checkUserPassword(username: string, password: string): Promise<boolean>{
        let user;
        try{
            user = await db.q('get-user-by-username', [ username ]);
        }
        catch(e){
            return false
        }
        if(!user) return false

        return this._checkPassword(password, user.password);
    }


    /*
        ============
        ROLE METHODS
        ============
    */
    async getRoles(): Promise<IDbRole[]>{
        try{
            const roles: IDbRole[] = await db.q('get-roles');

            return roles;
        }
        catch(e){
            console.error('Failed to get roles from database');
            console.error(e);

            return [];
        }
    }

    async getRole(id: number): Promise<IDbRole|undefined>{
        try{
            const role: IDbRole = await db.q('get-role', [ id ]);

            return role ? role : undefined;
        }
        catch(e){
            console.error(`Failed to get role "${ id }" from database`);
            console.error(e.message);
        }
    }

    async createRole(newRole: IRole): Promise<IDbRole|undefined>{
        try{
            const role: IDbRole = await db.q('create-role', [ newRole.name ]);

            return role ? role : undefined;
        }
        catch(e){
            console.error(`Failed to create role "${ newRole.name }"`);
            console.error(e.message);
        }
    }

    async updateRole(role: IRole): Promise<IDbRole|undefined>{
        const curRole: IDbRole|undefined = await this.getRole(<number>role.id);

        if(!curRole) return;

        curRole.name = role.name;

        try{

            const updatedRole: IDbRole = await db.q('update-role', [ curRole.id, curRole.name ]);

            return updatedRole ? updatedRole : undefined;
        }
        catch(e){
            console.error(`Error updating role of Id "${ role.id }"`);
            console.error(e.message);
        }
        
    }

    async getUserRoles(userId: number): Promise<string[]>{

        try{
            const userRoles: { roles: string[] } = await db.query('get-user-roles', [ userId ]);

            return userRoles.roles;
        }
        catch(e){
            console.error(`Failed to get roles for userID "${ userId }"`);
            console.error(e.message);

            return [];
        }
    }

    async setUserRoles(userId: number, roles: string[]): Promise<string[]>{
        if(!roles.length) return [];

        const validRoles: IDbRole[] = await this.getRoles();

        const rolesToSet: IDbRole[] = validRoles.filter(r => roles.includes(r.name));

        await this.dropUserRoles(userId);
        await this.addUserRoles(userId, rolesToSet.map(r => r.id));
        
        return this.getUserRoles(userId);
    }

    async addUserRoles(userId: number, roles: number[]): Promise<string[]>{
        try{
            for(let i = 0, len = roles.length; i < len; i++){
                const inserted: IDbUserRole = await db.q('add-user-role', [ roles[i], userId ]);
            }

            return this.getUserRoles(userId);
        }
        catch(e){
            console.error('Error adding user roles to database');
            console.error(e.message);

            return [];
        }
    }

    async dropUserRoles(userId: number): Promise<string[]>{
        try{
            const droppedRoles: IDbUserRole[] = await db.q('drop-user-roles', [ userId ]);

            return this.getUserRoles(userId);
        }
        catch(e){
            console.error(`Failed to drop roles for userID "${ userId }"`);
            console.error(e.message);

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