'use strict';

const userService = require('./services/user-service');

(async () => {

    try{
        const bryce = await userService.getUser(1);

        console.log(bryce);
    }
    catch(e){
        console.log(e);
    }

})();