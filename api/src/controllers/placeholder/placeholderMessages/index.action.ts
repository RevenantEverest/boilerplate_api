import { Request, Response, NextFunction } from 'express';

async function index(req: Request, res: Response, next: NextFunction) {
    return res.json({ message: "Placeholder Content" })
};

export default index;