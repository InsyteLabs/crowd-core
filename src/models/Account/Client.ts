'use strict';

import { IDBClient }  from '../../db/interfaces';
import { ClientType } from './ClientType';

export class Client {
    id?:              number;
    name:             string;
    slug?:            string;
    isDisabled?:      boolean;
    disabledComment?: string|null;

    owner: {
        id:              number;
        firstName:       string;
        lastName:        string;
        email:           string;
        username:        string;
        isAnonymous:     boolean;
        isDisabled:      boolean;
        disabledComment: string;
    }

    type: ClientType;

    usage: {
        totalEvents:        number;
        activeEvents:       number;
        userCount:          number;
        anonymousUserCount: number;
        totalUsers:         number;
    }

    constructor(c: Client){
        this.id              = c.id;
        this.name            = c.name;
        this.slug            = c.slug;
        this.owner           = c.owner;
        this.type            = c.type;
        this.isDisabled      = c.isDisabled;
        this.disabledComment = c.disabledComment;
        this.usage           = c.usage;
    }

    static fromDb(c: IDBClient): Client{
        return new Client({
            id:              c.id,
            name:            c.name,
            slug:            c.slug,
            isDisabled:      c.is_disabled,
            disabledComment: c.disabled_comment,

            owner: {
                id:                c.owner_id,
                firstName:         c.owner_first_name,
                lastName:          c.owner_last_name,
                email:             c.owner_email,
                username:          c.owner_username,
                isAnonymous:     !!c.owner_is_anonymous,
                isDisabled:      !!c.owner_is_disabled,
                disabledComment:   c.owner_disabled_comment
            },
            
            type: {
                id:                 c.type_id,
                name:               c.type_name,
                maxEvents:          c.max_events,
                maxEventViewers:    c.max_event_viewers,
                maxRegisteredUsers: c.max_registered_users
            },

            usage: {
                totalEvents:        c.total_events,
                activeEvents:       c.active_events,
                userCount:          c.user_count,
                anonymousUserCount: c.anonymous_user_count,
                totalUsers:         c.total_users
            }
        });
    }
}