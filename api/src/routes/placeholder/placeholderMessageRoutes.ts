import express from 'express';
import { placeholderMessagesController } from '../../controllers/placeholder/index.js';

const router = express.Router();

router.route("/")
.get(placeholderMessagesController.index)

export default router;