'use strict';

import { clientError }  from './client-error';
import { notFound }     from './not-found';
import { unauthorized } from './unauthorized';

import { serverError } from './server-error';

export const http = {
    clientError,
    notFound,
    unauthorized,

    serverError
}