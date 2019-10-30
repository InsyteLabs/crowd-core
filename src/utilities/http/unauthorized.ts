'use strict';

import { Response } from "express";

export function unauthorized(res: Response, message: string = 'Unauthorized'): Response{
    return res.status(401).json({ message });
}