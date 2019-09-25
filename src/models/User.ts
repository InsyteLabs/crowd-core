'use strict';

export class User{
    [key: string]: any;

    id?:              number;
    clientId?:        number|null;
    firstName:        string;
    lastName:         string;
    email:            string;
    username:         string;
    password:         string;
    roles:            (string|number)[];
    isDisabled?:      boolean;
    disabledComment?: string|null;

    constructor(user: any){
        this.id              = user.id
        this.clientId        = user.clientId
        this.firstName       = user.firstName
        this.lastName        = user.lastName
        this.email           = user.email
        this.username        = user.username
        this.password        = user.password
        this.roles           = user.roles ||[];
        this.isDisabled      = user.isDisabled
        this.disabledComment = user.disabledComment
    }

    static from(u: any): User{
        return new User({
            id:              u.id,
            clientId:        u.client_id,
            firstName:       u.first_name,
            lastName:        u.last_name,
            email:           u.email,
            username:        u.username,
            password:        u.password,
            roles:           u.roles,
            isDisabled:      u.is_disabled,
            disabledComment: u.disabled_comment
        })
    }
}