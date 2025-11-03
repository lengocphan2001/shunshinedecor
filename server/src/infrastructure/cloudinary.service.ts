import cloudinary from './cloudinary.config';
import { UploadApiResponse } from 'cloudinary';

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  resourceType: string;
  bytes: number;
  width?: number;
  height?: number;
}

/**
 * Upload a file to Cloudinary
 * @param fileBuffer - File buffer to upload
 * @param options - Upload options
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  options: {
    folder?: string;
    resourceType?: 'image' | 'video' | 'raw' | 'auto';
    publicId?: string;
    transformation?: any;
  } = {}
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'sunshine-decor/chat-files',
        resource_type: options.resourceType || 'auto',
        public_id: options.publicId,
        transformation: options.transformation,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        
        if (!result) {
          return reject(new Error('Upload failed - no result returned'));
        }

        resolve({
          url: result.url,
          secureUrl: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          resourceType: result.resource_type,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Delete a file from Cloudinary
 * @param publicId - Public ID of the file to delete
 * @param resourceType - Type of resource
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
}

/**
 * Get optimized image URL with transformations
 * @param publicId - Public ID of the image
 * @param transformations - Cloudinary transformations
 */
export function getOptimizedImageUrl(
  publicId: string,
  transformations: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  } = {}
): string {
  return cloudinary.url(publicId, {
    width: transformations.width,
    height: transformations.height,
    crop: transformations.crop || 'fill',
    quality: transformations.quality || 'auto',
    format: transformations.format || 'auto',
    fetch_format: 'auto',
  });
}

