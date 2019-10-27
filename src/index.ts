'use strict';

require('source-map-support').install();

import * as http        from 'http';
import Express          from 'express';
import bodyParser       from 'body-parser';
import { router }       from './routes';
import { SocketServer } from './web-sockets';

const app:          Express.Express = Express(),
      server:       http.Server     = http.createServer(app),
      socketServer: SocketServer    = new SocketServer(server);

app.set('case sensitive routing', true);
app.enable('trust proxy'); // If running behind Nginx proxy

// Accept form data
const jsonBody = bodyParser.json(),
      urlBody  = bodyParser.urlencoded({ extended: true });
app.use(jsonBody, urlBody);

// Remove "X-Powered-By" header
app.use((req, res, next) => {
    // Attach reference to websocket server for route handlers
    res.locals.socketServer = socketServer;

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
