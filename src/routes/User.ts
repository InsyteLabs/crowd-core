'use strict';

import { Router }         from 'express';
import * as jwt           from 'jsonwebtoken';
import conf               from '../conf';
import { SECONDS_IN_DAY } from '../constants';
import { userService }    from '../services';
import { http }           from '../utilities';
import { getCurrentUser } from '../middleware';

const router = Router();

router.use(getCurrentUser);

router.get('/users', async (req, res, next) => {
    try{
        const users = await userService.getUsers();

        return res.json(users);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.get('/users/:id', async (req, res, next) => {
    try{
        const user = await userService.getUser(+req.params.id);

        return res.json(user);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.post('/users', async (req, res, next) => {
    try{
        const user = await userService.createUser(req.body);

        return res.json(user);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.post('/authenticate', async (req, res, next) => {
    const { username, password } = req.body;

    if(!(username && password)){
        return http.clientError(res, 'User and password fields required');
    }

    try{
        const user  = await userService.getUserByUsername(username),
              valid = await userService.checkUserPassword(username, password);

        if(!valid){
            return http.unauthorized(res, 'Incorrect username/password');
        }

        const token = await jwt.sign({
            issuer: 'CROWDCORE_API',
            exp: Math.floor(Date.now() / 1000) + (SECONDS_IN_DAY),
            data: user
        }, conf.SECRET);
        
        return res.json({ token });
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.post('/authenticate/anonymous', async (req, res, next) => {
    const { username } = req.body;

    if(!username){
        return http.clientError(res, 'Username field required');
    }

    try{
        const user = await userService.getUserByUsername(username);

        const token = await jwt.sign({
            issuer: 'CROWDCORE_API',
            exp: Math.floor(Date.now() / 1000) + (SECONDS_IN_DAY),
            data: user
        }, conf.SECRET);

        return res.json({ token });
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.post('/users/:id/password', async (req, res, next) => {
    try{
        const { password, newPassword } = req.body;

        if(!(password && newPassword)){
            return http.clientError(res, '"password" and "newPassword" fields required')
        }

        const user = await userService.getUser(+req.params.id);

        if(!(user && user.id)){
            return http.notFound(res);
        }

        const valid = await userService.checkUserPassword(user.username, password);

        if(!valid){
            return http.unauthorized(res, 'Incorrect username/password');
        }

        try{
            const updated = await userService.setUserPassword(user.id, newPassword);

            return res.json(updated);
        }
        catch(e){
            return http.serverError(res, e);
        }

    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.put('/users/:id', async (req, res, next) => {
    try{
        const user = await userService.updateUser(req.body);

        return res.json(user);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.delete('/users/:id', async (req, res, next) => {
    try{
        const user = await userService.deleteUser(+req.params.id);

        return res.json(user);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.get('/users/:id/disable', async (req, res, next) => {
    try{
        const user = await userService.disableUser(+req.params.id, 'Disabled via API');

        return res.json(user);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.get('/users/:id/enable', async (req, res, next) => {
    try{
        const user = await userService.enableUser(+req.params.id);

        return res.json(user);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

router.get('/roles', async (req, res, next) => {
    try{
        const roles = await userService.getRoles();

        return res.json(roles);
    }
    catch(e){
        return http.serverError(res, e);
    }
});

export default router;