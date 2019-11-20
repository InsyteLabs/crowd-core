'use strict';

import { db } from '../db';
import {
    IDBClient, IDBClientType, IDBType
} from '../db/interfaces';

import { Client }  from '../models';
import { IType }   from '../interfaces';
import { slugify } from '../utilities';

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
                newClient.ownerId
            ]);
        }
        catch(e){
            console.error(`Error creating new client "${ newClient.name }"`);
            console.error(e.message);

            return;
        }

        if(newClient.types && newClient.types.length){
            await this.setClientTypes(client.id, newClient.types);
        }

        return this.getClient(client.id);
    }

    async updateClient(client: Client): Promise<Client|undefined>{
        const curClient: Client|undefined = await this.getClient(<number>client.id);
        
        if(!curClient) return;

        for(let prop in client){
            if(client[prop] !== undefined){
                curClient[prop] = client[prop];
            }
        }

        let updated: IDBClient|undefined;
        try{
            updated = await db.q('update-client', [
                curClient.id,
                curClient.name,
                curClient.slug,
                curClient.ownerId,
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

        if(client.types && client.types.length){
            await this.setClientTypes(<number>curClient.id, client.types);
        }

        return this.getClient(updated.id);
    }


    /*
        ============
        TYPE METHODS
        ============
    */
    async getTypes(): Promise<IDBType[]>{
        try{
            const types = await db.q('get-types');

            return types;
        }
        catch(e){
            console.error('Failed to get types from database');
            console.error(e.message);

            return [];
        }
    }

    async getClientTypes(clientId: number): Promise<string[]>{
        try{
            const clientTypes: { types: string[] } = await db.q('get-client-types', [ clientId ]);

            return clientTypes.types;
        }
        catch(e){
            console.error(`Error fetching types for client of Id "${ clientId }"`);
            console.error(e.message);

            return [];
        }
    }

    async getTypeIds(): Promise<number[]>{
        try{
            const types: IDBType[] = await this.getTypes();

            return types.map(t => <number>t.id);
        }
        catch(e){
            console.error('Error fetching client types:');
            console.error(e.message);
            
            return [];
        }
    }

    async getType(id: number): Promise<IDBType|undefined>{
        try{
            const type: IDBType|undefined = await db.q('get-type', [ id ]);

            return type;
        }
        catch(e){
            console.error(`Failed to get type "${ id }" from database`);
            console.error(e.message);

            return;
        }
    }

    async createType(newType: IType): Promise<IDBType|undefined>{
        try{
            const type = await db.q('create-type', [ newType.name ]);

            return type;
        }
        catch(e){
            console.error(`Failed to create type "${ newType.name }"`);
            console.error(e.message);
        }
    }
    
    async updateType(type: IDBType): Promise<IDBType|undefined>{
        let curType: IDBType|undefined;
        try{
            curType = await this.getType(type.id as number);

            if(!curType) return;

            return await db.q('update-type', [ curType.id, type.name ]);

        }
        catch(e){
            console.error(`Error updating type of Id "${ type.id }"`);
            console.error(e.message);

            return;
        }
    }

    async setClientTypes(clientId: number, types: string[]): Promise<string[]>{
        let validTypes: IDBType[];
        try{
            validTypes = await this.getTypes();
        }
        catch(e){
            console.error(`Error fetching valid types`);
            console.error(e.message);

            return [];
        }

        const typesToSet = validTypes.filter(t => types.includes(t.name));

        if(!typesToSet.length) return this.getClientTypes(clientId);

        await this.dropClientTypes(clientId);
        await this.addClientTypes(clientId, typesToSet.map(t => <number>t.id));
        
        return this.getClientTypes(clientId);
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

    async dropClientTypes(clientId: number): Promise<number[]>{
        try{
            const droppedTypes: IDBClientType[] = await db.q('drop-client-types', [ clientId ]);

            return droppedTypes.map(t => t.type_id);
        }
        catch(e){
            console.error(`Failed to drop types for clientId: "${ clientId }"`);
            console.error(e);

            return []
        }
    }
}

export const clientService = new ClientService();