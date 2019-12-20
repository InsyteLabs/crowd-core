'use strict';

export interface IDBEvent{
    id:        number;
    client_id: number;

    title:       string;
    slug:        string;
    slug_id:     string;
    description: string;
    start_time:  string;
    end_time:    string;
    is_active:   boolean;
    views:       number;

    // Settings
    settings_id:      number;
    is_locked:        boolean;
    require_password: boolean;
    password:         string;
    require_login:    boolean;
    enable_chat:      boolean;
}