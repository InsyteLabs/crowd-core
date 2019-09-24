'use strict';

import { Router }      from 'express';
import { userService } from '../services';

const router = Router();

router.get('/users', async (req, res, next) => {
    const users = await userService.getUsers();

    return res.json(users);
});

export default router;