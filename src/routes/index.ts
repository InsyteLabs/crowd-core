'use strict';

import { Router } from 'express';

export const router = Router();

import authRouter   from './Auth';
import clientRouter from './Client';
import userRouter   from './User';
import eventRouter  from './Event';
import logRouter    from './Log';

router.use(logRouter);
router.use(authRouter);

// Routers that require auth
router.use(clientRouter);
router.use(userRouter);
router.use(eventRouter);