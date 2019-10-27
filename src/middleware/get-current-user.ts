'use strict';

import { Request, Response, NextFunction } from 'express';
import * as jwt                            from 'jsonwebtoken';
import { userService }                     from '../services';
import conf                                from '../conf';

export async function getCurrentUser(req: Request, res: Response, next: NextFunction){
    res.locals.user = null;

    const authHeader: string = req.headers['authorization'] || '';

    if(!(authHeader && authHeader.startsWith('Bearer '))) return next();

    const token = authHeader.replace(/^Bearer\s/, '');

    let validToken: any;
    try{
        validToken = await jwt.verify(token, conf.SECRET);
    }
    catch(e){
        console.error('Invalid token received');
        console.error(e);
        
        return next();
    }

    if(!(validToken && validToken.data && validToken.data.id)) return next();

    try{
        res.locals.user = await userService.getUser(validToken.data.id);
    }
    catch(e){
        console.error(`Error loading user from token data`);
        console.error(e);
    }
    
    next();
}