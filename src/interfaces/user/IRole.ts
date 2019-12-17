'use strict';

export interface IRole{
    [key: string]: any;
    
    id?:  number|null;
    name: string;
}