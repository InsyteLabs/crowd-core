'use strict';

import {
    Event, EventSettings, Question, Message, Vote
} from '../models';

import { db }             from '../db';
import { slugify }        from '../utilities';
import { IQuestionScore } from '../interfaces';
import { IDBEvent } from '../db/interfaces';

class EventService{

    /*
        =============
        EVENT METHODS
        =============
    */
    async getEvents(): Promise<Event[]>{
        try{
            const events: IDBEvent[] = await db.q('get-events');

            return events.map(e => Event.fromDb(e));
        }
        catch(e){
            console.error('Failed to get events from database');
            console.error(e.message);

            return [];
        }
    }

    async getClientEvents(clientId: number): Promise<Event[]>{
        try{
            const events: IDBEvent[] = await db.q('get-client-events', [ clientId ]);

            return events.map(e => Event.fromDb(e));
        }
        catch(e){
            console.error(`Failed to get events for client of ID ${ clientId }`);
            console.error(e.message);

            return [];
        }
    }

    async getClientEventBySlug(clientId: number, eventSlug: string): Promise<Event|undefined>{
        try{
            const event: IDBEvent|undefined = await db.q('get-client-event-by-slug', [ clientId, eventSlug ]);
            
            return event ? Event.fromDb(event) : undefined;
        }
        catch(e){
            console.error(`Failed to get event of client ID ${ clientId } and slug ${ eventSlug }`);
            console.error(e.message);
        }
    }

    async getEvent(id: number): Promise<Event|undefined>{
        try{
            const event: IDBEvent|undefined = await db.q('get-event', [ id ]);

            return event ? Event.fromDb(event) : undefined;
        }
        catch(e){
            console.error('Failed to get event from database');
            console.error(e.message);
        }
    }

    async createEvent(event: any): Promise<Event|undefined>{
        let newEvent: IDBEvent|undefined;
        try{
            newEvent = await db.q('create-event', [
                event.clientId,
                event.title,
                event.slug || slugify(event.title),
                event.description,
                event.startTime,
                event.endTime
            ]);
        }
        catch(e){
            console.error(`Failed to create event "${ event.title }"`);
            console.error(e.message);
        }

        if(!newEvent) return;

        if(event.settings){
            try{
                event.settings.eventId = newEvent.id;

                await this.createEventSettings(event.settings);
            }
            catch(e){
                console.error(`Error creating settings for new event "${ event.title }"`);
                console.error(e.message);
            }
        }

        return this.getEvent(newEvent.id);
    }

    async updateEvent(event: any): Promise<Event|undefined>{
        let updatedEvent: IDBEvent|undefined;
        try{
            updatedEvent = await db.q('update-event', [
                event.id,
                event.clientId,
                event.title,
                event.slug || slugify(event.title),
                event.description,
                event.startTime,
                event.endTime
            ]);
        }
        catch(e){
            console.error(`Failed to update event "${ event.title }"`);
            console.error(e.message);
        }

        if(!updatedEvent) return;

        if(event.settings){
            try{
                event.settings.eventId = event.id;

                await this.updateEventSettings(event.settings);
            }
            catch(e){
                console.error(`Error updating settings for event of Id "${ event.id }"`);
                console.error(e.message);
            }
        }

        return this.getEvent(event.id);
    }

    async deleteEvent(id: number): Promise<Event|undefined>{
        const existingEvent: Event|undefined = await this.getEvent(id);

        if(!existingEvent){
            console.error('Not deleting event that could not be found');
            return;
        }

        try{
            await db.q('delete-event', [ id ]);
        }
        catch(e){
            console.error(`Error deleting event of Id "${ id }"`);
            console.error(e.message);
            return;
        }

        return existingEvent;
    }


    /*
        ================
        SETTINGS METHODS
        ================
    */
    async getEventSettings(eventId: number): Promise<EventSettings>{
        try{
            const settings = await db.q('get-event-settings', [ eventId ]);

            return EventSettings.from(settings || {});
        }
        catch(e){
            console.error(`Failed to get settings for event of id ${ eventId }`);
            console.error(e);

            return EventSettings.from({});
        }
    }

    async createEventSettings(s: EventSettings){
        try{
            const args = [
                s.eventId,
                s.isLocked,
                s.requirePassword,
                s.password,
                s.requireLogin,
                s.enableChat
            ];

            const settings = await db.q('create-event-settings', args);

            return EventSettings.from(settings);
        }
        catch(e){
            console.error(`Failed to create settings for event of ID ${ s.eventId }`);
            console.error(e);

            return EventSettings.from({});
        }
    }

    async updateEventSettings(s: EventSettings){
        try{
            const args = [
                s.eventId,
                s.isLocked,
                s.requirePassword,
                s.password,
                s.requireLogin,
                s.enableChat
            ];
            
            const settings = await db.q('update-event-settings', args);

            return EventSettings.from(settings);
        }
        catch(e){
            console.error(`Failed to update settings for event of ID ${ s.eventId }`);
            console.error(e);

            return EventSettings.from({});
        }
    }


    /*
        ================
        QUESTION METHODS
        ================
    */
    async getQuestions(): Promise<Question[]>{
        try{
            const questions = await db.query('get-questions');

            return questions.map((q: any) => Question.from(q));
        }
        catch(e){
            console.error('Failed to get questions from database');
            console.error(e);

            return [];
        }
    }

    async getQuestion(id: number): Promise<Question>{
        try{
            const question = await db.q('get-question', [ id ]),
                  stats    = await this.getQuestionScore(question.event_id, id);

            question.stats = stats;

            return Question.from(question);
        }
        catch(e){
            console.error(`Failed to get question of ID ${ id } from database`);
            console.error(e);

            return new Question({});
        }
    }

    async getEventQuestions(eventId: number): Promise<Question[]>{
        try{
            const questions = await db.q('get-event-questions', [ eventId ]);

            /*
                This bad, need to refactor the question getting query to also get
                the score
            */
            for(let i = 0, len = questions.length; i < len; i++){
                const question = questions[i],
                      stats    = await this.getQuestionScore(eventId, question.id);
                
                question.stats = stats;
            }

            return questions.map((q: any) => Question.from(q));
        }
        catch(e){
            console.error(`Failed to load quations for event of ID ${ eventId }`);
            console.error(e);

            return [];
        }
    }

    async deleteQuestion(id: number): Promise<Question>{
        try{
            const question = await db.q('delete-question', [ id ]);

            return Question.from(question || {});
        }
        catch(e){
            console.error(`Failed to delete question of ID ${ id }`);
            console.error(e);

            return Question.from({});
        }
    }

    async deleteEventQuestions(eventId: number): Promise<Question[]>{
        try{
            const questions = await db.q('delete-event-questions', [ eventId ]);

            return questions.map(Question.from);
        }
        catch(e){
            console.error(`Failed to delete questions for event of ID ${ eventId }`);
            console.error(e);

            return [];
        }
    }

    async createQuestion(q: Question): Promise<Question>{
        const args = [
            q.eventId,
            q.userId,
            q.text
        ];

        try{
            const question = await db.q('create-question', args);

            return this.getQuestion(question.id);
        }
        catch(e){
            console.error(`Failed to create question for event of ID ${ q.eventId }`);
            console.error(e);

            return new Question({});
        }
    }

    async updateQuestion(q: Question): Promise<Question>{
        const args = [
            q.id,
            q.eventId,
            q.userId,
            q.text,
            q.hidden
        ];

        try{
            const question = await db.q('update-question', args);

            return this.getQuestion(question.id);
        }
        catch(e){
            console.error(`Failed to update question for event of ID ${ q.eventId }`);
            console.error(e);

            return new Question({});
        }
    }


    /*
        =====================
        QUESTION VOTE METHODS
        =====================
    */
    async getQuestionVoteByUser(questionId: number, userId: number): Promise<Vote>{
        try{
            let vote = await db.q('get-question-vote-by-user', [ questionId, userId ]);

            return Vote.from(vote || {});
        }
        catch(e){
            console.error(`Error fetching vote of questionId ${ questionId } and userId ${ userId }`);
            console.error(e);

            return Vote.from({});
        }
    }

    async createQuestionVote(vote: Vote): Promise<Question>{
        let existing
        try{
            existing = await this.getQuestionVoteByUser(vote.questionId, vote.userId);
        }
        catch(e){
            console.error(`Error fetching existing vote of questionId ${ vote.questionId } and userId ${ vote.userId }`);
            console.error(e);

            return this.getQuestion(vote.questionId);
        }

        if(existing && existing.id){
            try{
                const deleted = await this.deleteVote(existing.id);

                // If vote was the same, do not write new vote (un-vote)
                if(existing.value === vote.value){
                    return this.getQuestion(vote.questionId);
                }
            }
            catch(e){
                throw e;
            }
        }

        const args = [
            vote.eventId,
            vote.questionId,
            vote.userId,
            vote.value
        ];

        try{
            let vote = await db.q('create-question-vote', args);
                vote = Vote.from(vote);
            
            return this.getQuestion(vote.questionId);
        }
        catch(e){
            console.error(`Error creating vote of questionId ${ vote.questionId } and userId ${ vote.userId }`);
            console.error(e);

            return this.getQuestion(vote.questionId);
        }
    }

    async deleteQuestionVotes(questionId: number): Promise<boolean>{
        try{
            const deleted = await db.q('delete-question-votes', [ questionId ]);

            return true;
        }
        catch(e){
            console.error(`Failed to delete votes for question of ID ${ questionId }`);
            console.error(e);

            return false;
        }
    }

    async deleteVote(voteId: number): Promise<boolean>{
        try{
            const deleted = await db.q('delete-vote', [ voteId ]);

            return true;
        }
        catch(e){
            console.error(`Error deleting vote of ID ${ voteId }`);
            console.error(e);

            return false;
        }
    }

    async getQuestionScore(eventId: number, questionId: number): Promise<IQuestionScore>{
        try{
            const score: IQuestionScore = await db.q('get-question-score', [ eventId, questionId ]);

            return score;
        }
        catch(e){
            console.error(`Failed to get score for questionId ${ questionId }`);
            console.error(e);

            return {}
        }
    }


    /*
        ==================
        EVENT CHAT METHODS
        ==================
    */
    async getEventMessages(eventId: number): Promise<Message[]>{
        try{
            let messages = await db.q('get-event-messages', [ eventId ]);

            return messages.map((m: any) => Message.from(m));
        }
        catch(e){
            console.error(`Failed to get messages for event of ID ${ eventId }`);
            console.error(e);

            return [];
        }
    }

    async getEventMessage(id: number): Promise<Message>{
        try{
            const message = await db.q('get-message', [ id ]);

            return Message.from(message);
        }
        catch(e){
            console.error(`Failed to get message of ID ${ id }`);
            console.error(e);

            return Message.from({});
        }
    }

    async createEventMessage(m: Message): Promise<Message>{
        const args = [
            m.eventId,
            m.userId,
            m.text
        ];

        try{
            const message = await db.q('create-event-message', args);

            return this.getEventMessage(message.id);
        }
        catch(e){
            console.error(`Failed to create message for event of ID ${ m.id }`);
            console.error(e);

            return new Message({});
        }
    }

    async updateEventMessage(m: Message): Promise<Message>{
        const args = [
            m.id,
            m.text,
            m.hidden
        ];

        try{
            const message = await db.q('update-event-message', args);

            return this.getEventMessage(message.id);
        }
        catch(e){
            console.error(`Failed to update message of ID ${ m.id }`);
            console.error(e);

            return new Message({});
        }
    }

    async deleteEventMessage(id: number): Promise<Message>{
        try{
            const messageOriginal = await this.getEventMessage(id);

            await db.q('delete-event-message', [ id ]);

            return messageOriginal;
        }
        catch(e){
            console.error(`Failed to delete message of ID ${ id }`);
            console.error(e);

            return Message.from({});
        }
    }
}

export const eventService = new EventService();