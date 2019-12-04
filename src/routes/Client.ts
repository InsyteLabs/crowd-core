'use strict';

import { Router } from 'express';

import { clientService } from '../services';
import { http }          from '../utilities';

const router = Router();

router.get('/clients', async (req, res, next) => {
    try{
        const clients = await clientService.getClients();
        
        return res.json(clients);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.get('/clients/:id', async (req, res, next) => {
    try{
        const client = await clientService.getClient(+req.params.id);
        
        return res.json(client);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.get('/clients/slug/:slug', async (req, res, next) => {
    if(!(res.locals.user && res.locals.user.id)) return http.unauthorized(res, 'Unauthorized');

    try{
        const client = await clientService.getClientBySlug(req.params.slug);

        if(!(client && client.id)) return http.notFound(res);

        return res.json(client);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.post('/clients', async (req, res, next) => {
    try{
        const client = await clientService.createClient(req.body);

        return res.json(client);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.put('/clients/:id', async (req, res, next) => {
    try{
        const client = await clientService.updateClient(req.body);

        return res.json(client);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

export default router;