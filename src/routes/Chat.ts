'use strict';

import { Router } from 'express';

import { eventService } from '../services';
import { Client }       from '../models';
import { http }         from '../utilities';
import { SocketServer } from '../socket-server';
import { MessageType }  from '../constants';

const router = Router();

router.get('/events/:eventId/chat', async (req, res, next) => {
    try{
        const messages = await eventService.getEventMessages(+req.params.eventId);

        res.json(messages);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.post('/events/:eventId/chat', async (req, res, next) => {
    const client: Client = res.locals.client;
    try{
        const newMessage = await eventService.createEventMessage(req.body);

        res.json(newMessage);

        const clientSlug:   string       = <string>client.slug,
              channel:      string       = `client::${ clientSlug };events::${ newMessage.eventId }`,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(channel, MessageType.MESSAGE_CREATED, newMessage);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.put('/events/:eventId/chat/:messageId', async (req, res, next) => {
    const client: Client = res.locals.client;
    try{
        const updatedMessage = await eventService.updateEventMessage(req.body);

        res.json(updatedMessage);

        const clientSlug:   string       = <string>client.slug,
              channel:      string       = `client::${ clientSlug };events::${ updatedMessage.eventId }`,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(channel, MessageType.MESSAGE_UPDATED, updatedMessage);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.delete('/events/:eventId/chat/:messageId', async (req, res, next) => {
    const client: Client = res.locals.client;
    try{
        const deletedMessage = await eventService.deleteEventMessage(+req.params.messageId);

        res.json(deletedMessage);

        const clientSlug:   string       = <string>client.slug,
              channel:      string       = `client::${ clientSlug };events::${ deletedMessage.eventId }`,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(channel, MessageType.MESSAGE_DELETED, deletedMessage);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

export default router;