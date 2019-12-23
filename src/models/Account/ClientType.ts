'use strict';

import { IDbClientType } from '../../db/interfaces';

export class ClientType{
    id:                 number;
    name:               string;
    maxEvents:          number;
    maxEventViewers:    number;
    maxRegisteredUsers: number;

    constructor(c: ClientType){
        this.id                 = c.id;
        this.name               = c.name;
        this.maxEvents          = c.maxEvents;
        this.maxEventViewers    = c.maxEventViewers;
        this.maxRegisteredUsers = c.maxRegisteredUsers
    }

    static fromDb(c: IDbClientType): ClientType{
        return new ClientType({
            id:                 c.id,
            name:               c.name,
            maxEvents:          c.max_events,
            maxEventViewers:    c.max_event_viewers,
            maxRegisteredUsers: c.max_registered_users
        });
    }
}