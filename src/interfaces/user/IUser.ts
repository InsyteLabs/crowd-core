'use strict';

export interface IUser{
    id?:              number;
    clientId?:        number|null;
    firstName:        string;
    lastName:         string;
    email:            string;
    username:         string;
    password:         string;
    lastLogin:        Date|null;
    isAnonymous?:     boolean;
    isDisabled?:      boolean;
    disabledComment?: string|null;

    roles:            string[];
}
