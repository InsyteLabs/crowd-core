'use strict';

import { Router } from 'express';

import { getEvent }                 from '../middleware';
import { eventService, logService } from '../services';
import { Client, Event, User }      from '../models';
import { http }                     from '../utilities';
import { SocketServer }             from '../socket-server';
import { MessageType }              from '../constants';
import { IEventPost, IEventPut }    from '../interfaces';

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

router.get('/events/:eventSlug', getEvent, async (req, res, next) => {
    const client: Client = res.locals.client,
          user:   User   = res.locals.user,
          event:  Event  = res.locals.event;

    if(event && event.id){
        res.json(event);

        // Log that a user viewed the event
        const clientId: number = <number>client.id,
              userId:   number = <number>user.id,
              eventId:  number = event.id;

        return logService.createEventView(clientId, userId, eventId);
    }
    return http.notFound(res);
});

router.post('/events', async (req, res, next) => {
    const client: Client = res.locals.client,
          user:   User   = res.locals.user;

    if(!req.body.settings){
        return http.clientError(res, 'Must provide settings object');
    }

    try{
        const event: IEventPost = {
            clientId:    <number>client.id,
            title:       req.body.title,
            slug:        req.body.slug        || '',
            description: req.body.description || '',
            startTime:   req.body.startTime   || null,
            endTime:     req.body.endTime     || null,

            settings: {
                isLocked:        !!req.body.settings.isLocked,
                requirePassword: !!req.body.settings.requirePassword,
                password:          req.body.settings.password || null,
                requireLogin:    !!req.body.settings.requireLogin,
                enableChat:      !!req.body.settings.enableChat
            }
        }

        const newEvent = await eventService.createEvent(event);

        if(!newEvent){
            return http.serverError(res, new Error('Error creating event'));
        }

        res.json(newEvent);

        const clientSlug:   string       = <string>client.slug,
              channel:      string       = `client::${ clientSlug };events`,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(channel, MessageType.EVENT_CREATED, newEvent);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.put('/events/:eventId', getEvent, async (req, res, next) => {
    const client: Client = res.locals.client,
          event:  Event  = res.locals.event;
    
    if(event.clientId !== client.id){
        return http.forbidden(res);
    }

    try{
        const eventUpdate: IEventPut = {
            id:          +req.params.eventId,
            clientId:     <number>client.id,
            title:        req.body.title,
            slug:         req.body.slug        || '',
            description:  req.body.description || '',
            startTime:    req.body.startTime   || null,
            endTime:      req.body.endTime     || null,

            settings: {
                eventId:          +req.params.eventId,
                isLocked:        !!req.body.settings.isLocked,
                requirePassword: !!req.body.settings.requirePassword,
                password:          req.body.settings.password || null,
                requireLogin:    !!req.body.settings.requireLogin,
                enableChat:      !!req.body.settings.enableChat
            }
        }

        const updatedEvent: Event|undefined = await eventService.updateEvent(eventUpdate);

        if(updatedEvent){
            res.json(updatedEvent);

            const clientSlug:   string       = <string>client.slug,
                  channel:      string       = `client::${ clientSlug };events::${ updatedEvent.id }`,
                  socketServer: SocketServer = res.locals.socketServer;

            socketServer.messageClients(channel, MessageType.EVENT_UPDATED, updatedEvent);

            const channel2: string = `client::${ clientSlug };events`;

            socketServer.messageClients(channel2, MessageType.EVENT_UPDATED, updatedEvent);

            return;
        }

        http.notFound(res);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.delete('/events/:eventId', getEvent, async (req, res, next) => {
    const client: Client = res.locals.client,
          event:  Event  = res.locals.event;

    if(!event){
        return http.notFound(res);
    }

    const deletedEvent = await eventService.deleteEvent(+req.params.eventId);

    res.json(deletedEvent);

    const clientSlug:   string       = <string>client.slug,
          channel:      string       = `client::${ clientSlug };events`,
          socketServer: SocketServer = res.locals.socketServer;

    socketServer.messageClients(channel, MessageType.EVENT_DELETED, event);
});

export default router;