'use strict';

const db   = require('../db'),
      User = require('../models').User;

function UserService(){}

UserService.prototype.getUsers = async function getUsers(){
    try{
        const users = await db.query('get-users');

        return users.map(u => new User(u));
    }
    catch(e){
        console.error('Failed to get users from database');
        return [];
    }
}

UserService.prototype.getUser = async function getUser(id){
    try{
        const user = await db.query('get-user', [ id ]);

        return new User(user);
    }
    catch(e){
        console.error(`Failed to get user of ID "${ id }"`);
        console.error(e);
        return {}
    }
}

module.exports = new UserService();