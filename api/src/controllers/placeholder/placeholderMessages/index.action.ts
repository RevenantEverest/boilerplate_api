import type { Request, Response, NextFunction } from '@@types/express.js';

async function index(req: Request, res: Response, next: NextFunction) {
    return res.json({ message: "Placeholder Content" })
};

export default index;