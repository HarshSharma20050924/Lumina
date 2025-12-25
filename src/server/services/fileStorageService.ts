import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

interface FileUploadResult {
  filename: string;
  path: string;
  size: number;
  mimetype: string;
}

// This is a mock file storage service
// In a real implementation, this would integrate with cloud storage like AWS S3, Cloudinary, etc.

export const uploadFile = async (fileBuffer: Buffer, filename: string, folder: string = 'uploads'): Promise<FileUploadResult> => {
  try {
    // Create folder if it doesn't exist
    const uploadPath = path.join(process.cwd(), 'public', folder);
    await fs.mkdir(uploadPath, { recursive: true });
    
    // Generate unique filename
    const fileExtension = path.extname(filename);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadPath, uniqueFilename);
    
    // Write file to disk
    await fs.writeFile(filePath, fileBuffer);
    
    // Get file stats
    const stats = await fs.stat(filePath);
    
    return {
      filename: uniqueFilename,
      path: `/public/${folder}/${uniqueFilename}`,
      size: stats.size,
      mimetype: getFileType(fileExtension)
    };
  } catch (error) {
    throw new Error(`File upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const deleteFile = async (filePath: string): Promise<boolean> => {
  try {
    await fs.unlink(path.join(process.cwd(), filePath));
    return true;
  } catch (error) {
    console.error(`Failed to delete file ${filePath}:`, error);
    return false;
  }
};

export const uploadProductImage = async (imageBuffer: Buffer, filename: string) => {
  return await uploadFile(imageBuffer, filename, 'product-images');
};

export const uploadUserProfileImage = async (imageBuffer: Buffer, filename: string) => {
  return await uploadFile(imageBuffer, filename, 'profile-images');
};

// Helper function to determine file type based on extension
const getFileType = (extension: string): string => {
  const ext = extension.toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
    case '.png':
    case '.gif':
    case '.webp':
      return 'image';
    case '.mp4':
    case '.avi':
    case '.mov':
      return 'video';
    case '.pdf':
      return 'application/pdf';
    default:
      return `file/${ext.replace('.', '')}`;
  }
};

// In a real implementation, we would have integration with cloud storage services
// For example, with Cloudinary:
/*
import cloudinary from 'cloudinary';

export const uploadToCloudinary = async (fileBuffer: Buffer, folder: string) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};
*/