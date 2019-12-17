'use strict';

import { Router } from 'express';

import { eventService } from '../services';
import { http }         from '../utilities';
import { SocketServer } from '../socket-server';
import { MessageType }  from '../constants';

import { Client, User, Question }                 from '../models';
import { IQuestionPost, IQuestionPut, IVotePost } from '../interfaces';

const router = Router();

router.get('/events/:eventId/questions', async (req, res, next) => {
    const user: User = res.locals.user;
    try{
        const questions: Question[] = await eventService.getEventQuestions(<number>user.id, +req.params.eventId);

        return res.json(questions);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.post('/events/:eventId/questions', async (req, res, next) => {
    const client: Client = res.locals.client,
          user:   User   = res.locals.user;

    try{
        /*
            TODO
            ----
            - Check that user has permissions to create question
            - Check that event is active
            - Sanitize inputs
        */
        const question: IQuestionPost = {
            eventId: +req.params.eventId,
            text:     req.body,
            userId:   <number>user.id
        }

        const newQuestion: Question|undefined = await eventService.createQuestion(question);

        if(!newQuestion){
            return http.serverError(res, new Error('Error creating new question'));
        }

        res.json(newQuestion);

        const clientSlug:   string       = <string>client.slug,
              channel:      string       = `client::${ clientSlug };events::${ newQuestion.eventId }`,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(channel, MessageType.QUESTION_CREATED, newQuestion);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.put('/events/:eventId/questions/:questionId', async (req, res, next) => {
    const client: Client = res.locals.client,
          user:   User   = res.locals.user;

    try{
        /*
            TODO
            ----
            - Check that user has permissions to update question
                - User must own question
                - Mods can respond/make updates in other route
            - Check that event is active
            - Sanitize inputs
        */
        const question: IQuestionPut = {
            id:      +req.body.id,
            eventId: +req.params.eventId,
            userId:   <number>user.id,
            text:     req.body.text,
            hidden:   !!req.body.hidden
        }

        const updatedQuestion: Question|undefined = await eventService.updateQuestion(question);

        if(!updatedQuestion){
            return http.serverError(res, new Error('Error updating question'));
        }

        res.json(updatedQuestion);

        const clientSlug:   string       = <string>client.slug,
              channel:      string       = `client::${ clientSlug };events::${ updatedQuestion.eventId }`,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(channel, MessageType.QUESTION_UPDATED, updatedQuestion);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.delete('/events/:eventId/questions/:questionId', async (req, res, next) => {
    const client: Client = res.locals.client,
          user:   User   = res.locals.user;

    try{
        /*
            TODO
            ----
            - Check that user has permissions to delete question
                - User must own question or be mod/admin
            - Check that event is active
        */
        const deletedQuestion: Question|undefined = await eventService.deleteQuestion(<number>user.id, +req.params.questionId);

        if(!deletedQuestion){
            return http.notFound(res);
        }

        res.json(deletedQuestion);

        const clientSlug:   string       = <string>client.slug,
              channel:      string       = `client::${ clientSlug };events::${ deletedQuestion.eventId }`,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(channel, MessageType.QUESTION_DELETED, deletedQuestion);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.post('/events/:eventId/questions/:questionId/votes', async (req, res, next) => {
    const client: Client = res.locals.client,
          user:   User   = res.locals.user;

    let value = parseInt(req.body.value);
    
    if(isNaN(value)){
        return http.clientError(res, 'Error parsing vote value');
    }

    try{
        const vote: IVotePost = {
            eventId:    +req.params.eventId,
            questionId: +req.params.questionId,
            userId:      <number>user.id,
            value:       value >= 0 ? 1 : -1
        }

        const question: Question|undefined = await eventService.createQuestionVote(vote);

        if(!question){
            return http.serverError(res, new Error('Error creating question vote'));
        }
        
        res.json(question);

        const clientSlug:   string       = <string>client.slug,
              channel:      string       = `client::${ clientSlug };events::${ question.eventId }`,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(channel, MessageType.QUESTION_UPDATED, question);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

export default router;