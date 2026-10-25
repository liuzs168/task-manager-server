import { type Request, type Response } from 'express';


export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        error: {
            code: 'NOT_FOUND',
            message: `接口不存在: ${req.method} ${req.path}`,
        }
    });
}
