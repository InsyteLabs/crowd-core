'use strict';

import { Router }       from 'express';
import { eventService } from '../services';
import { sendError }    from '../utilities';

const router = Router();

/*
    ============
    EVENT ROUTES
    ============
*/
router.get('/events', async (req, res, next) => {
    try{
        const events = await eventService.getEvents();

        return res.json(events);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.get('/events/:id', async (req, res, next) => {
    try{
        const event = await eventService.getEvent(+req.params.id);

        return res.json(event);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.post('/events', async (req, res, next) => {
    try{
        const event = await eventService.createEvent(req.body);

        return res.json(event);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.put('/events/:id', async (req, res, next) => {
    try{
        const event = await eventService.updateEvent(req.body);

        return res.json(event);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.delete('/events/:id', async (req, res, next) => {
    try{
        const event = await eventService.deleteEvent(+req.params.id);

        return res.json(event);
    }
    catch(e){
        return sendError(res, e);
    }
});


/*
    =====================
    EVENT QUESTION ROUTES
    =====================
*/
router.get('/events/:id/questions', async (req, res, next) => {
    try{
        const questions = await eventService.getEventQuestions(+req.params.id);

        return res.json(questions);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.get('/events/:id/questions/:questionId', async (req, res, next) => {
    try{
        const question = await eventService.getQuestion(+req.params.questionId);

        return res.json(question);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.post('/events/:id/questions', async (req, res, next) => {
    try{
        const question = await eventService.createQuestion(req.body);

        return res.json(question);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.put('/events/:id/questions/:questionId', async (req, res, next) => {
    try{
        const question = await eventService.updateQuestion(req.body);

        return res.json(question);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.delete('/events/:id/questions/:questionId', async (req, res, next) => {
    try{
        const deleted = await eventService.deleteQuestion(+req.params.questionId);

        return res.json({ deleted });
    }
    catch(e){
        return sendError(res, e);
    }
});


/*
    ======================
    QUESTION VOTING ROUTES
    ======================
*/
router.get('/events/:id/questions/:questionId/votes', async (req, res, next) => {
    try{
        const { id, questionId } = req.params;

        const score = await eventService.getQuestionScore(+id, +questionId);

        return res.json(score);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.post('/events/:id/questions/:id/votes', async (req, res, next) => {
    try{
        const vote = await eventService.createQuestionVote(req.body);

        return res.json(vote);
    }
    catch(e){
        return sendError(res, e);
    }
});



/*
    ====================
    EVENT MESSAGE ROUTES
    ====================
*/
router.get('/events/:id/messages', async (req, res, next) => {
    try{
        const messages = await eventService.getEventMessages(+req.params.id);

        return res.json(messages);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.post('/events/:id/messages', async (req, res, next) => {
    try{
        const message = await eventService.createEventMessage(req.body);

        return res.json(message);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.put('/events/:id/messages/:messageId', async (req, res, next) => {
    try{
        const message = await eventService.updateEventMessage(req.body);

        return res.json(message);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.delete('/events/:id/messages/:messageId', async (req, res, next) => {
    try{
        const deleted = await eventService.deleteEventMessage(+req.params.messageId);

        return res.json({ success: deleted });
    }
    catch(e){
        return sendError(res, e);
    }
});



export default router;