'use strict';

import { UserService } from './services';

const userService = new UserService();

(async () => {

    try{
        const users = await userService.getUsers();
        console.log(users);

        const bryce = await userService.getUser(1);
        console.log(bryce);
    }
    catch(e){
        console.log(e);
    }

})();