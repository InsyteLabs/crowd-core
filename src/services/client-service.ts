'use strict';

import { db }                       from '../db';
import { IDBClient, IDBClientType } from '../db/interfaces';

import { Client }  from '../models';
import { IType }   from '../interfaces';
import { slugify } from '../utilities';

/*
    TODO
    ----

    Join client types in the client queries as JSON to avoid excessive lookups
*/

class ClientService{

    /*
        ==============
        CLIENT METHODS
        ==============
    */
    async getClients(): Promise<Client[]>{
        try{
            const clients: IDBClient[] = await db.q('get-clients');

            for(let i = 0, len = clients.length; i < len; i++){
                const client = clients[i];

                const clientTypes = await this.getClientTypes(client.id);

                client.types = clientTypes.map(t => t.name);
            }

            return clients.map((c: any) => Client.from(c));
        }
        catch(e){
            console.error('Failed to get clients from database');
            console.error(e);

            return [];
        }
    }

    async getClient(id: number): Promise<Client|undefined>{
        try{
            const client: IDBClient = await db.q('get-client', [ id ]),
                  types             = await this.getClientTypes(id);
            
            client.types = types.map(t => t.name);

            return Client.from(client);
        }
        catch(e){
            console.error(`Failed to get client of ID "${ id }"`);
            console.error(e);
            
            return;
        }
    }

    async getClientBySlug(slug: string): Promise<Client|undefined>{
        try{
            const client: IDBClient = await db.q('get-client-by-slug', [ slug ]),
                  types             = await this.getClientTypes(client.id);

            client.types = types.map(t => t.name);

            return Client.from(client);
        }
        catch(e){
            console.error(`Failed to get client of slug ${ slug }`);
            console.error(e);

            return;
        }
    }

    async createClient(newClient: Client): Promise<Client|undefined>{
        const args = [
            newClient.name,
            newClient.slug || slugify(newClient.name),
            newClient.ownerId
        ];

        let client: IDBClient;
        try{
            client = await db.q('create-client', args);
        }
        catch(e){
            console.error('Error creating new client');
            console.error(e);

            return new Client({});
        }

        if(newClient.types && newClient.types.length){
            try{
                const types = await this.updateClientTypes(client.id, <number[]>newClient.types);
            }
            catch(e){
                return Promise.reject(e);
            }
        }

        return this.getClient(client.id);
    }

    async updateClient(client: Client): Promise<Client|undefined>{
        let curClient: Client|undefined;
        try{
            curClient = await this.getClient(<number>client.id);

            if(!curClient) return;
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

        let updated: IDBClient|undefined;
        try{
            updated = await db.q('update-client', args);

            if(!updated) return;
        }
        catch(e){
            console.error(`Error updating client "${ client.name }"`);
            console.error(e);

            return Promise.reject(`Error updating client "${ client.name }"`);
        }

        if(client.types && client.types.length){
            try{
                const types = await this.updateClientTypes(updated.id, <number[]>client.types);
            }
            catch(e){
                return Promise.reject(e);
            }
        }

        return this.getClient(updated.id);
    }

    async disableClient(id: number, comment: string): Promise<Client|undefined>{
        let client: Client|undefined;
        try{
            client = await this.getClient(id);

            if(!client) return;
        }
        catch(e){
            return Promise.reject(e);
        }

        client.isDisabled      = true;
        client.disabledComment = comment;

        return this.updateClient(client);
    }

    async enableClient(id: number){
        let client: Client|undefined;
        try{
            client = await this.getClient(id);

            if(!client) return;
        }
        catch(e){
            return Promise.reject(e);
        }

        client.isDisabled      = false;
        client.disabledComment = null;

        return this.updateClient(client);
    }


    /*
        ============
        TYPE METHODS
        ============
    */
    async getTypes(): Promise<IDBClientType[]>{
        try{
            const types = await db.q('get-types');

            return types;
        }
        catch(e){
            return Promise.reject('Failed to get types from database');
        }
    }

    async getTypeIds(): Promise<number[]>{
        try{
            const types: IDBClientType[] = await this.getTypes();

            const validTypes: number[] = types.reduce((acc: number[], t: IDBClientType) => {
                acc.push(<number>t.id);

                return acc;
            }, []);

            return validTypes;
        }
        catch(e){
            console.error('Error fetching client types:');
            console.error(e.message);
            
            return [];
        }
    }

    async getType(id: number): Promise<IDBClientType|undefined>{
        try{
            const type: IDBClientType|undefined = await db.q('get-type', [ id ]);

            return type;
        }
        catch(e){
            console.error(`Failed to get type "${ id }" from database`);
            console.error(e.message);

            return;
        }
    }

    async createType(newType: IType): Promise<IType>{
        try{
            const type = await db.q('create-type', [ newType.name ]);

            return type;
        }
        catch(e){
            return Promise.reject(`Failed to create type "${ newType.name }"`);
        }
    }
    
    async updateType(type: IType): Promise<IType>{
        let curType;
        try{
            curType = await this.getType(type.id as number);
        }
        catch(e){
            return Promise.reject(e);
        }

        for(const prop in type){
            if(type[prop] !== undefined){
                curType[prop] = type[prop];
            }
        }

        return db.q('update-type', [ curType.id, curType.name ]);
    }

    async getClientTypes(clientId: number): Promise<IType[]>{
        try{
            const types: IType[] = await db.q('get-client-types', [ clientId ]);

            return types;
        }
        catch(e){
            console.error(`Failed to get types for clientId "${ clientId }"`);
            console.error(e);

            return [];
        }
    }

    async updateClientTypes(clientId: number, types: number[]){
        let validTypes: number[];
        try{
            validTypes = await this.getTypeIds();
        }
        catch(e){
            return Promise.reject(e);
        }

        // Filter out types that are not valid
        types = types.filter(t => validTypes.includes(t));

        // Drop all types for the client
        try{
            await this.dropClientTypes(clientId);
        }
        catch(e){
            return Promise.reject(e);
        }

        // Set the provided types
        try{
            const typesAdded = await this.addClientTypes(clientId, types);

            return typesAdded;
        }
        catch(e){
            return Promise.reject(e);
        }
    }

    async addClientTypes(clientId: number, types: number[]): Promise<number[]>{
        try{
            const insertedTypes = [];
            for(let i = 0, len = types.length; i < len; i++){
                const inserted = await db.q('add-client-type', [ types[i], clientId ]);

                inserted && insertedTypes.push(inserted.type_id);
            }

            return insertedTypes;
        }
        catch(e){
            console.error('Error adding client types to database');
            console.error(e);

            return [];
        }
    }
    
    async removeClientTypes(clientId: number, types: number[]): Promise<number[]>{
        try{
            const deletedTypes = [];
            for(let i = 0, len = types.length; i < len; i++){
                const deleted = await db.q('remove-client-type', [ types[i], clientId ]);

                deleted && deletedTypes.push(deleted.type_id);
            }

            return deletedTypes;
        }
        catch(e){
            console.error('Error deleting client types from database');
            console.error(e);

            return [];
        }
    }

    async dropClientTypes(clientId: number): Promise<number[]>{
        try{
            const droppedTypes = await db.q('drop-client-types', [ clientId ]);

            return droppedTypes.reduce((acc: number[], t: any) => {
                acc.push(t.type_id);

                return acc;
            }, []);
        }
        catch(e){
            console.error(`Failed to drop types for clientId: "${ clientId }"`);
            console.error(e);

            return []
        }
    }
}

export const clientService = new ClientService();