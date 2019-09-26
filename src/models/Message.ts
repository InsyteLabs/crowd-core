'use strict';

export class Message{
    id?:     number;
    eventId: number;
    userId:  number;
    text:    string;
    hidden:  boolean;

    constructor(message: any){
        this.id      = message.id;
        this.eventId = message.eventId;
        this.userId  = message.userId;
        this.text    = message.text;
        this.hidden  = message.hidden;
    }

    static from(m: any): Message{
        return new Message({
            id:      m.id,
            eventId: m.event_id,
            userId:  m.user_id,
            text:    m.text,
            hidden:  m.hidden
        });
    }
}