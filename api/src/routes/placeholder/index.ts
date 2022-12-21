import express from 'express';

import placeholderMessageRoutes from './placeholderMessageRoutes.js';

const router = express.Router();

router.use("/messages", placeholderMessageRoutes);

export default router;