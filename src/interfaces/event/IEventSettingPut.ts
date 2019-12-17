'use strict';

export interface IEventSettingPut{
    eventId:         number;
    isLocked:        boolean;
    requirePassword: boolean;
    password:        string|null;
    requireLogin:    boolean;
    enableChat:      boolean;
}