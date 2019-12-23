'use strict';

export interface IDbQuestionVote{
    id:          number;
    event_id:    number;
    question_id: number;
    user_id:     number;
    value:       number;
}