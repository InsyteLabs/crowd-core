'use strict';

import * as http from 'http';
import * as WS   from 'ws';

import { ISocketClientsMap } from '../interfaces';

export const wsClients: ISocketClientsMap = {}

export function createSocketServer(server: http.Server): WS.Server{
    const wss = new WS.Server({ server });

    wss.on('connection', (ws: WebSocket, req: Request): void => {
        if(!req.url.includes('/client/')) return ws.close();

        const slug: string = req.url.replace('/client/', '');

        if(wsClients.hasOwnProperty(slug) && Array.isArray(wsClients[slug])){
            wsClients[slug].push(ws);
        }
        else{
            wsClients[slug] = [ws];
        }

        ws.send('{"message": "connection-accepted"}');
    });

    return wss;
}