'use strict';

import { Router } from 'express';

import { eventService, logService } from '../services';
import { Event }                    from '../models';
import { getClient }                from '../middleware';
import { http }                     from '../utilities';
import { SocketServer }             from '../socket-server';
import { MessageType }              from '../constants';

const router = Router();

router.get('/clients/:id/events', async (req, res, next) => {
    try{
        const events = await eventService.getClientEvents(+req.params.id);

        return res.json(events);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.get('/clients/:clientId/events/:slug', getClient, async (req, res, next) => {
    const { clientId, slug } = req.params;
    try{
        const event: Event|undefined = await eventService.getClientEventBySlug(+clientId, slug);

        if(event){
            res.json(event);

            // Log that a user viewed the event
            const clientId: number = res.locals.client.id,
                  userId:   number = res.locals.user.id,
                  eventId:  number = (<number>(<Event>(event)).id);

            return logService.createEventView(clientId, userId, eventId);
        }
        return http.notFound(res);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.post('/clients/:clientId/events', getClient, async (req, res, next) => {
    try{
        const event = await eventService.createEvent(req.body);

        if(!event){
            return http.serverError(res, new Error('Error creating event'));
        }

        res.json(event);

        const clientSlug:   string       = res.locals.client.slug,
              channel:      string       = `client::${ clientSlug };events`,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(channel, MessageType.EVENT_CREATED, event);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.put('/clients/:clientId/events/:eventId', getClient, async (req, res, next) => {
    try{
        const event: Event|undefined = await eventService.updateEvent(req.body);

        if(event){
            res.json(event);

            const clientSlug:   string       = res.locals.client.slug,
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

router.delete('/clients/:clientId/events/:eventId', getClient, async (req, res, next) => {
    try{
        const event = await eventService.deleteEvent(+req.params.eventId);

        if(!event){
            return http.serverError(res, new Error('Error deleting event'));
        }

        res.json(event);

        const clientSlug:   string       = res.locals.client.slug,
              channel:      string       = `client::${ clientSlug };events`,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(channel, MessageType.EVENT_DELETED, event);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

export default router;