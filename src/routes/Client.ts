'use strict';

import { Router }        from 'express';
import { clientService } from '../services';

const router = Router();

router.get('/clients', async (req, res, next) => {
    const clients = await clientService.getClients();
    
    return res.json(clients);
});

router.get('/clients/:id', async (req, res, next) => {
    const client = await clientService.getClient(+req.params.id);

    return res.json(client);
});

router.post('/clients', async (req, res, next) => {
    try{
        const client = await clientService.createClient(req.body);

        return res.json(client);
    }
    catch(e){
        return res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/clients/:id', async (req, res, next) => {
    try{
        console.log(req.body);
        const client = await clientService.updateClient(req.body);

        return res.json(client);
    }
    catch(e){
        return res.status(500).json({ message: 'Server Error' });
    }
});

export default router;