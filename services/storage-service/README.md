# Storage Service

File storage service for ServAce platform using DigitalOcean Spaces.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
```
Then edit `.env` with your DigitalOcean Spaces credentials.

## Environment Variables

- `STORAGE_SERVICE_PORT`: Port number (default: 3006)
- `DO_SPACES_KEY`: DigitalOcean Spaces access key
- `DO_SPACES_SECRET`: DigitalOcean Spaces secret key
- `DO_SPACES_ENDPOINT`: Space endpoint (default: nyc3.digitaloceanspaces.com)
- `DO_SPACES_BUCKET`: Space bucket name
- `DO_SPACES_REGION`: Space region (default: nyc3)

## Development

Start the service in development mode:
```bash
npm run dev
```

## API Endpoints

### Upload Single File
```bash
POST /storage/upload
Content-Type: multipart/form-data

Form Data:
- file: File to upload
- folder: Optional folder path (default: 'general')
```

### Upload Multiple Files
```bash
POST /storage/upload-multiple
Content-Type: multipart/form-data

Form Data:
- files: Array of files (max 10)
- folder: Optional folder path (default: 'general')
```

### Get Signed URL
```bash
GET /storage/signed-url/:key?expiryMinutes=60
```

### Get File Metadata
```bash
GET /storage/metadata/:key
```

### Delete File
```bash
DELETE /storage/delete/:key
```

### Health Check
```bash
GET /health
```

## File Limitations

- Maximum file size: 5MB
- Allowed file types: Images and PDFs
- Maximum files per upload: 10

## Error Handling

The service returns standard HTTP status codes:
- 200: Success
- 400: Bad Request (invalid input)
- 404: Not Found
- 500: Internal Server Error

Error responses include:
```json
{
    "error": "Error message",
    "code": "ERROR_CODE"
}
```

## Testing

Run the test suite:
```bash
npm test
```

## Example Usage

Upload a file:
```bash
curl -X POST -F "file=@./test.jpg" http://localhost:3006/storage/upload
```

Get a signed URL:
```bash
curl http://localhost:3006/storage/signed-url/folder/filename.jpg
``` 