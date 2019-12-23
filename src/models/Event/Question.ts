'use strict';

import { IQuestionScore } from '../../interfaces';
import { IDbQuestion }    from '../../db/interfaces';

export class Question{
    id?:      number;
    eventId:  number;
    text:     string;
    hidden:   boolean;
    stats?:   IQuestionScore;

    userId:   number;
    user: {
        id:          number;
        firstName:   string;
        lastName:    string;
        username:    string;
        isAnonymous: boolean;
    }

    moderatorResponse: string;
    moderator: {
        id:          number;
        firstName:   string;
        lastName:    string;
        username:    string;
        isAnonymous: boolean;
    }

    constructor(q: Question){
        this.id                = q.id;
        this.eventId           = q.eventId;
        this.userId            = q.userId;
        this.user              = q.user || {};
        this.moderatorResponse = q.moderatorResponse;
        this.moderator         = q.moderator;
        this.text              = q.text;
        this.hidden            = q.hidden;
        this.stats             = q.stats;
    }

    static fromDb(q: IDbQuestion): Question{
        return new Question({
            id:      q.id,
            eventId: q.event_id,

            text:   q.text,
            hidden: q.hidden,

            userId: q.user_id,
            user: {
                id:            q.user_id,
                firstName:     q.user_first_name,
                lastName:      q.user_last_name,
                username:      q.user_username,
                isAnonymous: !!q.user_is_anonymous
            },

            moderatorResponse: q.moderator_response,
            moderator: {
                id:          q.moderator_id,
                firstName:   q.moderator_first_name,
                lastName:    q.moderator_last_name,
                username:    q.moderator_username,
                isAnonymous: q.moderator_is_anonymous
            },

            stats: {
                upvotes:       q.upvotes,
                downvotes:     q.downvotes,
                votes:         q.votes,
                score:         q.score,
                userVote:      q.user_vote,
                voteRequester: q.vote_requester
            },
        });
    }
}