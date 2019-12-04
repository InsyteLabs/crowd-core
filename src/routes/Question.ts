'use strict';

import { Router } from 'express';

import { eventService } from '../services';
import { getClient }    from '../middleware';
import { http }         from '../utilities';
import { SocketServer } from '../web-sockets';
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

        res.json(question);

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, MessageType.QUESTION_CREATED, question);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.put('/clients/:clientId/events/:eventId/questions/:questionId', getClient, async (req, res, next) => {
    try{
        const question = await eventService.updateQuestion(res.locals.user.id, req.body);

        res.json(question);

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, MessageType.QUESTION_UPDATED, question);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.delete('/clients/:clientId/events/:eventId/questions/:questionId', getClient, async (req, res, next) => {
    try{
        const deleted = await eventService.deleteQuestion(res.locals.user.id, +req.params.questionId);

        res.json({ deleted });

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, MessageType.QUESTION_DELETED, deleted);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.post('/clients/:clientId/events/:eventId/questions/:questionId/votes', getClient, async (req, res, next) => {
    try{
        const question = await eventService.createQuestionVote(res.locals.user.id, req.body);
        
        res.json(question);

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, MessageType.QUESTION_UPDATED, question);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

export default router;