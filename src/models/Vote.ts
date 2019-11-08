'use strict';

import { IDBQuestionVote } from "../db/interfaces";

export class Vote{
    id?:        number;
    eventId:    number;
    questionId: number;
    userId:     number;
    value:      number;

    constructor(v: Vote){
        this.id         = v.id;
        this.eventId    = v.eventId;
        this.questionId = v.questionId;
        this.userId     = v.userId;
        this.value      = v.value;
    }

    static fromDb(v: IDBQuestionVote): Vote{
        return new Vote({
            id:         v.id,
            eventId:    v.event_id,
            questionId: v.question_id,
            userId:     v.user_id,
            value:      v.value
        });
    }
}