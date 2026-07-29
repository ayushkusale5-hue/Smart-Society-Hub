import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Ensure required upload directories exist
const uploadDirs = ['avatars', 'complaints', 'documents', 'bills'].map(
  (dir) => path.join(process.cwd(), 'uploads', dir)
);

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Helper to define storage with dynamic folder
const createStorage = (folderName) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const targetDir = path.join(process.cwd(), 'uploads', folderName);
      cb(null, targetDir);
    },
    filename: (req, file, cb) => {
      // Use crypto to generate a unique hash, avoiding collision & securing filename
      const uniqueSuffix = crypto.randomBytes(8).toString('hex') + '-' + Date.now();
      const ext = path.extname(file.originalname);
      // Clean original filename for better compatibility
      const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
      cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    },
  });
};

// Common image filter
const imageFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
  }
};

// ─── Multer Instances ──────────────────────────────────────────────────────────

export const uploadAvatar = multer({
  storage: createStorage('avatars'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter,
}).single('avatar');

export const uploadComplaintImages = multer({
  storage: createStorage('complaints'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: imageFilter,
}).array('images', 5);

export const uploadDocument = multer({
  storage: createStorage('documents'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).single('file');

export const uploadBill = multer({
  storage: createStorage('bills'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).single('bill');
