'use strict';

import { db }                         from './db';
import { userService, clientService } from './services';
import { User, Client }               from './models';

(async () => {

    try{
        
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