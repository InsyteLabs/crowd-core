'use strict';

export interface IDBClientType{
    id:                   number;
    name:                 string;
    max_events:           number;
    max_event_viewers:    number;
    max_registered_users: number;
}