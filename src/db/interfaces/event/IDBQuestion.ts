'use strict';

export interface IDBQuestion{
    id:       number;
    event_id: number;
    
    text:   string;
    hidden: boolean;

    stats?: any;

    user_id:           number;
    user_first_name:   string;
    user_last_name:    string;
    user_username:     string;
    user_is_anonymous: string;

    user_vote: number;
    upvotes:   number;
    downvotes: number;
    votes:     number;
    score:     number;
}