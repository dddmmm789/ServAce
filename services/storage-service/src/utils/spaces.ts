import { S3 } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
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

export const spacesService = {
    // Generate a unique file key
    generateFileKey: (originalName: string, folder: string = 'general'): string => {
        const timestamp = Date.now();
        const hash = createHash('md5').update(`${originalName}${timestamp}`).digest('hex');
        const extension = originalName.split('.').pop();
        return `${folder}/${hash}.${extension}`;
    },

    // Upload a file
    uploadFile: async (
        fileBuffer: Buffer,
        fileKey: string,
        contentType: string
    ): Promise<string> => {
        const uploadParams = {
            Bucket: spacesBucket,
            Key: fileKey,
            Body: fileBuffer,
            ContentType: contentType,
            ACL: 'public-read'
        };

        await s3Client.send(new PutObjectCommand(uploadParams));
        return `https://${spacesBucket}.${spacesEndpoint}/${fileKey}`;
    },

    // Delete a file
    deleteFile: async (fileKey: string): Promise<void> => {
        const deleteParams = {
            Bucket: spacesBucket,
            Key: fileKey
        };

        await s3Client.send(new DeleteObjectCommand(deleteParams));
    },

    // Get a signed URL for temporary access
    getSignedUrl: async (fileKey: string, expirySeconds: number = 3600): Promise<string> => {
        const command = new GetObjectCommand({
            Bucket: spacesBucket,
            Key: fileKey
        });

        return await getSignedUrl(s3Client, command, { expiresIn: expirySeconds });
    },

    // Get public URL for a file
    getPublicUrl: (fileKey: string): string => {
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
            return false;
        }
    },

    // Get file metadata
    getFileMetadata: async (fileKey: string) => {
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
    }
}; 