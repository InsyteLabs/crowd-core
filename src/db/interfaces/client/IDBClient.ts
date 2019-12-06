'use strict';

export interface IDBClient{
    id:       number;
    owner_id: number;
    name:     string;
    slug:     string;

    is_disabled:      boolean;
    disabled_comment: string;

    type_id:           number;
    type_name:         string;
    max_events:        number;
    max_event_viewers: number;
}