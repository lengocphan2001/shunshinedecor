import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { uploadToCloudinary } from '../../../infrastructure/cloudinary.service';

/**
 * Handle file upload to Cloudinary
 * POST /api/upload
 */
export async function uploadFile(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: { message: 'No file uploaded' },
      });
    }

    const file = req.file;
    
    // Determine resource type based on mime type
    let resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto';
    if (file.mimetype.startsWith('image/')) {
      resourceType = 'image';
    } else if (file.mimetype.startsWith('video/')) {
      resourceType = 'video';
    } else {
      resourceType = 'raw'; // For documents, PDFs, etc.
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(file.buffer, {
      folder: 'sunshine-decor/chat-files',
      resourceType,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      file: {
        url: result.secureUrl, // Use secure HTTPS URL
        fileName: file.originalname,
        fileSize: result.bytes,
        mimeType: file.mimetype,
        publicId: result.publicId, // For future deletion if needed
        width: result.width,
        height: result.height,
      },
    });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: error.message || 'Failed to upload file to Cloudinary' },
    });
  }
}

