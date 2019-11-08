'use strict';

import { Router }         from 'express';
import { userService }    from '../services';
import { http }           from '../utilities';

const router = Router();

// router.use(getCurrentUser);

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