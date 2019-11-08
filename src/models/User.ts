'use strict';

import { IDBUser } from "../db/interfaces";

export class User{
    [key: string]: any;

    id?:              number;
    clientId?:        number|null;
    firstName:        string;
    lastName:         string;
    email:            string;
    username:         string;
    password:         string;
    isAnonymous?:     boolean;
    isDisabled?:      boolean;
    disabledComment?: string|null;

    roles:            string[];

    constructor(user: any){
        this.id              = user.id
        this.clientId        = user.clientId
        this.firstName       = user.firstName
        this.lastName        = user.lastName
        this.email           = user.email
        this.username        = user.username
        this.password        = user.password
        this.isAnonymous     = user.isAnonymous;
        this.isDisabled      = user.isDisabled
        this.disabledComment = user.disabledComment

        this.roles           = user.roles || [];
    }

    static fromDb(u: IDBUser): User{
        return new User({
            id:               u.id,
            clientId:         u.client_id,
            firstName:        u.first_name,
            lastName:         u.last_name,
            email:            u.email,
            username:         u.username,
            password:         u.password,
            isAnonymous:      u.is_anonymous,
            isDisabled:       u.is_disabled,
            disabled_comment: u.disabled_comment,

            roles: u.roles || []
        })
    }
}