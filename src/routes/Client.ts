'use strict';

import { Router }        from 'express';
import { clientService } from '../services';

const router = Router();

router.get('/clients', async (req, res, next) => {
    const clients = await clientService.getClients();
    
    return res.json(clients);
});

export default router;