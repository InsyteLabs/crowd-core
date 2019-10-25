'use strict';

import { Router }         from 'express';
import { sendError }      from '../utilities';
import { getCurrentUser, getClient } from '../middleware';

import { clientService, eventService, userService } from '../services';
import { ISocketClientsMap } from '../interfaces';

const router = Router();

router.use(getCurrentUser);

router.get('/clients', async (req, res, next) => {
    const clients = await clientService.getClients();
    
    return res.json(clients);
});

router.get('/clients/:id', async (req, res, next) => {
    const client = await clientService.getClient(+req.params.id);

    return res.json(client);
});

router.get('/clients/slug/:slug', async (req, res, next) => {
    try{
        const client = await clientService.getClientBySlug(req.params.slug);

        return res.json(client);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.post('/clients', async (req, res, next) => {
    try{
        const client = await clientService.createClient(req.body);

        return res.json(client);
    }
    catch(e){
        return res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/clients/:id', async (req, res, next) => {
    try{
        const client = await clientService.updateClient(req.body);

        return res.json(client);
    }
    catch(e){
        return res.status(500).json({ message: 'Server Error' });
    }
});


/*
    =============
    CLIENT EVENTS
    =============
*/
router.get('/clients/:id/events', async (req, res, next) => {
    try{
        const events = await eventService.getClientEvents(+req.params.id);

        return res.json(events);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.get('/clients/:id/events/:slug', async (req, res, next) => {
    const { id, slug } = req.params;
    try{
        const event = await eventService.getClientEventBySlug(+id, slug);

        return res.json(event);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.post('/clients/:clientId/events', getClient, async (req, res, next) => {
    if(!res.locals.client){
        return sendError(res, new Error('Client account not identified'));
    }

    try{
        const event = await eventService.createEvent(req.body);

        res.json(event);

        let clientSlug: string      = res.locals.client.slug,
            wsClients:  WebSocket[] = res.locals.wsClients[clientSlug];

        if(wsClients && wsClients.length){
            wsClients.forEach((c: WebSocket) => {
                c.send(JSON.stringify({
                    type: 'new-event',
                    data: event
                }));
            });
        }
    }
    catch(e){
        return sendError(res, e);
    }
});


/*
    ============
    CLIENT USERS
    ============
*/
router.get('/clients/:id/users', async (req, res, next) => {
    const { id } = req.params;

    try{
        const users = await userService.getUsersByClient(+id);

        return res.json(users);
    }
    catch(e){
        return sendError(res, e);
    }
});


export default router;