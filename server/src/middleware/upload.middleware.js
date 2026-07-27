import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Multer (memory storage) ──────────────────────────────────────────────────
const imageFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
  }
};

const storage = multer.memoryStorage();

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
}).single('avatar');

export const uploadComplaintImages = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFilter,
}).array('images', 5);

export const uploadDocument = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single('file');

// ─── Cloudinary Upload Helper ─────────────────────────────────────────────────
function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function uploadToCloudinary(buffer, folder, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `smart-society-hub/${folder}`, ...options },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    bufferToStream(buffer).pipe(uploadStream);
  });
}

export async function uploadAvatarToCloudinary(buffer) {
  return uploadToCloudinary(buffer, 'avatars', {
    transformation: [{ width: 400, height: 400, crop: 'fill', quality: 'auto' }],
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  });
}

export async function uploadComplaintImageToCloudinary(buffer) {
  return uploadToCloudinary(buffer, 'complaints', {
    transformation: [{ width: 1200, quality: 'auto' }],
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  });
}

export async function deleteFromCloudinary(publicId) {
  return cloudinary.uploader.destroy(publicId);
}

export { cloudinary };
