'use strict';

import { db }      from '../db';
import { slugify } from '../utilities';

class EventService{

    async getEvents(){
        try{
            const events = await db.q('get-events');

            return events;
        }
        catch(e){
            console.error('Failed to get events from database');
            console.error(e);

            return [];
        }
    }

    async getEvent(id: number){
        try{
            const event = await db.q('get-event', [ id ]);

            return event;
        }
        catch(e){
            console.error('Failed to get event from database');
            console.error(e);

            return {}
        }
    }

    async createEvent(event: any){
        const args = [
            event.clientId,
            event.title,
            event.slug || slugify(event.title),
            event.description,
            event.startTime,
            event.endTime
        ];

        try{
            const event = await db.q('create-event', args);

            return event;
        }
        catch(e){
            console.error(`Failed to create event "${ event.title }"`);
            console.error(e);

            return {}
        }
    }

    async updateEvent(event: any){
        const args = [
            event.id,
            event.clientId,
            event.title,
            event.slug || slugify(event.title),
            event.description,
            event.startTime,
            event.endTime
        ];

        try{
            const event = await db.q('update-event', args);

            return event;
        }
        catch(e){
            console.error(`Failed to update event "${ event.title }"`);
            console.error(e);

            return {}
        }
    }
}

export const eventService = new EventService();