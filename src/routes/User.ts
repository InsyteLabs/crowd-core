'use strict';

import { Router } from 'express';

import { userService }  from '../services';
import { Client, User } from '../models';
import { http }         from '../utilities';
import { SocketServer } from '../socket-server';
import { MessageType }  from '../constants';
import { IUserPost, IUserPut }    from '../interfaces';

const router = Router();

router.get('/users', async (req, res, next) => {
    const client: Client = res.locals.client;
    try{
        const users = await userService.getUsersByClient(<number>client.id);

        return res.json(users);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.post('/users', async (req, res, next) => {
    const client: Client = res.locals.client,
          user:   User   = res.locals.user;

    try{
        /*
            TODO
            ----
            - Check that user has permissions to create user
            - Sanitize inputs
        */
        const userToCreate: IUserPost = {
            clientId:  <number>client.id,
            firstName: req.body.firstName,
            lastName:  req.body.lastName,
            email:     req.body.email,
            username:  req.body.username,
            password:  req.body.password,
            roles:     req.body.roles
        }

        const newUser = await userService.createUser(userToCreate);

        res.json(newUser);

        const clientSlug:   string       = <string>client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(`client::${ clientSlug };users`, MessageType.USER_CREATED, newUser);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.put('/users/:userId', async (req, res, next) => {
    const client: Client = res.locals.client,
          user:   User   = res.locals.user;

    try{
        const userUpdate: IUserPut = {
            id:               +req.params.id,
            firstName:         req.body.firstName,
            lastName:          req.body.lastName,
            email:             req.body.email,
            username:          req.body.username,
            isDisabled:      !!req.body.isDisabled,
            disabledComment:   req.body.disabledComment,
            roles:             req.body.roles
        }

        const updatedUser = await userService.updateUser(userUpdate);

        res.json(updatedUser);

        const clientSlug:   string       = <string>client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(`client::${ clientSlug };users`, MessageType.USER_UPDATED, updatedUser);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.delete('/clients/:clientId/users/:userId', async (req, res, next) => {
    const client: Client = res.locals.client;
    try{
        const user = await userService.deleteUser(+req.params.userId);

        res.json(user);

        const clientSlug:   string       = <string>client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(`client::${ clientSlug };users`, MessageType.USER_DELETED, user);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.get('/roles', async (req, res, next) => {
    try{
        const roles = await userService.getRoles();

        return res.json(roles);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

export default router;