'use strict';

export interface IClientPut{
    id:              number;
    name:            string;
    slug:            string;
    ownerId:         number;
    typeId:          number;
    isDisabled:      boolean;
    disabledComment: string;
}