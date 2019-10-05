'use strict';

import {
    Event, EventSettings, Question, Message, Vote
} from '../models';

import { db }             from '../db';
import { slugify }        from '../utilities';
import { IQuestionScore } from '../interfaces';

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

    async getClientEvents(clientId: number): Promise<Event[]>{
        try{
            const events = await db.q('get-client-events', [ clientId ]);

            for(let i = 0, len = events.length; i < len; i++){
                const event = events[i];

                try{
                    event.questions = await this.getEventQuestions(<number>event.id);
                    event.settings  = await this.getEventSettings(<number>event.id);
                }
                catch(e){
                    console.error(`Failed to get questions for event of ID ${ event.id }`);
                    console.error(e);

                    event.questions = [];
                }
            }

            return events.map((e: any) => Event.from(e));
        }
        catch(e){
            console.error(`Failed to get events for client of ID ${ clientId }`);
            console.error(e);

            return [];
        }
    }

    async getEvent(id: number): Promise<Event>{
        try{
            const event:     Event         = await db.q('get-event', [ id ]),
                  questions: Question[]    = await this.getEventQuestions(id),
                  settings:  EventSettings = await this.getEventSettings(id);

            event.questions = questions;
            event.settings  = settings;

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
            const newEvent = await db.q('create-event', args);

            if(event.settings){
                try{
                    event.settings.eventId = newEvent.id;

                    const settings = await this.createEventSettings(event.settings);

                    newEvent.settings = settings;
                }
                catch(e){
                    console.error(e);
                }
            }

            return Event.from(newEvent);
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
            const updatedEvent = await db.q('update-event', args);

            if(event.settings){
                console.log(`Updating settings for event of ID ${ event.id }`);
                console.log(event.settings);
                try{
                    event.settings.eventId = event.id;

                    const settings = await this.updateEventSettings(event.settings);

                    updatedEvent.settings = settings;
                }
                catch(e){
                    console.error(e);
                }
            }

            return Event.from(updatedEvent);
        }
        catch(e){
            console.error(`Failed to update event "${ event.title }"`);
            console.error(e);

            return new Event({});
        }
    }

    async deleteEvent(id: number): Promise<Event>{
        try{
            const settings = await db.q('delete-event-settings', [ id ]),
                  event    = await db.q('delete-event', [ id ]);

            event.settings = settings;

            return Event.from(event);
        }
        catch(e){
            console.error(`Failed to delete event of ID ${ id }`);
            console.error(e);

            return new Event({});
        }
    }


    /*
        ================
        SETTINGS METHODS
        ================
    */
    async getEventSettings(eventId: number): Promise<EventSettings>{
        try{
            const settings = await db.q('get-event-settings', [ eventId ]);

            return EventSettings.from(settings);
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
        console.log('eventService.updateEventSettings');
        console.log(s);
        try{
            const args = [
                s.eventId,
                s.isLocked,
                s.requirePassword,
                s.password,
                s.requireLogin,
                s.enableChat
            ];

            console.log(args);
            console.log('-------------------');
            
            const settings = await db.q('update-event-settings', args);

            console.log(settings);

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
                  stats    = await this.getQuestionScore(question.eventId, id);

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
        =====================
        QUESTION VOTE METHODS
        =====================
    */
    async getQuestionVoteByUser(questionId: number, userId: number): Promise<Vote>{
        try{
            let vote = await db.q('get-question-vote-by-user', [ questionId, userId ]);

            return Vote.from(vote);
        }
        catch(e){
            console.error(`Error fetching vote of questionId ${ questionId } and userId ${ userId }`);
            console.error(e);

            return Vote.from({});
        }
    }

    async createQuestionVote(vote: Vote): Promise<Vote>{
        let existing
        try{
            existing = await this.getQuestionVoteByUser(vote.questionId, vote.userId);
        }
        catch(e){
            console.error(`Error fetching existing vote of questionId ${ vote.questionId } and userId ${ vote.userId }`);
            console.error(e);

            return Vote.from({});
        }

        if(existing && existing.id){
            if(existing.value === vote.value){
                return existing;
            }
            else{
                try{
                    await this.deleteVote(existing.id);
                }
                catch(e){
                    throw e;
                }
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
            
            return Vote.from(vote);
        }
        catch(e){
            console.error(`Error creating vote of questionId ${ vote.questionId } and userId ${ vote.userId }`);
            console.error(e);

            return Vote.from({});
        }
    }

    async deleteVote(voteId: number): Promise<void>{
        try{
            const deleted = await db.q('delete-vote', [ voteId ]);
        }
        catch(e){
            console.error(`Error deleting vote of ID ${ voteId }`);
            console.error(e);

            throw e;
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