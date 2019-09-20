'use strict';

import { userService } from './services';
import { User }        from './models';
import { db }          from './db';

(async () => {

    try{
        const users = await userService.getUsers();

        console.log(users);
    }
    catch(e){
        console.log(e);
    }
    finally{
        db.disconnect().then(() => {
            console.log('Disconnected');
            process.exit();
        });
    }

})();