'use strict';

export interface IDBEvent{
    id:        number;
    client_id: number;

    title:       string;
    slug:        string;
    description: string;
    start_time:  string;
    end_time:    string;
    is_active:   boolean;
}