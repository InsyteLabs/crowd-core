'use strict';

import { Router } from 'express';

import { getClient }    from '../middleware';
import { userService }  from '../services';
import { http }         from '../utilities';
import { SocketServer } from '../web-sockets';
import { MessageType }  from '../constants';

const router = Router();

router.get('/clients/:id/users', async (req, res, next) => {
    const { id } = req.params;

    try{
        const users = await userService.getUsersByClient(+id);

        return res.json(users);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.post('/clients/:clientId/users', getClient, async (req, res, next) => {
    try{
        const user = await userService.createUser(req.body);

        res.json(user);

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, MessageType.USER_CREATED, user);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.put('/clients/:clientId/users/:userId', getClient, async (req, res, next) => {
    try{
        const user = await userService.updateUser(req.body);

        res.json(user);

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, MessageType.USER_UPDATED, user);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.delete('/clients/:clientId/users/:userId', getClient, async (req, res, next) => {
    try{
        const user = await userService.deleteUser(+req.params.userId);

        res.json(user);

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, MessageType.USER_DELETED, user);
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