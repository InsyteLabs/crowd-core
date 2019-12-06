'use strict';

import { IDBClient }  from '../db/interfaces';
import { ClientType } from './ClientType';

export class Client {
    id?:              number;
    name:             string;
    slug?:            string;
    ownerId:          number;
    isDisabled?:      boolean;
    disabledComment?: string|null;

    type: ClientType;

    constructor(c: Client){
        this.id              = c.id;
        this.name            = c.name;
        this.slug            = c.slug;
        this.ownerId         = c.ownerId;
        this.type            = c.type;
        this.isDisabled      = c.isDisabled;
        this.disabledComment = c.disabledComment;

    }

    static fromDb(c: IDBClient): Client{
        return new Client({
            id:              c.id,
            name:            c.name,
            slug:            c.slug,
            ownerId:         c.owner_id,
            isDisabled:      c.is_disabled,
            disabledComment: c.disabled_comment,
            
            type: {
                id:              c.type_id,
                name:            c.type_name,
                maxEvents:       c.max_events,
                maxEventViewers: c.max_event_viewers
            }
        });
    }
}