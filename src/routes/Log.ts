'use strict';

import { Router, Request, Response, NextFunction } from 'express';

import { logService } from '../services';
import { http }       from '../utilities';

const router = Router();

router.get('/log/auth', async (req: Request, res: Response, next: NextFunction) => {
    try{
        const log = await logService.getAuthLog();

        return res.json(log);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.get('/log/auth/client/:clientId', async (req: Request, res: Response, next: NextFunction) => {
    try{
        const log = await logService.getClientAuthLog(+req.params.clientId);

        return res.json(log);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.get('/log/auth/user/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try{
        const log = await logService.getUserAuthLog(+req.params.userId);

        return res.json(log);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.get('/log/event-view/:eventId', async (req: Request, res: Response, next: NextFunction) => {
    const eventId: number = +req.params.eventId || 0;

    const views = await logService.getEventViews(eventId);

    res.json(views);
});

export default router;