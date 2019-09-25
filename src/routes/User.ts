'use strict';

import { Router }      from 'express';
import { userService } from '../services';

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
        return res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/users/:id/password', async (req, res, next) => {
    try{
        const user = await userService.getUser(+req.params.id);

        if(!(user && user.id)){
            return res.status(404).json({
                message: 'Not Found'
            });
        }

        const { password, newPassword } = req.body;

        if(!(password && newPassword)){
            return res.status(400).json({ message: '"password" and "newPassword" fields required' });
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
})

export default router;