import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import {
  getQuickReport,
  createQuickReport,
  updateManpower,
  addQualityEntry,
  addScheduleEntry,
  addComment,
} from '../controllers/quickReport.controller';
import { UserRole } from '../../../domain/user';

const router = Router();

router.use(authenticate);

// Get quick report by project and date
router.get('/project/:projectId', getQuickReport);

// Create new quick report (admin only)
router.post('/', authorize([UserRole.ADMIN]), createQuickReport);

// Update manpower (admin only)
router.put('/:id/manpower', authorize([UserRole.ADMIN]), updateManpower);

// Add entries and comments (all authenticated users)
router.post('/:id/quality', addQualityEntry);
router.post('/:id/schedule', addScheduleEntry);
router.post('/:id/comments', addComment);

export default router;

