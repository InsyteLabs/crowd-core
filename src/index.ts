'use strict';

require('source-map-support').install();

import * as http      from 'http';
import Express        from 'express';
import bodyParser     from 'body-parser';
import * as WebSocket from 'ws';
import { router }     from './routes';


const app    = Express(),
      server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
    ws.send('{"message": "connection-accepted"}');
});

app.set('case sensitive routing', true);
app.enable('trust proxy'); // If running behind Nginx proxy

// Accept form data
const jsonBody = bodyParser.json(),
      urlBody  = bodyParser.urlencoded({ extended: true });
app.use(jsonBody, urlBody);

// Remove "X-Powered-By" header
app.use((req, res, next) => {
    // Attach reference to websocket server for route handlers
    res.locals.wss = wss;

    res.removeHeader('X-Powered-By');

    res.header({
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });

    next();
});

app.get('/', (req, res, next) => {
    return res.send({ message: 'OK' });
});

app.use(router);

server.listen(8080, () => {
    console.log('Server listening on 8080');
});
