'use strict';

export interface IDbClient{
    id:       number;
    name:     string;
    slug:     string;

    is_disabled:      boolean;
    disabled_comment: string;

    // Account owner
    owner_id:               number;
    owner_first_name:       string;
    owner_last_name:        string;
    owner_email:            string;
    owner_username:         string;
    owner_is_anonymous:     boolean;
    owner_is_disabled:      boolean;
    owner_disabled_comment: string;

    // Client type
    type_id:              number;
    type_name:            string;
    max_events:           number;
    max_event_viewers:    number;
    max_registered_users: number;

    // Account usage
    total_events:         number;
    active_events:        number;
    anonymous_user_count: number;
    user_count:           number;
    total_users:          number;

}