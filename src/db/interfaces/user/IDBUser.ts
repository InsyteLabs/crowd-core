'use strict';

export interface IDbUser{
    id:        number;
    client_id: number;

    first_name: string;
    last_name:  string;
    email:      string;
    username:   string;
    password:   string;
    last_login: Date|string;

    is_anonymous:     boolean;
    is_disabled:      boolean;
    disabled_comment: string;

    roles: string[];
}