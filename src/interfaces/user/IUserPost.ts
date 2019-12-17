'use strict';

export interface IUserPost{
    clientId:  number|null;
    firstName: string;
    lastName:  string;
    email:     string;
    username:  string;
    password:  string;
    roles:     string[];
}