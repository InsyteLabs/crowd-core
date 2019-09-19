'use strict';

import { UserService } from './services';

const userService = new UserService();

(async () => {

    try{
        const bryce = await userService.getUser(1);

        console.log(bryce);
    }
    catch(e){
        console.log(e);
    }

})();