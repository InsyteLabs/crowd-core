'use strict';

export interface IDbClientType{
    id:                   number;
    name:                 string;
    max_events:           number;
    max_event_viewers:    number;
    max_registered_users: number;
}