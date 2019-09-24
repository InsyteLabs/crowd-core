'use strict';

import { clientService, userService } from './services';
import { Client, User }               from './models';

(async () => {
    /*
        ============
        CREATE ROLES
        ============
    */
    const roles = await userService.getRoles();

    if(!roles.length){
        console.log('DB has no roles, creating...');

        const rolesToCreate = [
            { name: 'admin'     },
            { name: 'sub-admin' },
            { name: 'moderator' }
        ];

        for(let i = 0, len = rolesToCreate.length; i < len; i++){
            const role = rolesToCreate[i];

            console.log(`Creating role ${ role.name }`);

            await userService.createRole(role);
        }

        console.log('Done creating roles');
        console.log(new Array(25).fill('-').join(''));
    }



    /*
        ============
        CREATE USERS
        ============
    */
    const users = await userService.getUsers();

    if(!users.length){
        console.log('DB has no users, creating...');

        const usersToCreate: User[] = [
            {
                clientId:  null,
                firstName: 'Bryce',
                lastName:  'Jech',
                email:     'bryce@brycejech.com',
                username:  'PyGuy',
                password:  'myFakePa$$wor^d',
                roles:     []
            },
            {
                clientId:  null,
                firstName: 'Laryn',
                lastName:  'Jech',
                email:     'laryn_burns@yahoo.com',
                username:  'Laryolyn',
                password:  'aSuperF4k$pass',
                roles:     []
            },
            {
                clientId:  null,
                firstName: 'Tracey',
                lastName:  'Jech',
                email:     'traceyjech@gmail.com',
                username:  'Gammy',
                password:  'theM0$stSecur%epass4Eva',
                roles:     []
            }
        ];

        
        for(let i = 0, len = usersToCreate.length; i < len; i++){
            const user = usersToCreate[i];

            console.log(`Creating user ${ user.username }`);

            await userService.createUser(user);
        }

        console.log('Done creating users');
        console.log(new Array(25).fill('-').join(''));
    }


    /*
        ============
        CREATE TYPES
        ============
    */
    const types = await clientService.getTypes();

    if(!types.length){
        console.log('DB has no account types, creating...');

        const typesToCreate = [
            { name: 'demo'  },
            { name: 'free'  },
            { name: 'pro'   },
            { name: 'elite' }
        ];

        for(let i = 0, len = typesToCreate.length; i < len; i++){
            const type = typesToCreate[i];

            console.log(`Creating type "${ type.name }"`);
            
            await clientService.createType(type);
        }

        console.log('Done creating types');
        console.log(new Array(25).fill('-').join(''));
    }



    /*
        ==============
        CREATE CLIENTS
        ==============
    */
    const clients = await clientService.getClients();

    if(!clients.length){

        console.log('DB has no clients, creating...');

        const users = await userService.getUsers();

        if(!users.length){
            throw new Error('No users to assign clients to');
        }

        const owner = users[0];

        const clientsToCreate: Client[] = [
            {
                name:    'InsyteLabs',
                slug:    'insyte-labs',
                ownerId: owner.id as number,
                types:   []
            }
        ];

        for(let i = 0, len = clientsToCreate.length; i < len; i++){
            const client = clientsToCreate[i];

            console.log(`Creating client ${ client.name }`);

            await clientService.createClient(client);
        }

        console.log('Done creating clients');
        console.log(new Array(25).fill('-').join(''));
    }
    
})();