'use strict';

export interface IUserPut{
    id:              number;
    firstName:       string;
    lastName:        string;
    email:           string;
    username:        string;
    isDisabled:      boolean;
    disabledComment: string;
    roles:           string[];
}