'use strict';

export interface IEventSettingPost{
    eventId?:        number;
    isLocked:        boolean;
    requirePassword: boolean;
    password:        string|null;
    requireLogin:    boolean;
    enableChat:      boolean;
}