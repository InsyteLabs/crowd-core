'use strict';

import { Request, Response, NextFunction } from 'express';

import { eventService }  from '../services';
import { Event, Client } from '../models';
import { http }          from '../utilities';

export async function getEvent(req: Request, res: Response, next: NextFunction){
    if(req.method === 'OPTION') return next();

    const client: Client = res.locals.client;

    if(!(client && client.id)){
        return http.unauthorized(res, 'Cannot fetch event for unidentified client account');
    }

    const eventId:   number = +req.params.eventId,
          eventSlug: string = req.params.eventSlug;

    let event: Event|undefined;
    if(eventId){
        event = await eventService.getEvent(eventId);
    }
    else if(eventSlug){
        event = await eventService.getClientEventBySlug(client.id, eventSlug);
    }
    else{
        return http.clientError(res, 'Must provide event ID or slug in URL');
    }

    if(!event){
        return http.notFound(res, `Event of identifier ${ eventId || eventSlug } not found`);
    }

    if(event.clientId !== client.id){
        return http.unauthorized(res);
    }

    res.locals.event = event;

    return next();
}