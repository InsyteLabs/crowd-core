'use strict';

import * as jwt           from 'jsonwebtoken';
import { User }           from '../models';
import { IWebToken }      from '../interfaces';
import { SECONDS_IN_DAY } from '../constants';
import conf               from '../conf';

class TokenService{
    private _issuer: string = 'CROWDCORE_API';

    async getToken(user: User): Promise<string>{
        const token: string = await jwt.sign({
            issuer: this._issuer,
            exp:    this.getExpiry(),
            data:   user
        }, conf.SECRET);

        return token;
    }

    async validateToken(token: string): Promise<IWebToken>{
        try{
            const webToken= <IWebToken>await jwt.verify(token, conf.SECRET);

            return webToken;
        }
        catch(e){
            throw e;
        }
    }

    async validateFromAuthHeader(authHeader: string = ''): Promise<IWebToken>{
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            throw new Error('Invalid authorization header');
        }

        const tokenString = authHeader.replace(/^Bearer\s/, '');

        return this.validateToken(tokenString);
    }


    getExpiry(): number{
        return Math.floor(Date.now() / 1000) + SECONDS_IN_DAY;
    }
}

export const tokenService = new TokenService();