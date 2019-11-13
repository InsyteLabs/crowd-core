'use strict';

import * as http from 'http';
import * as WS   from 'ws';

import { ISocketClientsMap } from '../interfaces';

export class SocketServer{
    private INTERVAL: number = 5000; // 5 seconds

    private _server!: WS.Server;
    private _clients: ISocketClientsMap = {};

    constructor(server: http.Server){
        this._server = new WS.Server({ server });

        this._server.on('connection', (ws: WS, req: Request): void => {
            // Socket clients must provide a client slug for channel notifications
            if(!req.url.includes('/websocket/')) return ws.close();

            const slug: string = req.url.replace('/websocket/', '');
    
            if(this._clients.hasOwnProperty(slug) && Array.isArray(this._clients[slug])){
                this._clients[slug].push(ws);
            }
            else{
                this._clients[slug] = [ws];
            }

            ws.send('{"type": "connection-accepted"}');

            /*
                =========
                HEARTBEAT
                =========
            */
            (<any>ws).isAlive = true;

            ws.on('pong', () => (<any>ws).isAlive = true);
        });

        setInterval(this._pruneClients.bind(this), this.INTERVAL);

        return this;
    }

    messageClients(clientSlug: string, type: string, data: any): void{
        if(!this._clients[clientSlug] || !Array.isArray(this._clients[clientSlug])) return;

        const clients: WS[] = this._clients[clientSlug];

        const msg = JSON.stringify({ type, data });

        clients.forEach(c => c.send(msg));
    }
    

    /*
        ===============
        PRIVATE METHODS
        ===============
    */
    private _pruneClients(): void{

        let clientCount: number = 0;

        // Filter out clients that have died
        for(const key in this._clients){
            this._clients[key] = this._clients[key].filter((c: WS) => [c.CONNECTING, c.OPEN].includes(c.readyState));

            clientCount += this._clients[key].length;
        }

        if(clientCount !== this._server.clients.size){
            console.log('SocketServer._clients.length !== SocketServer._server.clients.length');
            console.log(`SocketServer._clients.length: ${ clientCount }`);
            console.log(`SocketServer._server.clients.length: ${ this._server.clients.size }`);

            throw new Error('Socket clients out of sync, maybe failed to prune?');
        }

        this._server.clients.forEach(c => {
            if(!(<any>c).isAlive){
                return c.terminate();
            }

            (<any>c).isAlive = false;
            
            c.ping(null, false);
        });
    }
}