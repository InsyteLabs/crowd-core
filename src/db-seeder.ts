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
                lastLogin: null,
                roles:     ['admin']
            },
            {
                clientId:  null,
                firstName: 'Laryn',
                lastName:  'Jech',
                email:     'laryn_burns@yahoo.com',
                username:  'Laryolyn',
                password:  'aSuperF4k$pass',
                lastLogin: null,
                roles:     ['sub-admin', 'moderator']
            },
            {
                clientId:  null,
                firstName: 'Tracey',
                lastName:  'Jech',
                email:     'traceyjech@gmail.com',
                username:  'Gammy',
                password:  'theM0$stSecur%epass4Eva',
                lastLogin: null,
                roles:     ['sub-admin', 'moderator']
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
    const types = await clientService.getClientTypes();

    if(!types.length){
        console.log('DB has no account types, creating...');

        const typesToCreate = [
            { id: 0, name: 'Demo',     maxEvents: 1,   maxEventViewers: 10   },
            { id: 0, name: 'Standard', maxEvents: 10,  maxEventViewers: 100  },
            { id: 0, name: 'Pro',      maxEvents: 25,  maxEventViewers: 250  },
            { id: 0, name: 'Elite',    maxEvents: 100, maxEventViewers: 1000 }
        ];

        for(let i = 0, len = typesToCreate.length; i < len; i++){
            const type = typesToCreate[i];

            console.log(`Creating type "${ type.name }"`);
            
            await clientService.createClientType(type);
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
                type: {
                    id: 2,
                    name: 'Standard',
                    maxEvents: 10,
                    maxEventViewers: 100
                }
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