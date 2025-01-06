import express from 'express';
import multer from 'multer';
import { spacesService, StorageError } from '../utils/spaces';

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (_req, file, cb) => {
        // Allow images and PDFs
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
        }
    },
});

// Upload a single file
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const folder = req.body.folder || 'general';
        const fileKey = spacesService.generateFileKey(req.file.originalname, folder);
        const url = await spacesService.uploadFile(
            req.file.buffer,
            fileKey,
            req.file.mimetype
        );

        res.json({ url, key: fileKey });
    } catch (error) {
        if (error instanceof StorageError) {
            res.status(400).json({ error: error.message, code: error.code });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// Upload multiple files
router.post('/upload-multiple', upload.array('files', 10), async (req, res) => {
    try {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files provided' });
        }

        const folder = req.body.folder || 'general';
        const results = await Promise.all(
            files.map(async (file) => {
                const fileKey = spacesService.generateFileKey(file.originalname, folder);
                const url = await spacesService.uploadFile(
                    file.buffer,
                    fileKey,
                    file.mimetype
                );
                return { url, key: fileKey };
            })
        );

        res.json(results);
    } catch (error) {
        if (error instanceof StorageError) {
            res.status(400).json({ error: error.message, code: error.code });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// Delete a file
router.delete('/delete/:key', async (req, res) => {
    try {
        const exists = await spacesService.fileExists(req.params.key);
        if (!exists) {
            return res.status(404).json({ error: 'File not found' });
        }

        await spacesService.deleteFile(req.params.key);
        res.status(204).send();
    } catch (error) {
        if (error instanceof StorageError) {
            res.status(400).json({ error: error.message, code: error.code });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// Get a signed URL
router.get('/signed-url/:key', async (req, res) => {
    try {
        const expiryMinutes = parseInt(req.query.expiryMinutes as string) || 60;
        const url = await spacesService.getSignedUrl(req.params.key, expiryMinutes * 60);
        res.json({ url });
    } catch (error) {
        if (error instanceof StorageError) {
            res.status(400).json({ error: error.message, code: error.code });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// Get file metadata
router.get('/metadata/:key', async (req, res) => {
    try {
        const exists = await spacesService.fileExists(req.params.key);
        if (!exists) {
            return res.status(404).json({ error: 'File not found' });
        }

        const metadata = await spacesService.getFileMetadata(req.params.key);
        res.json(metadata);
    } catch (error) {
        if (error instanceof StorageError) {
            res.status(400).json({ error: error.message, code: error.code });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

export default router; 