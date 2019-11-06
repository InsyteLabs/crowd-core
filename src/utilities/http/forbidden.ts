'use strict';

import { Response } from 'express';

export function forbidden(res: Response, message: string = 'Forbidden'): Response{
    return res.status(403).json({ message });
}