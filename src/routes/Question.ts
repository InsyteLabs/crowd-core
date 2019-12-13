'use strict';

import { Router } from 'express';

import { eventService } from '../services';
import { getClient }    from '../middleware';
import { http }         from '../utilities';
import { SocketServer } from '../socket-server';
import { MessageType }  from '../constants';

const router = Router();

router.get('/events/:id/questions', async (req, res, next) => {
    /*
        TODO
        ----

        Make this route match the existing URL scheme
    */
    try{
        const questions = await eventService.getEventQuestions(res.locals.user.id, +req.params.id);

        return res.json(questions);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.get('/clients/:clientId/events/:eventId/questions', async (req, res, next) => {
    try{
        const questions = await eventService.getEventQuestions(res.locals.user.id, +req.params.eventId);

        return res.json(questions);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.post('/clients/:clientId/events/:eventId/questions', getClient, async (req, res, next) => {
    try{
        const question = await eventService.createQuestion(res.locals.user.id, req.body);

        if(!question){
            return http.serverError(res, new Error('Error creating new question'));
        }

        res.json(question);

        const clientSlug:   string       = res.locals.client.slug,
              channel:      string       = `client::${ clientSlug };events::${ question.eventId }`,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(channel, MessageType.QUESTION_CREATED, question);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.put('/clients/:clientId/events/:eventId/questions/:questionId', getClient, async (req, res, next) => {
    try{
        const question = await eventService.updateQuestion(res.locals.user.id, req.body);

        if(!question){
            return http.serverError(res, new Error('Error updating question'));
        }

        res.json(question);

        const clientSlug:   string       = res.locals.client.slug,
              channel:      string       = `client::${ clientSlug };events::${ question.eventId }`,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(channel, MessageType.QUESTION_UPDATED, question);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.delete('/clients/:clientId/events/:eventId/questions/:questionId', getClient, async (req, res, next) => {
    try{
        const deleted = await eventService.deleteQuestion(res.locals.user.id, +req.params.questionId);

        if(!deleted){
            return http.serverError(res, new Error('Error deleting question'));
        }

        res.json({ deleted });

        const clientSlug:   string       = res.locals.client.slug,
              channel:      string       = `client::${ clientSlug };events::${ deleted.eventId }`,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(channel, MessageType.QUESTION_DELETED, deleted);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.post('/clients/:clientId/events/:eventId/questions/:questionId/votes', getClient, async (req, res, next) => {
    try{
        const question = await eventService.createQuestionVote(res.locals.user.id, req.body);

        if(!question){
            return http.serverError(res, new Error('Error creating question vote'));
        }
        
        res.json(question);

        const clientSlug:   string       = res.locals.client.slug,
              channel:      string       = `client::${ clientSlug };events::${ question.eventId }`,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(channel, MessageType.QUESTION_UPDATED, question);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

export default router;