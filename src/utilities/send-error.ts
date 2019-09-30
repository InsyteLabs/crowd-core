'use strict';

const isProd = process.env['NODE_ENV'] === 'production';

console.log(`isProd: ${ isProd }`);

export function sendError(res: any, err: Error, message='Server Error'){
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