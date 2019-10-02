'use strict';

import { Response } from "express";

const isProd = process.env['NODE_ENV'] === 'production';

export function sendError(res: Response, err: Error, message='Server Error'){
    console.log(err);
    console.log(message);
    if(isProd){
        return res.status(500).json({ message });
    }

    return res.status(500).json({
        message,
        err: err.message,
        stack: err.stack
    });
}