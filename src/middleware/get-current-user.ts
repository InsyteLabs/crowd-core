'use strict';

import express = require('express');


export async function getCurrentUser(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>{
    const token: string = <string>req.headers['token']
}