'use strict';

export interface IDBClient{
    [key: string]: any;
    
    id:       number;
    owner_id: number;
    name:     string;
    slug:     string;

    is_disabled:      boolean;
    disabled_comment: string;

    types: string[];
}