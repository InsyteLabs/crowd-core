'use strict';

import { IDBAuthLog } from "../../db/interfaces";

export class AuthLog{
    id?: number;

    client: {
        id:   number;
        name: string;
        slug: string;
    }

    user: {
        id:              number;
        firstName:       string;
        lastName:        string;
        email:           string;
        username:        string;
        isAnonymous:     boolean;
        isDisabled:      boolean;
        disabledComment: string;
    }

    ip:      string;
    success: boolean;
    time:    string|Date;

    constructor(l: AuthLog){
        this.id      = l.id;
        this.client  = l.client;
        this.user    = l.user;
        this.ip      = l.ip;
        this.success = l.success;
        this.time    = new Date(l.time);
    }

    static fromDb(l: IDBAuthLog): AuthLog{
        return new AuthLog({
            id: l.id,
            client: {
                id:   l.client_id,
                name: l.client_name,
                slug: l.client_slug
            },
            user: {
                id:                l.user_id,
                firstName:         l.user_first_name,
                lastName:          l.user_last_name,
                email:             l.user_email,
                username:          l.user_username,
                isAnonymous:     !!l.user_is_anonymous,
                isDisabled:      !!l.user_is_disabled,
                disabledComment:   l.user_disabled_comment
            },
            ip:        l.ip,
            success: !!l.success,
            time:      l.time
        });
    }
}