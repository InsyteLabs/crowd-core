'use strict';

export interface IQueryDescriptor{
    name:      string;
    path:      string;
    firstRow?: boolean;
    sql?:      string;
    raw?:      boolean;
}