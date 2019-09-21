'use strict';

import { db }      from '../db';
import { Client }  from '../models';
import { slugify } from '../utilities';

class ClientService{

    async getClients(): Promise<Client[]>{
        try{
            const clients = await db.q('get-clients');

            return clients.map((c: any) => new Client(c));
        }
        catch(e){
            console.error('Failed to get clients from database');
            console.error(e);
            return [];
        }
    }

    async getClient(id: number): Promise<Client>{
        try{
            const client = await db.q('get-client', [ id ]);

            return new Client(client);
        }
        catch(e){
            console.error(`Failed to get client of ID "${ id }"`);
            console.error(e);
            return new Client({});
        }
    }

    async createClient(client: Client): Promise<Client>{
        const args = [
            client.name,
            client.slug || slugify(client.name),
            client.ownerId
        ];

        try{
            const client = await db.q('create-client', args);

            return new Client(client);
        }
        catch(e){
            console.error('Error creating new client');
            console.error(e);

            return new Client({});
        }
    }

    async updateClient(client: Client): Promise<Client>{
        let curClient;
        try{
            curClient = await db.q('get-client', [ client.id ]);
        }
        catch(e){
            return Promise.reject('Failed to get client from database');
        }

        for(let prop in client){
            if(client[prop] !== undefined){
                curClient[prop] = client[prop];
            }
        }

        const args = [
            curClient.id,
            curClient.name,
            curClient.slug,
            curClient.ownerId,
            curClient.isDisabled,
            curClient.disabledComment
        ];

        try{
            const updated = await db.q('update-client', args);

            return new Client(updated);
        }
        catch(e){
            console.error(`Error updating client "${ client.name }"`);
            console.error(e);

            return Promise.reject(`Error updating client "${ client.name }"`);
        }
    }

    async disableClient(id: number, comment: string): Promise<Client>{
        let client;
        try{
            client = await this.getClient(id);
        }
        catch(e){
            return Promise.reject(e);
        }

        client.isDisabled      = true;
        client.disabledComment = comment;

        return this.updateClient(client);
    }

    async enableClient(id: number){
        let client;
        try{
            client = await this.getClient(id);
        }
        catch(e){
            return Promise.reject(e);
        }

        client.isDisabled      = false;
        client.disabledComment = null;

        return this.updateClient(client);
    }
}

export const clientService = new ClientService();