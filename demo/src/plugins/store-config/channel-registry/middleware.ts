import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ResponseHeaderMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        res.setHeader('X-Custom-Header', 'Hello, World!');
        next();
    }
}