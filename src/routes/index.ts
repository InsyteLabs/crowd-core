'use strict';

import { Router } from 'express';

import logRouter      from './Log';
import authRouter     from './Auth';
import clientRouter   from './Client';
import userRouter     from './User';
import eventRouter    from './Event';
import questionRouter from './Question';
import chatRouter     from './Chat';

import { getCurrentUser } from '../middleware';

export const router = Router();

// Log the request method, url, and identified user to the console
router.use((req, res, next) => {
    const fullUrl: string = req.protocol + '://' + req.get('host') + req.originalUrl;

    if(req.method.toLowerCase() !== 'options'){
        console.log(`${ req.method.toUpperCase() } ${ fullUrl }: ${ res.locals.user ? res.locals.user.username : 'UNKNOWN' }`);
    }

    next();
});

router.use(logRouter);
router.use(authRouter);

router.use(getCurrentUser);

// Routers that require auth
router.use(clientRouter);
router.use(userRouter);
router.use(eventRouter);
router.use(questionRouter);
router.use(chatRouter);