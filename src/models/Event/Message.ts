'use strict';

import { IDBMessage } from '../../db/interfaces';

export class Message{
    id?:     number;
    eventId: number;
    text:    string;
    hidden:  boolean;
    
    userId?: number;
    user?: {
        id:          number;
        firstName:   string;
        lastName:    string;
        username:    string;
        isAnonymous: boolean;
    }

    constructor(message: Message){
        this.id      = message.id;
        this.eventId = message.eventId;
        this.text    = message.text;
        this.hidden  = message.hidden;
        this.userId  = message.userId;
        this.user    = message.user;
    }

    static from(m: IDBMessage): Message{
        return new Message({
            id:      m.id,
            eventId: m.event_id,
            text:    m.text,
            hidden:  m.hidden,

            userId: m.user_id,
            user: {
                id: m.user_id,
    
                firstName:     m.user_first_name || '',
                lastName:      m.user_last_name  || '',
                username:      m.user_username   || '',
                isAnonymous: !!m.user_is_anonymous
            }
        });
    }
}