'use strict';

import { Question } from "./Question";

export class Event{
    id?:         number;
    clientId:    number;
    title:       string;
    slug:        string;
    description: string;
    startTime:   Date;
    endTime:     Date;
    active?:     boolean;
    questions?:  Question[];

    constructor(event: any){
        this.id          = event.id;
        this.clientId    = event.clientId;
        this.title       = event.title;
        this.slug        = event.slug;
        this.description = event.description;
        this.startTime   = new Date(event.startTime);
        this.endTime     = new Date(event.endTime);
        this.active      = event.active;
        this.questions   = event.questions || [];
    }

    static from(event: any): Event{
        return new Event({
            id:          event.id,
            clientId:    event.client_id,
            title:       event.title,
            slug:        event.slug,
            description: event.description,
            startTime:   new Date(event.start_time),
            endTime:     new Date(event.end_time),
            active:      event.is_active,
            questions:   event.questions
        });
    }
}