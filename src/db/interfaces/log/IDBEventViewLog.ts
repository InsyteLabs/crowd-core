'use strict';

export interface IDBEventViewLog{
    id:   number;
    code: string;
    time: Date;

    event_id:    number;
    event_title: string;
    event_slug:  string;

    user_id:           number;
    user_first_name:   string;
    user_last_name:    string;
    user_username:     string;
    user_email:        string;
    user_is_anonymous: boolean;
    user_is_disabled:  boolean;

    client_id:   number;
    client_name: string;
    client_slug: string;
}