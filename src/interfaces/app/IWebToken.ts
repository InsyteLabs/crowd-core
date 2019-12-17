'use strict';

import { User } from '../../models';

export interface IWebToken{
    issuer: string;
    exp:    number;
    iat:    number;
    data:   User;
}