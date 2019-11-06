'use strict';

import { Request, Response, NextFunction } from 'express';
import * as jwt                            from 'jsonwebtoken';
import { userService }                     from '../services';
import conf                                from '../conf';
import { http }                            from '../utilities';

export async function getCurrentUser(req: Request, res: Response, next: NextFunction){
    if(req.method === 'OPTIONS') return next();

    res.locals.user = null;

    const authHeader: string = req.headers['authorization'] || '';

    if(!(authHeader && authHeader.startsWith('Bearer '))){
        return http.unauthorized(res);
    }

    const token = authHeader.replace(/^Bearer\s/, '');

    let validToken: any;
    try{
        validToken = await jwt.verify(token, conf.SECRET);
    }
    catch(e){
        console.error(`Invalid token received: ${ e.message }`);

        return http.unauthorized(res);
    }

    if(!(validToken && validToken.data && validToken.data.id)){
        return http.unauthorized(res);
    }

    try{
        res.locals.user = await userService.getUser(validToken.data.id);
    }
    catch(e){
        return http.notFound(res, 'Token valid, user not found. Maybe the user was deleted?');
    }
    
    next();
}