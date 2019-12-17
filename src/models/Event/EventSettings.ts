'use strict';

import { IDBEventSettings } from '../../db/interfaces';

export class EventSettings{
    id?:             number;
    eventId:         number;
    password:        string;
    requirePassword: boolean;
    isLocked:        boolean;
    requireLogin:    boolean;
    enableChat:      boolean;

    constructor(s: EventSettings){
        this.id              = s.id;
        this.eventId         = s.eventId;
        this.password        = s.password;
        this.requirePassword = s.requirePassword;
        this.isLocked        = s.isLocked;
        this.requireLogin    = s.requireLogin;
        this.enableChat      = s.enableChat;
    }

    static fromDb(s: IDBEventSettings): EventSettings{
        return new EventSettings({
            id:              s.id,
            eventId:         s.event_id,
            password:        s.password,
            requirePassword: s.require_password,
            isLocked:        s.is_locked,
            requireLogin:    s.require_login,
            enableChat:      s.enable_chat
        });
    }
}