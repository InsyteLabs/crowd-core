'use strict';

import { EventSettings } from '../models';

export const DefaultEventSettings: EventSettings = {
    id:              0,
    eventId:         0,
    password:        '',
    requirePassword: false,
    isLocked:        false,
    requireLogin:    false,
    enableChat:      true
}