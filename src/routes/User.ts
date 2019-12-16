'use strict';

import { Router } from 'express';

import { userService }  from '../services';
import { Client }       from '../models';
import { http }         from '../utilities';
import { SocketServer } from '../socket-server';
import { MessageType }  from '../constants';

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
    const client: Client = res.locals.client;
    try{
        const user = await userService.createUser(req.body);

        res.json(user);

        const clientSlug:   string       = <string>client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(`client::${ clientSlug };users`, MessageType.USER_CREATED, user);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.put('/users/:userId', async (req, res, next) => {
    const client: Client = res.locals.client;
    try{
        const user = await userService.updateUser(req.body);

        res.json(user);

        const clientSlug:   string       = <string>client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(`client::${ clientSlug };users`, MessageType.USER_UPDATED, user);
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