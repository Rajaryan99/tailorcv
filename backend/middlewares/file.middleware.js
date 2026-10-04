import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF files are allowed'));
        }

        cb(null, true);
    },
});

export const resumeUpload = upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'file', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
]);

export default upload;