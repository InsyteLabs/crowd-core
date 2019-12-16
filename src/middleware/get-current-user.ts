'use strict';

import { Request, Response, NextFunction } from 'express';
import { userService, tokenService }       from '../services';
import { User }                            from '../models';
import { IWebToken }                       from '../interfaces';
import { http }                            from '../utilities';

export async function getCurrentUser(req: Request, res: Response, next: NextFunction){
    if(req.method === 'OPTIONS') return next();

    let userToken: IWebToken;
    try{
        userToken = await tokenService.validateFromAuthHeader(
            req.headers['authorization'] || ''
        );

        if(!(userToken.data && userToken.data.id)){
            return http.unauthorized(res);
        }
    }
    catch(e){
        console.error(`Invalid token received: ${ e.message }`);

        return http.unauthorized(res);
    }

    try{
        const user: User|undefined = await userService.getUser(userToken.data.id);

        if(!user){
            return http.unauthorized(res, 'Token valid, user not found. Maybe the user was deleted?');
        }

        if(user.isDisabled){
            return http.forbidden(res);
        }

        res.locals.user = user;
    }
    catch(e){
        res.locals.user = null;

        return http.serverError(res, e);
    }

    next();
}