import { Router } from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/upload.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Use memory storage for Cloudinary upload (no local disk storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept all file types - Cloudinary will handle them
    cb(null, true);
  },
});

// Upload single file to Cloudinary
router.post('/', authenticate, upload.single('file'), uploadFile);

export default router;

