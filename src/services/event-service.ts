'use strict';

import { db }              from '../db';
import { Event, Question, Message } from '../models';
import { slugify }         from '../utilities';

class EventService{

    /*
        =============
        EVENT METHODS
        =============
    */
    async getEvents(): Promise<Event[]>{
        try{
            const events: Event[] = await db.q('get-events');

            return events.map(e => Event.from(e));
        }
        catch(e){
            console.error('Failed to get events from database');
            console.error(e);

            return [];
        }
    }

    async getEvent(id: number): Promise<Event>{
        try{
            const event:     Event      = await db.q('get-event', [ id ]),
                  questions: Question[] = await this.getEventQuestions(id);

            event.questions = questions;

            return Event.from(event);
        }
        catch(e){
            console.error('Failed to get event from database');
            console.error(e);

            return new Event({});
        }
    }

    async createEvent(event: any): Promise<Event>{
        const args = [
            event.clientId,
            event.title,
            event.slug || slugify(event.title),
            event.description,
            event.startTime,
            event.endTime
        ];

        try{
            const event = await db.q('create-event', args);

            return Event.from(event);
        }
        catch(e){
            console.error(`Failed to create event "${ event.title }"`);
            console.error(e);

            return new Event({});
        }
    }

    async updateEvent(event: any): Promise<Event>{
        const args = [
            event.id,
            event.clientId,
            event.title,
            event.slug || slugify(event.title),
            event.description,
            event.startTime,
            event.endTime
        ];

        try{
            const event = await db.q('update-event', args);

            return Event.from(event);
        }
        catch(e){
            console.error(`Failed to update event "${ event.title }"`);
            console.error(e);

            return new Event({});
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
            const question = await db.q('get-question', [ id ]);

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

            return questions.map((q: any) => Question.from(q));
        }
        catch(e){
            console.error(`Failed to load quations for event of ID ${ eventId }`);
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

            return Question.from(question);
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

            return Question.from(question);
        }
        catch(e){
            console.error(`Failed to update question for event of ID ${ q.eventId }`);
            console.error(e);

            return new Question({});
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

    async createEventMessage(m: Message): Promise<Message>{
        const args = [
            m.eventId,
            m.userId,
            m.text
        ];

        try{
            const message = await db.q('create-event-message', args);

            return Message.from(message);
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

            return Message.from(message);
        }
        catch(e){
            console.error(`Failed to update message of ID ${ m.id }`);
            console.error(e);

            return new Message({});
        }
    }

    async deleteEventMessage(id: number): Promise<boolean>{
        try{
            const deleted = await db.q('delete-event-message', [ id ]);

            return deleted ? true : false;
        }
        catch(e){
            console.error(`Failed to delete message of ID ${ id }`);
            console.error(e);

            return false;
        }
    }
}

export const eventService = new EventService();