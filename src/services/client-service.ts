'use strict';

import { db }                       from '../db';
import { IDBClient, IDBClientType } from '../db/interfaces';
import { Client, ClientType }       from '../models';
import { slugify }                  from '../utilities';

class ClientService{

    /*
        ==============
        CLIENT METHODS
        ==============
    */
    async getClients(): Promise<Client[]>{
        try{
            const clients: IDBClient[] = await db.q('get-clients');

            return clients.map((c: any) => Client.fromDb(c));
        }
        catch(e){
            console.error('Failed to get clients from database');
            console.error(e.message);

            return [];
        }
    }

    async getClient(id: number): Promise<Client|undefined>{
        try{
            const client: IDBClient = await db.q('get-client', [ id ]);

            return client ? Client.fromDb(client) : undefined;
        }
        catch(e){
            console.error(`Failed to get client of ID "${ id }"`);
            console.error(e.message);
        }
    }

    async getClientBySlug(slug: string): Promise<Client|undefined>{
        try{
            const client: IDBClient = await db.q('get-client-by-slug', [ slug ]);

            return client ? Client.fromDb(client) : undefined;
        }
        catch(e){
            console.error(`Failed to get client of slug ${ slug }`);
            console.error(e.message);
        }
    }

    async createClient(newClient: Client): Promise<Client|undefined>{
        let client: IDBClient;
        try{
            client = await db.q('create-client', [
                newClient.name,
                newClient.slug || slugify(newClient.name),
                newClient.owner.id,
                newClient.type.id
            ]);
        }
        catch(e){
            console.error(`Error creating new client "${ newClient.name }"`);
            console.error(e.message);

            return;
        }

        return this.getClient(client.id);
    }

    async updateClient(client: Client): Promise<Client|undefined>{
        const curClient: Client|undefined = await this.getClient(<number>client.id);
        
        if(!curClient) return;

        client.name            !== undefined && (curClient.name            =   client.name);
        client.slug            !== undefined && (curClient.slug            =   client.slug);
        client.owner.id        !== undefined && (curClient.owner.id        =   client.owner.id);
        client.type.id         !== undefined && (curClient.type.id         =   client.type.id);
        client.isDisabled      !== undefined && (curClient.isDisabled      = !!client.isDisabled);
        client.disabledComment !== undefined && (curClient.disabledComment =   client.disabledComment);

        let updated: IDBClient|undefined;
        try{
            updated = await db.q('update-client', [
                curClient.id,
                curClient.name,
                curClient.slug,
                curClient.owner.id,
                curClient.type.id,
                curClient.isDisabled,
                curClient.disabledComment
            ]);

            if(!updated) return;
        }
        catch(e){
            console.error(`Error updating client "${ client.name }"`);
            console.error(e.message);

            return;
        }

        return this.getClient(updated.id);
    }


    /*
        ===================
        CLIENT TYPE METHODS
        ===================
    */
    async getClientTypes(): Promise<ClientType[]>{
        try{
            const types: IDBClientType[] = await db.q('get-client-types');

            return types && types.length ? types.map(t => ClientType.fromDb(t)) : [];
        }
        catch(e){
            console.error('Failed to get types from database');
            console.error(e.message);

            return [];
        }
    }

    async getClientType(id: number): Promise<ClientType|undefined>{
        try{
            const type: IDBClientType|undefined = await db.q('get-client-type', [ id ]);

            return type ? ClientType.fromDb(type) : undefined;
        }
        catch(e){
            console.error(`Failed to get type "${ id }" from database`);
            console.error(e.message);
        }
    }

    async createClientType(newType: ClientType): Promise<ClientType|undefined>{
        try{
            const type: IDBClientType = await db.q('create-client-type', [
                newType.name,
                newType.maxEvents,
                newType.maxEventViewers
            ]);

            return type ? ClientType.fromDb(type) : undefined;
        }
        catch(e){
            console.error(`Failed to create type "${ newType.name }"`);
            console.error(e.message);
        }
    }
    
    async updateClientType(type: ClientType): Promise<ClientType|undefined>{
        let curType: ClientType|undefined;
        try{
            curType = await this.getClientType(type.id);

            if(!curType) return;

            const updatedType: IDBClientType = await db.q('update-client-type', [
                curType.id,
                type.name,
                type.maxEvents,
                type.maxEventViewers
            ]);

            return this.getClientType(updatedType.id);
        }
        catch(e){
            console.error(`Error updating type of Id "${ type.id }"`);
            console.error(e.message);

            return;
        }
    }
}

export const clientService = new ClientService();