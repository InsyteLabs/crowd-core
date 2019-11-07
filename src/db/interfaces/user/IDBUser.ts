'use strict';

export interface IDBUser{
    id:        number;
    client_id: number;

    first_name: string;
    last_name:  string;
    email:      string;
    username:   string;
    password:   string;

    is_anonymous:     boolean;
    is_disabled:      boolean;
    disabled_comment: string;

    roles: (string|number)[];
}