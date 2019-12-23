'use strict';

export interface IDbMessage{
    id:       number;
    event_id: number;

    text:   string;
    hidden: boolean;

    user_id:           number;
    user_first_name:   string;
    user_last_name:    string;
    user_username:     string;
    user_is_anonymous: string;
}