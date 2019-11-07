'use strict';

export interface IDBEventSettings{
    id:       number;
    event_id: number;

    password:         string;
    require_password: boolean;
    is_locked:        boolean;
    require_login:    boolean;
    enable_chat:      boolean;
}