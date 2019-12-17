'use strict';


import { db }      from '../db';
import { slugify } from '../utilities';

import {
    Event, EventSettings, Question, Message, Vote
} from '../models';

import {
    IQuestionPost, IQuestionPut, IVotePost, IMessagePost, IMessagePut
} from '../interfaces';

import {
    IDBEvent, IDBEventSettings, IDBQuestion, IDBQuestionVote, IDBMessage
} from '../db/interfaces';

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
    async getEventSettings(eventId: number): Promise<EventSettings|undefined>{
        try{
            const settings: IDBEventSettings|undefined = await db.q('get-event-settings', [ eventId ]);

            return settings ? EventSettings.fromDb(settings) : undefined;
        }
        catch(e){
            console.error(`Failed to get settings for event of id ${ eventId }`);
            console.error(e.message);
        }
    }

    async createEventSettings(s: EventSettings){
        try{
            const settings: IDBEventSettings|undefined = await db.q('create-event-settings', [
                s.eventId,
                s.isLocked,
                s.requirePassword,
                s.password,
                s.requireLogin,
                s.enableChat
            ]);

            return settings ? EventSettings.fromDb(settings) : undefined;
        }
        catch(e){
            console.error(`Failed to create settings for event of ID ${ s.eventId }`);
            console.error(e.message);
        }
    }

    async updateEventSettings(s: EventSettings): Promise<EventSettings|undefined>{
        try{
            const settings: IDBEventSettings|undefined = await db.q('update-event-settings', [
                s.eventId,
                s.isLocked,
                s.requirePassword,
                s.password,
                s.requireLogin,
                s.enableChat
            ]);

            return settings ? EventSettings.fromDb(settings) : undefined;
        }
        catch(e){
            console.error(`Failed to update settings for event of ID ${ s.eventId }`);
            console.error(e.message);
        }
    }


    /*
        ================
        QUESTION METHODS
        ================
    */
    async getQuestions(userId: number): Promise<Question[]>{
        try{
            const questions: IDBQuestion[] = await db.query('get-questions', [ userId ]);

            return questions.map(q => Question.fromDb(q));
        }
        catch(e){
            console.error('Failed to get questions from database');
            console.error(e.message);

            return [];
        }
    }

    async getQuestion(userId: number, id: number): Promise<Question|undefined>{
        try{
            const question: IDBQuestion|undefined = await db.q('get-question', [ userId, id ]);

            return question ? Question.fromDb(question) : undefined;
        }
        catch(e){
            console.error(`Failed to get question of ID ${ id } from database`);
            console.error(e.message);
        }
    }

    async getEventQuestions(userId: number, eventId: number): Promise<Question[]>{
        try{
            const questions: IDBQuestion[] = await db.q('get-event-questions', [ userId, eventId ]);
            
            return questions.map(q => Question.fromDb(q));
        }
        catch(e){
            console.error(`Failed to load quations for event of ID ${ eventId }`);
            console.error(e.message);

            return [];
        }
    }

    async deleteQuestion(userId: number, id: number): Promise<Question|undefined>{
        const existing: Question|undefined = await this.getQuestion(userId, id);

        if(!existing) return;

        try{
            const question = await db.q('delete-question', [ id ]);

            return existing;
        }
        catch(e){
            console.error(`Failed to delete question of ID ${ id }`);
            console.error(e.message);
        }
    }

    async createQuestion(q: IQuestionPost): Promise<Question|undefined>{
        try{
            const question: IDBQuestion|undefined = await db.q('create-question', [
                q.eventId,
                q.userId,
                q.text
            ]);

            return question ? this.getQuestion(question.user_id, question.id) : undefined;
        }
        catch(e){
            console.error(`Failed to create question for event of ID ${ q.eventId }`);
            console.error(e.message);
        }
    }

    async updateQuestion(q: IQuestionPut): Promise<Question|undefined>{
        try{
            const question: IDBQuestion|undefined = await db.q('update-question', [
                q.id,
                q.eventId,
                q.userId,
                q.text,
                q.hidden
            ]);

            return question ? this.getQuestion(question.user_id, question.id) : undefined;
        }
        catch(e){
            console.error(`Failed to update question for event of ID ${ q.eventId }`);
            console.error(e.message);
        }
    }


    /*
        =====================
        QUESTION VOTE METHODS
        =====================
    */
    async getQuestionVoteByUser(questionId: number, userId: number): Promise<Vote|undefined>{
        try{
            const vote: IDBQuestionVote|undefined = await db.q('get-question-vote-by-user', [ questionId, userId ]);

            return vote ? Vote.fromDb(vote) : undefined;
        }
        catch(e){
            console.error(`Error fetching vote of questionId ${ questionId } and userId ${ userId }`);
            console.error(e.message);
        }
    }

    async createQuestionVote(vote: IVotePost): Promise<Question|undefined>{
        const existing: Vote|undefined = await this.getQuestionVoteByUser(vote.questionId, vote.userId);

        if(existing && existing.id){
            await this.deleteVote(existing.id);

            // If vote was the same, do not write new vote (un-vote)
            if(existing.value === vote.value){
                return this.getQuestion(vote.userId, vote.questionId);
            }
        }

        try{
            await db.q('create-question-vote', [
                vote.eventId,
                vote.questionId,
                vote.userId,
                vote.value
            ]);
        }
        catch(e){
            console.error(`Error creating vote of questionId ${ vote.questionId } and userId ${ vote.userId }`);
            console.error(e.message);
        }

        return this.getQuestion(vote.userId, vote.questionId);
    }

    async deleteVote(voteId: number): Promise<boolean>{
        try{
            await db.q('delete-vote', [ voteId ]);

            return true;
        }
        catch(e){
            console.error(`Error deleting vote of ID ${ voteId }`);
            console.error(e.message);

            return false;
        }
    }

    /*
        ==================
        EVENT CHAT METHODS
        ==================
    */
    async getEventMessages(eventId: number): Promise<Message[]>{
        try{
            let messages: IDBMessage[] = await db.q('get-event-messages', [ eventId ]);

            return messages.map((m: any) => Message.from(m));
        }
        catch(e){
            console.error(`Failed to get messages for event of ID ${ eventId }`);
            console.error(e);

            return [];
        }
    }

    async getEventMessage(id: number): Promise<Message|undefined>{
        try{
            const message: IDBMessage|undefined = await db.q('get-message', [ id ]);

            return message ? Message.from(message) : message;
        }
        catch(e){
            console.error(`Failed to get message of ID ${ id }`);
            console.error(e);
        }
    }

    async createEventMessage(m: IMessagePost): Promise<Message|undefined>{
        const args = [
            m.eventId,
            m.userId,
            m.text
        ];

        try{
            const message: IDBMessage|undefined = await db.q('create-event-message', args);

            return message ? this.getEventMessage(message.id) : undefined;
        }
        catch(e){
            console.error(`Failed to create message for event of ID ${ m.eventId }`);
            console.error(e);
        }
    }

    async updateEventMessage(m: IMessagePut): Promise<Message|undefined>{
        const args = [
            m.id,
            m.text,
            m.hidden
        ];

        try{
            const message: IDBMessage|undefined = await db.q('update-event-message', args);

            return message ? this.getEventMessage(message.id) : undefined;
        }
        catch(e){
            console.error(`Failed to update message of ID ${ m.id }`);
            console.error(e);
        }
    }

    async deleteEventMessage(id: number): Promise<Message|undefined>{
        try{
            const messageOriginal = await this.getEventMessage(id);

            await db.q('delete-event-message', [ id ]);

            return messageOriginal;
        }
        catch(e){
            console.error(`Failed to delete message of ID ${ id }`);
            console.error(e);
        }
    }
}

export const eventService = new EventService();