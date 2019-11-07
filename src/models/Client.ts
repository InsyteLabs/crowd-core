'use strict';

import { IDBClient } from "../db/interfaces";

export class Client{
    [key: string]:    any;

    id?:              number;
    name:             string;
    slug?:            string;
    ownerId:          number;
    types:            (string|number)[];
    isDisabled?:      boolean;
    disabledComment?: string|null;

    constructor(c: any){
        this.id              = c.id;
        this.name            = c.name;
        this.slug            = c.slug;
        this.ownerId         = c.ownerId;
        this.types           = c.types || [];
        this.isDisabled      = c.isDisabled;
        this.disabledComment = c.disabledComment;
    }

    static from(c: IDBClient): Client{
        return new Client({
            id:              c.id,
            name:            c.name,
            slug:            c.slug,
            ownerId:         c.owner_id,
            types:           c.types || [],
            isDisabled:      c.is_disabled,
            disabledComment: c.disabled_comment
        });
    }
}