import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';


const uploadDirs = ['avatars', 'complaints', 'documents', 'bills', 'incidents'].map(
  (dir) => path.join(process.cwd(), 'uploads', dir)
);

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});


const createStorage = (folderName) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const targetDir = path.join(process.cwd(), 'uploads', folderName);
      cb(null, targetDir);
    },
    filename: (req, file, cb) => {
      
      const uniqueSuffix = crypto.randomBytes(8).toString('hex') + '-' + Date.now();
      const ext = path.extname(file.originalname);
      
      const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
      cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    },
  });
};


const imageFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
  }
};



export const uploadAvatar = multer({
  storage: createStorage('avatars'),
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: imageFilter,
}).single('avatar');

export const uploadComplaintImages = multer({
  storage: createStorage('complaints'),
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: imageFilter,
}).array('images', 5);

export const uploadDocument = multer({
  storage: createStorage('documents'),
  limits: { fileSize: 10 * 1024 * 1024 }, 
}).single('file');

export const uploadBill = multer({
  storage: createStorage('bills'),
  limits: { fileSize: 10 * 1024 * 1024 }, 
}).single('bill');

export const uploadIncidentEvidence = multer({
  storage: createStorage('incidents'),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFilter,
}).array('evidence', 5);
