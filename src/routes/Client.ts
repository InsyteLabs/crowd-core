'use strict';

import { Router } from 'express';

import { clientService }           from '../services';
import { http, slugify }           from '../utilities';
import { IClientPost, IClientPut } from '../interfaces';

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
        const client: IClientPost = {
            ownerId: req.body.ownerId,
            typeId:  req.body.typeId,
            name:    req.body.name,
            slug:    req.body.slug || slugify(req.body.name)
        }
        
        const newClient = await clientService.createClient(client);

        return res.json(newClient);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.put('/clients/:id', async (req, res, next) => {
    try{
        const client: IClientPut = {
            id:               +req.params.id,
            name:              req.body.name,
            slug:              req.body.slug || slugify(req.body.name),
            ownerId:           req.body.ownerId,
            typeId:            req.body.typeId,
            isDisabled:      !!req.body.isDisabled,
            disabledComment:   req.body.disabledComment
        }


        const updatedClient = await clientService.updateClient(client);

        return res.json(updatedClient);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

export default router;