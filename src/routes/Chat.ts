'use strict';

import { Router } from 'express';

import { getEvent }     from '../middleware';
import { eventService } from '../services';
import { http }         from '../utilities';
import { SocketServer } from '../socket-server';
import { MessageType }  from '../constants';

import { Client, Message, User }     from '../models';
import { IMessagePost, IMessagePut } from '../interfaces';

const router = Router();

router.get('/events/:eventId/chat', getEvent, async (req, res, next) => {
    try{
        const messages = await eventService.getEventMessages(+req.params.eventId);

        res.json(messages);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.post('/events/:eventId/chat', getEvent, async (req, res, next) => {
    const client: Client = res.locals.client,
          user:   User   = res.locals.user;

    try{
        /*
            TODO
            ----
            - Check that user has permissions to create message
            - Check that event is active
            - Sanitize inputs
        */
        const message: IMessagePost = {
            eventId: +req.params.eventId,
            userId:   <number>user.id,
            text:     req.body.text
        }

        const newMessage: Message|undefined = await eventService.createEventMessage(message);

        if(!newMessage){
            return http.serverError(res, new Error('Error creating chat message'));
        }

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

router.put('/events/:eventId/chat/:messageId', getEvent, async (req, res, next) => {
    const client: Client = res.locals.client,
          user:   User   = res.locals.user;
    try{
        /*
            TODO
            ----
            - Check that user has permissions to update message
            - User should be owner of message
            - Check that event is active
            - Sanitize inputs
        */
        const message: IMessagePut = {
            id:      +req.params.messageId,
            text:     req.body.text,
            hidden: !!req.body.hidden
        }

        const updatedMessage: Message|undefined = await eventService.updateEventMessage(message);

        if(!updatedMessage){
            return http.serverError(res, new Error('Error updating chat message'));
        }

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

router.delete('/events/:eventId/chat/:messageId', getEvent, async (req, res, next) => {
    const client: Client = res.locals.client;
    try{
        /*
            TODO
            ----
            - Check that user has permissions to delete message
            - User should be owner of message or moderator
            - Check that event is active
        */
        const deletedMessage = await eventService.deleteEventMessage(+req.params.messageId);

        if(!(deletedMessage && deletedMessage.id)){
            return http.notFound(res);
        }

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