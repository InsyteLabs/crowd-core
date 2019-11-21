'use strict';

export interface IDBAuthLog{
    id: number;

    client_id:   number;
    client_name: string;
    client_slug: string;

    user_first_name:       string;
    user_last_name:        string;
    user_email:            string;
    user_username:         string;
    user_is_anonymous:     boolean;
    user_is_disabled:      boolean;
    user_disabled_comment: string;

    ip:      string;
    success: boolean;
    time:    string;
}