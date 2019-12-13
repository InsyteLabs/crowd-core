'use strict';

import { Router } from 'express';

import { eventService } from '../services';
import { getClient }    from '../middleware';
import { http }         from '../utilities';
import { SocketServer } from '../socket-server';
import { MessageType }  from '../constants';

const router = Router();

router.get('/clients/:clientId/events/:eventId/chat', getClient, async (req, res, next) => {
    try{
        const messages = await eventService.getEventMessages(+req.params.eventId);

        res.json(messages);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.post('/clients/:clientId/events/:eventId/chat', getClient, async (req, res, next) => {
    try{
        const newMessage = await eventService.createEventMessage(req.body);

        res.json(newMessage);

        const clientSlug:   string       = res.locals.client.slug,
              channel:      string       = `client::${ clientSlug };events::${ newMessage.eventId }`,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(channel, MessageType.MESSAGE_CREATED, newMessage);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.put('/clients/:clientId/events/:eventId/chat/:messageId', getClient, async (req, res, next) => {
    try{
        const updatedMessage = await eventService.updateEventMessage(req.body);

        res.json(updatedMessage);

        const clientSlug:   string       = res.locals.client.slug,
              channel:      string       = `client::${ clientSlug };events::${ updatedMessage.eventId }`,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(channel, MessageType.MESSAGE_UPDATED, updatedMessage);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.delete('/clients/:clientId/events/:eventId/chat/:messageId', getClient, async (req, res, next) => {
    try{
        const deletedMessage = await eventService.deleteEventMessage(+req.params.messageId);

        res.json(deletedMessage);

        const clientSlug:   string       = res.locals.client.slug,
              channel:      string       = `client::${ clientSlug };events::${ deletedMessage.eventId }`,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(channel, MessageType.MESSAGE_DELETED, deletedMessage);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

export default router;