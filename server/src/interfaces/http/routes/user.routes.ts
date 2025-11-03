import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { listUsers, getUser, updateUser, deleteUser } from '../controllers/user.controller';
import { UserRole } from '../../../domain/user';

const router = Router();

router.use(authenticate);

router.get('/', authorize([UserRole.ADMIN]), listUsers);
router.get('/:id', authorize([UserRole.ADMIN, UserRole.INVESTOR, UserRole.STAFF]), getUser);
router.patch('/:id', authorize([UserRole.ADMIN]), updateUser);
router.delete('/:id', authorize([UserRole.ADMIN]), deleteUser);

export default router;


