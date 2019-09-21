'use strict';

import { db }                         from './db';
import { userService, clientService } from './services';
import { User, Client }               from './models';

(async () => {

    try{
        
        const client = await clientService.getClient(1);

        if(client && client.id){
            const disabled = await clientService.disableClient(client.id, 'Non-payment');
            console.log(disabled);
        }
        if(client && client.id){
            console.log('--------------');
            const enabled = await clientService.enableClient(client.id);
            console.log(enabled);
        }

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