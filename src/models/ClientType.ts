'use strict';

import { IDBClientType } from "../db/interfaces";

export class ClientType{
    id:              number;
    name:            string;
    maxEvents:       number;
    maxEventViewers: number;

    constructor(c: ClientType){
        this.id              = c.id;
        this.name            = c.name;
        this.maxEvents       = c.maxEvents;
        this.maxEventViewers = c.maxEventViewers;
    }

    static fromDb(c: IDBClientType): ClientType{
        return new ClientType({
            id:              c.id,
            name:            c.name,
            maxEvents:       c.max_events,
            maxEventViewers: c.max_event_viewers
        });
    }
}