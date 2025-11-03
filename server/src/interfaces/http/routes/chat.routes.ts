import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { listChats } from '../controllers/chat.controller';

const router = Router();

router.use(authenticate);
router.get('/', listChats);

export default router;


