import { S3 } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { createHash } from 'crypto';

// DigitalOcean Spaces configuration
const spacesEndpoint = process.env.DO_SPACES_ENDPOINT || '';
const spacesRegion = process.env.DO_SPACES_REGION || '';
const spacesKey = process.env.DO_SPACES_KEY || '';
const spacesSecret = process.env.DO_SPACES_SECRET || '';
const spacesBucket = process.env.DO_SPACES_BUCKET || '';

// Initialize S3 client (DO Spaces uses S3-compatible API)
const s3Client = new S3({
    endpoint: `https://${spacesEndpoint}`,
    region: spacesRegion,
    credentials: {
        accessKeyId: spacesKey,
        secretAccessKey: spacesSecret
    }
});

export class StorageError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = 'StorageError';
    }
}

export const spacesService = {
    // Generate a unique file key
    generateFileKey: (originalName: string, folder: string = 'general'): string => {
        try {
            const timestamp = Date.now();
            const hash = createHash('md5').update(`${originalName}${timestamp}`).digest('hex');
            const extension = originalName.split('.').pop()?.toLowerCase() || '';
            return `${folder}/${hash}.${extension}`;
        } catch (error) {
            throw new StorageError('Failed to generate file key', 'GENERATE_KEY_ERROR');
        }
    },

    // Upload a file
    uploadFile: async (
        fileBuffer: Buffer,
        fileKey: string,
        contentType: string
    ): Promise<string> => {
        try {
            const uploadParams = {
                Bucket: spacesBucket,
                Key: fileKey,
                Body: fileBuffer,
                ContentType: contentType,
                ACL: 'public-read' as ObjectCannedACL
            };

            await s3Client.send(new PutObjectCommand(uploadParams));
            return `https://${spacesBucket}.${spacesEndpoint}/${fileKey}`;
        } catch (error) {
            throw new StorageError(
                `Failed to upload file: ${(error as Error).message}`,
                'UPLOAD_ERROR'
            );
        }
    },

    // Delete a file
    deleteFile: async (fileKey: string): Promise<void> => {
        try {
            const deleteParams = {
                Bucket: spacesBucket,
                Key: fileKey
            };

            await s3Client.send(new DeleteObjectCommand(deleteParams));
        } catch (error) {
            throw new StorageError(
                `Failed to delete file: ${(error as Error).message}`,
                'DELETE_ERROR'
            );
        }
    },

    // Get a signed URL for temporary access
    getSignedUrl: async (fileKey: string, expirySeconds: number = 3600): Promise<string> => {
        try {
            const command = new GetObjectCommand({
                Bucket: spacesBucket,
                Key: fileKey
            });

            return await getSignedUrl(s3Client, command, { expiresIn: expirySeconds });
        } catch (error) {
            throw new StorageError(
                `Failed to generate signed URL: ${(error as Error).message}`,
                'SIGNED_URL_ERROR'
            );
        }
    },

    // Get public URL for a file
    getPublicUrl: (fileKey: string): string => {
        if (!fileKey) {
            throw new StorageError('File key is required', 'INVALID_KEY');
        }
        return `https://${spacesBucket}.${spacesEndpoint}/${fileKey}`;
    },

    // Check if a file exists
    fileExists: async (fileKey: string): Promise<boolean> => {
        try {
            await s3Client.send(
                new GetObjectCommand({
                    Bucket: spacesBucket,
                    Key: fileKey
                })
            );
            return true;
        } catch (error) {
            if ((error as any).name === 'NoSuchKey') {
                return false;
            }
            throw new StorageError(
                `Failed to check file existence: ${(error as Error).message}`,
                'CHECK_EXISTENCE_ERROR'
            );
        }
    },

    // Get file metadata
    getFileMetadata: async (fileKey: string) => {
        try {
            const command = new GetObjectCommand({
                Bucket: spacesBucket,
                Key: fileKey
            });

            const response = await s3Client.send(command);
            return {
                contentType: response.ContentType,
                lastModified: response.LastModified,
                size: response.ContentLength,
                metadata: response.Metadata
            };
        } catch (error) {
            throw new StorageError(
                `Failed to get file metadata: ${(error as Error).message}`,
                'METADATA_ERROR'
            );
        }
    }
}; 