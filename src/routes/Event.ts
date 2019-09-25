'use strict';

import { Router }       from 'express';
import { eventService } from '../services';

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
        return res.status(500).json({
            message: 'Server Error'
        });
    }
});

router.get('/events/:id', async (req, res, next) => {
    try{
        const event = await eventService.getEvent(+req.params.id);

        return res.json(event);
    }
    catch(e){
        return res.status(500).json({
            message: 'Server Error'
        });
    }
});

router.post('/events', async (req, res, next) => {
    try{
        const event = await eventService.createEvent(req.body);

        return res.json(event);
    }
    catch(e){
        return res.status(500).json({
            message: 'Server Error'
        });
    }
});

router.put('/events/:id', async (req, res, next) => {
    try{
        const event = await eventService.updateEvent(req.body);

        return res.json(event);
    }
    catch(e){
        return res.status(500).json({
            message: 'Server Error'
        });
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
        return res.status(500).json({
            message: 'Server Error'
        });
    }
});

router.post('/events/:id/questions', async (req, res, next) => {
    try{
        const question = await eventService.createQuestion(req.body);

        return res.json(question);
    }
    catch(e){
        return res.status(500).json({
            message: 'Server Error'
        });
    }
});



export default router;