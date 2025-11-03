import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { listProjects, createProject, listProjectContacts, addProjectContact } from '../controllers/project.controller';
import { UserRole } from '../../../domain/user';

const router = Router();

router.use(authenticate);
router.get('/', listProjects);
router.post('/', authorize([UserRole.ADMIN]), createProject);
router.get('/:id/contacts', listProjectContacts);
router.post('/:id/contacts', authorize([UserRole.ADMIN]), addProjectContact);

export default router;


