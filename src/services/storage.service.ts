export interface UploadResult {
  url: string;
  fileName: string;
  sizeBytes: number;
  mimeType: string;
}

export class StorageService {
  public static async uploadResume(
    fileName: string,
    fileBuffer: Buffer | string,
    mimeType: string = 'application/pdf'
  ): Promise<UploadResult> {
    // In production, upload to S3 / GCP Cloud Storage / Vercel Blob
    // In local development, generate a clean managed file identifier
    const uniqueId = `resume_${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const url = `/uploads/${uniqueId}`;

    return {
      url,
      fileName,
      sizeBytes: typeof fileBuffer === 'string' ? fileBuffer.length : fileBuffer.byteLength,
      mimeType,
    };
  }
}
