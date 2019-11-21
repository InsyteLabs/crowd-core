'use strict';

import { Router, Request, Response, NextFunction } from 'express';
import { http } from '../utilities';
import { logService } from '../services';

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

export default router;