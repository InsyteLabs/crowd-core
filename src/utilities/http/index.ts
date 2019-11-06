'use strict';

import { clientError }  from './client-error';
import { notFound }     from './not-found';
import { unauthorized } from './unauthorized';
import { forbidden }    from './forbidden';

import { serverError } from './server-error';

export const http = {
    clientError,
    notFound,
    unauthorized,
    forbidden,

    serverError
}