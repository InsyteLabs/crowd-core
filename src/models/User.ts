'use strict';

export class User{
    [key: string]: any;

    id?:              number;
    clientId:         number;
    firstName:        string;
    lastName:         string;
    email:            string;
    username:         string;
    password:         string;
    isDisabled?:      boolean;
    disabledComment?: string|null;

    constructor(user: any){
        this.id              = user.id
        this.clientId        = user.client_id
        this.firstName       = user.first_name
        this.lastName        = user.last_name
        this.email           = user.email
        this.username        = user.username
        this.password        = user.password
        this.isDisabled      = user.is_disabled
        this.disabledComment = user.disabled_comment
    }
}