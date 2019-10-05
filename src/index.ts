'use strict';

require('source-map-support').install();

import Express    from 'express';
import bodyParser from 'body-parser';
import { router } from './routes';

const server = Express();

server.set('case sensitive routing', true);
server.enable('trust proxy'); // If running behind Nginx proxy

// Accept form data
const jsonBody = bodyParser.json(),
      urlBody  = bodyParser.urlencoded({ extended: true });
server.use(jsonBody, urlBody);

// Remove "X-Powered-By" header
server.use((req, res, next) => {
    res.removeHeader('X-Powered-By');

    res.header({
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Headers': 'Content-Type'
    });

    next();
});

server.get('/', (req, res, next) => {
    return res.send({ message: 'OK' });
});

server.use(router);

server.listen(8080, () => {
    console.log('Server listening on 8080');
});
