import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';
import multer from 'multer';

// For a real application, you would use a cloud storage service like AWS S3, Google Cloud Storage, etc.
// This is a simple file system implementation for demonstration purposes

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

// Configure upload directory
const UPLOAD_DIR = path.join(process.cwd(), '/../../uploads');

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.promises.access(UPLOAD_DIR);
  } catch (error) {
    await mkdirAsync(UPLOAD_DIR, { recursive: true });
  }
}

// Initialize upload directory
ensureUploadDir();

// Configure multer for handling multipart/form-data
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

/**
 * Upload a file to the server
 * @param fileData The file data as a Buffer
 * @param fileName The original file name
 * @param fileType The MIME type of the file
 * @returns Object containing the URL of the uploaded file
 */
export async function uploadFile(
  fileData: Buffer,
  fileName: string,
  fileType: string,
) {
  try {
    // Generate a unique filename
    const uniqueFilename = `${uuidv4()}-${fileName}`;
    const filePath = path.join(UPLOAD_DIR, uniqueFilename);

    // Write file to disk
    await writeFileAsync(filePath, fileData);

    // In a real application, you would upload to cloud storage and return the URL
    // For this example, we'll return a local URL
    const fileUrl = `/uploads/${uniqueFilename}`;

    return {
      url: fileUrl,
      fileName: uniqueFilename,
      originalName: fileName,
      fileType,
      fileSize: fileData.length,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}

/**
 * Get the URL for a file
 * @param fileName The name of the file
 * @returns The URL of the file
 */
export function getFileUrl(fileName: string) {
  return `/uploads/${fileName}`;
}

/**
 * Delete a file from the server
 * @param fileName The name of the file to delete
 */
export async function deleteFile(fileName: string) {
  try {
    const filePath = path.join(UPLOAD_DIR, fileName);
    await fs.promises.unlink(filePath);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file');
  }
}
