'use strict';

import { Response } from 'express';

export function notFound(res: Response, message: string = 'Not Found'): Response{
    return res.status(404).json({ message });
}