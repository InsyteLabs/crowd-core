'use strict';

import { Router } from 'express';

import { eventService, logService } from '../services';
import { Client, Event, User }      from '../models';
import { http }                     from '../utilities';
import { SocketServer }             from '../socket-server';
import { MessageType }              from '../constants';

const router = Router();

router.get('/events', async (req, res, next) => {
    const client: Client = res.locals.client;
    try{
        const events = await eventService.getClientEvents(<number>client.id);

        return res.json(events);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.get('/events/:slug', async (req, res, next) => {
    const client: Client = res.locals.client,
          user:   User   = res.locals.user;

    const { slug } = req.params;
    try{
        const event: Event|undefined = await eventService.getClientEventBySlug(<number>client.id, slug);

        if(event && event.id){
            res.json(event);

            // Log that a user viewed the event
            const clientId: number = <number>client.id,
                  userId:   number = <number>user.id,
                  eventId:  number = event.id;

            return logService.createEventView(clientId, userId, eventId);
        }
        return http.notFound(res);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.post('/events', async (req, res, next) => {
    const client: Client = res.locals.client;
    try{
        const event = await eventService.createEvent(req.body);

        if(!event){
            return http.serverError(res, new Error('Error creating event'));
        }

        res.json(event);

        const clientSlug:   string       = <string>client.slug,
              channel:      string       = `client::${ clientSlug };events`,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(channel, MessageType.EVENT_CREATED, event);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.put('/events/:eventId', async (req, res, next) => {
    const client: Client = res.locals.client;
    try{
        const event: Event|undefined = await eventService.updateEvent(req.body);

        if(event){
            res.json(event);

            const clientSlug:   string       = <string>client.slug,
                  channel:      string       = `client::${ clientSlug };events::${ event.id }`,
                  socketServer: SocketServer = res.locals.socketServer;

            socketServer.messageClients(channel, MessageType.EVENT_UPDATED, event);

            const channel2: string = `client::${ clientSlug };events`;

            socketServer.messageClients(channel2, MessageType.EVENT_UPDATED, event);

            return;
        }

        http.notFound(res);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.delete('/events/:eventId', async (req, res, next) => {
    const client: Client = res.locals.client;
    try{
        const event = await eventService.deleteEvent(+req.params.eventId);

        if(!event){
            return http.serverError(res, new Error('Error deleting event'));
        }

        res.json(event);

        const clientSlug:   string       = <string>client.slug,
              channel:      string       = `client::${ clientSlug };events`,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(channel, MessageType.EVENT_DELETED, event);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

export default router;