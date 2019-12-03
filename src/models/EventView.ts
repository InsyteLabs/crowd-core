'use strict';

import { IDBEventViewLog } from '../db/interfaces/log/IDBEventViewLog';

export class EventView {
    id: number;
    code: string;
    time: Date;

    event: {
        id:    number;
        title: string;
        slug:  string;
    }

    user: {
        id:          number;
        firstName:   string;
        lastName:    string;
        username:    string;
        email:       string;
        isAnonymous: boolean;
        isDisabled:  boolean;
    }

    client: {
        id:   number;
        name: string;
        slug: string;
    }

    constructor(e: EventView){
        this.id   = e.id;
        this.code = e.code;
        this.time = e.time;

        this.event  = e.event;
        this.user   = e.user;
        this.client = e.client;
    }

    static fromDb(e: IDBEventViewLog): EventView{
        return new EventView({
            id:   e.id,
            code: e.code,
            time: new Date(e.time),
            
            event: {
                id:    e.event_id,
                title: e.event_title,
                slug:  e.event_slug
            },

            user: {
                id: e.user_id,
                firstName:   e.user_first_name,
                lastName:    e.user_last_name,
                username:    e.user_username,
                email:       e.user_email,
                isAnonymous: e.user_is_anonymous,
                isDisabled:  e.user_is_disabled
            },

            client: {
                id:   e.client_id,
                name: e.client_name,
                slug: e.client_slug
            }
        });
    }
}