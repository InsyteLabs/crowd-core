'use strict';

import { EventSettings } from './EventSettings';
import { IDBEvent }      from '../../db/interfaces';

export class Event{
    id?:         number;
    clientId:    number;
    title:       string;
    slug:        string;
    description: string;
    startTime:   Date;
    endTime:     Date;
    active?:     boolean;
    views:       number;
    
    settings:    EventSettings;

    constructor(event: Event){
        this.id          = event.id;
        this.clientId    = event.clientId;
        this.title       = event.title;
        this.slug        = event.slug;
        this.description = event.description;
        this.startTime   = new Date(event.startTime);
        this.endTime     = new Date(event.endTime);
        this.active      = event.active;
        this.views       = event.views || 0;
        this.settings    = event.settings;
    }

    static fromDb(e: IDBEvent): Event{
        return new Event({
            id:       e.id,
            clientId: e.client_id,

            title:       e.title,
            slug:        e.slug,
            description: e.description,
            startTime:   new Date(e.start_time),
            endTime:     new Date(e.end_time),
            active:      e.is_active,
            views:       e.views,

            settings: {
                id:      e.settings_id,
                eventId: e.id,

                isLocked:        e.is_locked,
                requirePassword: e.require_password,
                password:        e.password,
                requireLogin:    e.require_login,
                enableChat:      e.enable_chat
            }
        });
    }
}