'use strict';

import { Response } from 'express';

export function clientError(res: Response, message: string = 'Request Error'): Response{
    return res.status(400).json({ message });
}