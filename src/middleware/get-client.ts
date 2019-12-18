'use strict';

import { Request, Response, NextFunction } from 'express';
import { clientService }                   from '../services';
import { Client, User }                    from '../models';
import { http }                            from '../utilities';

export async function getClient(req: Request, res: Response, next: NextFunction){
    if(req.method === 'OPTIONS') return next();

    const user: User|null = res.locals.user;

    if(!(user && user.clientId)){
        return http.unauthorized(res);
    }

    const client: Client|undefined = await clientService.getClient(user.clientId);

    if(!client){
        return http.notFound(res);
    }

    res.locals.client = client;

    next();
}