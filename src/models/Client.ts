'use strict';

import { IDBClient } from "../db/interfaces";

export class Client {
    [key: string]:    any;

    id?:              number;
    name:             string;
    slug?:            string;
    ownerId:          number;
    types:            string[];
    isDisabled?:      boolean;
    disabledComment?: string|null;

    constructor(c: Client){
        this.id              = c.id;
        this.name            = c.name;
        this.slug            = c.slug;
        this.ownerId         = c.ownerId;
        this.types           = c.types || [];
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

            types: c.types || []
        });
    }
}