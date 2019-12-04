'use strict';

import { Router } from 'express';

import authRouter   from './Auth';
import clientRouter from './Client';
import logRouter    from './Log';

export const router = Router();

router.use(logRouter);
router.use(authRouter);

// Routers that require auth
router.use(clientRouter);