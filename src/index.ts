'use strict';

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
    next();
});

server.get('/', (req, res, next) => {
    return res.send({ message: 'OK' });
});

server.use(router);

server.listen(8080, () => {
    console.log('Server listening on 8080');
});
