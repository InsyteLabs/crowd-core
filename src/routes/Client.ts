'use strict';

import { Router }                    from 'express';
import { getCurrentUser, getClient } from '../middleware';
import { http }                      from '../utilities';
import { SocketServer }              from '../web-sockets';
import { Event }                     from '../models';
import { MessageType }               from '../constants';

import {
    clientService,
    eventService,
    userService,
    logService
} from '../services';

const router = Router();

router.use(getCurrentUser);

// Log the request method, url, and identified user to the console
router.use((req, res, next) => {
    const fullUrl: string = req.protocol + '://' + req.get('host') + req.originalUrl;

    if(req.method.toLowerCase() !== 'options'){
        console.log(`${ req.method.toUpperCase() } ${ fullUrl }: ${ res.locals.user ? res.locals.user.username : 'UNKNOWN' }`);
    }

    next();
});


/*
    =======
    CLIENTS
    =======
*/
router.get('/clients', async (req, res, next) => {
    try{
        const clients = await clientService.getClients();
        
        return res.json(clients);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.get('/clients/:id', async (req, res, next) => {
    try{
        const client = await clientService.getClient(+req.params.id);
        
        return res.json(client);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.get('/clients/slug/:slug', async (req, res, next) => {
    if(!(res.locals.user && res.locals.user.id)) return http.unauthorized(res, 'Unauthorized');

    try{
        const client = await clientService.getClientBySlug(req.params.slug);

        if(!(client && client.id)) return http.notFound(res);

        return res.json(client);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.post('/clients', async (req, res, next) => {
    try{
        const client = await clientService.createClient(req.body);

        return res.json(client);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.put('/clients/:id', async (req, res, next) => {
    try{
        const client = await clientService.updateClient(req.body);

        return res.json(client);
    }
    catch(e){
        return http.serverError(res, e);
    }
});


/*
    ============
    CLIENT USERS
    ============
*/
router.get('/clients/:id/users', async (req, res, next) => {
    const { id } = req.params;

    try{
        const users = await userService.getUsersByClient(+id);

        return res.json(users);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.post('/clients/:clientId/users', getClient, async (req, res, next) => {
    try{
        const user = await userService.createUser(req.body);

        res.json(user);

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, MessageType.USER_CREATED, user);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.put('/clients/:clientId/users/:userId', getClient, async (req, res, next) => {
    try{
        const user = await userService.updateUser(req.body);

        res.json(user);

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, MessageType.USER_UPDATED, user);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.delete('/clients/:clientId/users/:userId', getClient, async (req, res, next) => {
    try{
        const user = await userService.deleteUser(+req.params.userId);

        res.json(user);

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, MessageType.USER_DELETED, user);
    }
    catch(e){
        return http.serverError(res, e);
    }
});


/*
    =============
    CLIENT EVENTS
    =============
*/
router.get('/clients/:id/events', async (req, res, next) => {
    try{
        const events = await eventService.getClientEvents(+req.params.id);

        return res.json(events);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.get('/clients/:clientId/events/:slug', getClient, async (req, res, next) => {
    const { clientId, slug } = req.params;
    try{
        const event: Event|undefined = await eventService.getClientEventBySlug(+clientId, slug);

        if(event){
            res.json(event);

            // Log that a user viewed the event
            const clientId: number = res.locals.client.id,
                  userId:   number = res.locals.user.id,
                  eventId:  number = (<number>(<Event>(event)).id);

            return logService.createEventView(clientId, userId, eventId);
        }
        return http.notFound(res);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.post('/clients/:clientId/events', getClient, async (req, res, next) => {
    try{
        const event = await eventService.createEvent(req.body);

        res.json(event);

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, MessageType.EVENT_CREATED, event);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.put('/clients/:clientId/events/:eventId', getClient, async (req, res, next) => {
    try{
        const event: Event|undefined = await eventService.updateEvent(req.body);

        if(event){
            res.json(event);

            const clientSlug:   string       = res.locals.client.slug,
                  socketServer: SocketServer = res.locals.socketServer;

            return socketServer.messageClients(clientSlug, MessageType.EVENT_UPDATED, event);
        }

        http.notFound(res);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.delete('/clients/:clientId/events/:eventId', getClient, async (req, res, next) => {
    try{
        const event = await eventService.deleteEvent(+req.params.eventId);

        res.json(event);

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, MessageType.EVENT_DELETED, event);
    }
    catch(e){
        return http.serverError(res, e);
    }
});


/*
    ============================
    CLIENT EVENT QUESTION ROUTES
    ============================
*/
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


/*
    ==================================
    CLIENT EVENT QUESTION VOTE METHODS
    ==================================
*/
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


/*
    =========================
    CLIENT EVENT CHAT METHODS
    =========================
*/
router.get('/clients/:clientId/events/:eventId/chat', getClient, async (req, res, next) => {
    try{
        const messages = await eventService.getEventMessages(+req.params.eventId);

        res.json(messages);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.post('/clients/:clientId/events/:eventId/chat', getClient, async (req, res, next) => {
    try{
        const newMessage = await eventService.createEventMessage(req.body);

        res.json(newMessage);

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, MessageType.MESSAGE_CREATED, newMessage);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.put('/clients/:clientId/events/:eventId/chat/:messageId', getClient, async (req, res, next) => {
    try{
        const updatedMessage = await eventService.updateEventMessage(req.body);

        res.json(updatedMessage);

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, MessageType.MESSAGE_UPDATED, updatedMessage);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.delete('/clients/:clientId/events/:eventId/chat/:messageId', getClient, async (req, res, next) => {
    try{
        const deletedMessage = await eventService.deleteEventMessage(+req.params.messageId);

        res.json(deletedMessage);

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, MessageType.MESSAGE_DELETED, deletedMessage);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

export default router;