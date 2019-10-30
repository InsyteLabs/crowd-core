'use strict';

import { Response } from 'express';

const isProd = process.env.NODE_ENV === 'production';

export function serverError(res: Response, error: Error, message: string = 'Server Error'): Response{
    console.error(error);
    console.error(message);

    if(isProd){
        return res.status(500).json({ message });
    }

    return res.status(500).json({
        message,
        error: error.message,
        stack: error.stack
    });
}