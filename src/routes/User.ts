'use strict';

import { Router }         from 'express';
import * as jwt           from 'jsonwebtoken';
import conf               from '../conf';
import { SECONDS_IN_DAY } from '../constants';
import { userService }    from '../services';
import { sendError }      from '../utilities';

const router = Router();

router.get('/users', async (req, res, next) => {
    try{
        const users = await userService.getUsers();

        return res.json(users);
    }
    catch(e){
        return res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/users/:id', async (req, res, next) => {
    try{
        const user = await userService.getUser(+req.params.id);

        return res.json(user);
    }
    catch(e){
        return res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/users', async (req, res, next) => {
    try{
        const user = await userService.createUser(req.body);

        return res.json(user);
    }
    catch(e){
        return sendError(res, e);
    }
});

router.post('/authenticate', async (req, res, next) => {
    const { username, password } = req.body;

    if(!(username && password)){
        return res.status(400).json({
            message: 'User and password fields required'
        });
    }

    try{
        const user  = await userService.getUserByUsername(username),
              valid = await userService.checkUserPassword(username, password);

        if(!valid){
            return res.status(400).json({
                message: 'Incorrect username/password'
            });
        }

        const token = await jwt.sign({
            issuer: 'CROWDCORE_API',
            exp: Math.floor(Date.now() / 1000) + (SECONDS_IN_DAY),
            data: user
        }, conf.SECRET);
        
        return res.json({ token });
    }
    catch(e){
        return sendError(res, e);
    }
});

router.post('/users/:id/password', async (req, res, next) => {
    try{
        const { password, newPassword } = req.body;

        if(!(password && newPassword)){
            return res.status(400).json({ message: '"password" and "newPassword" fields required' });
        }

        const user = await userService.getUser(+req.params.id);

        if(!(user && user.id)){
            return res.status(404).json({
                message: 'Not Found'
            });
        }

        const valid = await userService.checkUserPassword(user.username, password);

        if(!valid){
            return res.status(400).json({ message: 'Incorrect password' });
        }

        try{
            const updated = await userService.setUserPassword(user.id, newPassword);

            return res.json(updated);
        }
        catch(e){
            return res.status(500).json({
                message: 'Server Error'
            });
        }

    }
    catch(e){
        return res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/users/:id', async (req, res, next) => {
    try{
        const user = await userService.updateUser(req.body);

        return res.json(user);
    }
    catch(e){
        return res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/users/:id/disable', async (req, res, next) => {
    try{
        const user = await userService.disableUser(+req.params.id, 'Disabled via API');

        return res.json(user);
    }
    catch(e){
        return res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/users/:id/enable', async (req, res, next) => {
    try{
        const user = await userService.enableUser(+req.params.id);

        return res.json(user);
    }
    catch(e){
        return res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/roles', async (req, res, next) => {
    try{
        const roles = await userService.getRoles();

        return res.json(roles);
    }
    catch(e){
        return res.json({
            message: 'Server Error'
        });
    }
});

export default router;