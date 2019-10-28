'use strict';

import { Router }                                   from 'express';
import { sendError }                                from '../utilities';
import { getCurrentUser, getClient }                from '../middleware';
import { SocketServer }                             from '../web-sockets';
import { clientService, eventService, userService } from '../services';

const router = Router();

router.use(getCurrentUser);


/*
    =======
    CLIENTS
    =======
*/
router.get('/clients', async (req, res, next) => {
    const clients = await clientService.getClients();
    
    return res.json(clients);
});

router.get('/clients/:id', async (req, res, next) => {
    const client = await clientService.getClient(+req.params.id);

    return res.json(client);
});

router.get('/clients/slug/:slug', async (req, res, next) => {
    try{
        const client = await clientService.getClientBySlug(req.params.slug);

        return res.json(client);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.post('/clients', async (req, res, next) => {
    try{
        const client = await clientService.createClient(req.body);

        return res.json(client);
    }
    catch(e){
        return res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/clients/:id', async (req, res, next) => {
    try{
        const client = await clientService.updateClient(req.body);

        return res.json(client);
    }
    catch(e){
        return res.status(500).json({ message: 'Server Error' });
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
        return sendError(res, e);
    }
});

router.post('/clients/:clientId/users', getClient, async (req, res, next) => {
    if(!res.locals.client){
        return sendError(res, new Error('Client account not identified'));
    }
    
    try{
        const user = await userService.createUser(req.body);

        res.json(user);

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, 'user-created', user);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.put('/clients/:clientId/users/:userId', getClient, async (req, res, next) => {
    if(!res.locals.client){
        return sendError(res, new Error('Client account not identified'));
    }

    try{
        const user = await userService.updateUser(req.body);

        res.json(user);

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, 'user-updated', user);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.delete('/clients/:clientId/users/:userId', getClient, async (req, res, next) => {
    if(!res.locals.client){
        return sendError(res, new Error('Client account not identified'));
    }

    try{
        const user = await userService.deleteUser(+req.params.userId);

        res.json(user);

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, 'user-deleted', user);
    }
    catch(e){
        return sendError(res, e);
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
        return sendError(res, e);
    }
});

router.get('/clients/:id/events/:slug', async (req, res, next) => {
    const { id, slug } = req.params;
    try{
        const event = await eventService.getClientEventBySlug(+id, slug);

        return res.json(event);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.post('/clients/:clientId/events', getClient, async (req, res, next) => {
    if(!res.locals.client){
        return sendError(res, new Error('Client account not identified'));
    }

    try{
        const event = await eventService.createEvent(req.body);

        res.json(event);

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, 'event-created', event);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.put('/clients/:clientId/events/:eventId', getClient, async (req, res, next) => {
    if(!res.locals.client){
        return sendError(res, new Error('Client account not identified'));
    }

    try{
        const event = await eventService.updateEvent(req.body);

        res.json(event);

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, 'event-updated', event);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.delete('/clients/:clientId/events/:eventId', getClient, async (req, res, next) => {
    if(!res.locals.client){
        return sendError(res, new Error('Client account not identified'));
    }

    try{
        const event = await eventService.deleteEvent(+req.params.eventId);

        res.json(event);

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, 'event-deleted', event);
    }
    catch(e){
        return sendError(res, e);
    }
});


/*
    ============================
    CLIENT EVENT QUESTION ROUTES
    ============================
*/
router.get('/clients/:clientId/events/:eventId/questions', async (req, res, next) => {
    try{
        const questions = await eventService.getEventQuestions(+req.params.eventId);

        return res.json(questions);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.post('/clients/:clientId/events/:eventId/questions', getClient, async (req, res, next) => {
    if(!res.locals.client){
        return sendError(res, new Error('Client account not identified'));
    }

    try{
        const question = await eventService.createQuestion(req.body);

        res.json(question);

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, 'question-created', question);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.put('/clients/:clientId/events/:eventId/questions/:questionId', getClient, async (req, res, next) => {
    if(!res.locals.client){
        return sendError(res, new Error('Client account not identified'));
    }

    try{
        const question = await eventService.updateQuestion(req.body);

        res.json(question);

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, 'question-updated', question);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.delete('/clients/:clientId/events/:eventId/questions/:questionId', getClient, async (req, res, next) => {
    if(!res.locals.client){
        return sendError(res, new Error('Client account not identified'));
    }

    try{
        const deleted = await eventService.deleteQuestion(+req.params.questionId);

        res.json({ deleted });

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, 'question-deleted', deleted);
    }
    catch(e){
        return sendError(res, e);
    }
});


/*
    ==================================
    CLIENT EVENT QUESTION VOTE METHODS
    ==================================
*/
router.get('/clients/:clientId/events/:eventId/questions/:questionId/votes', async (req, res, next) => {
    try{
        const { eventId, questionId } = req.params;

        const score = await eventService.getQuestionScore(+eventId, +questionId);

        return res.json(score);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.post('/clients/:clientId/events/:eventId/questions/:questionId/votes', getClient, async (req, res, next) => {
    if(!res.locals.client){
        return sendError(res, new Error('Client account not identified'));
    }

    try{
        const vote = await eventService.createQuestionVote(req.body);
        
        res.json(vote);

        const clientSlug:   string       = res.locals.client.slug,
              socketServer: SocketServer = res.locals.socketServer;

        socketServer.messageClients(clientSlug, 'vote-created', vote);
    }
    catch(e){
        return sendError(res, e);
    }
});

export default router;