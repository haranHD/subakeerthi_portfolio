import multer from 'multer';

// Use memoryStorage so the file buffer is retained in memory
// and can be encoded directly into the persistent database
const storage = multer.memoryStorage();

export const uploadMedia = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedMime = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
    ];
    if (allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Allowed: JPG, PNG, WebP, SVG, PDF.'));
    }
  },
});
