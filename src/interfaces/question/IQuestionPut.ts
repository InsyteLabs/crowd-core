'use strict';

export interface IQuestionPut{
    id:      number;
    eventId: number;
    userId:  number;
    text:    string;
    hidden:  boolean;
}