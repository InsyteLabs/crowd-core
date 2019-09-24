'use strict';

import { Router } from 'express';

export const router = Router();

import clientRouter from './Client';
import userRouter   from './User';

router.use(clientRouter);
router.use(userRouter);