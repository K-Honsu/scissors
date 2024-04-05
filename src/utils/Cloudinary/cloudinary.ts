import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import sharp from "sharp";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (file:any): Promise<string> => {
    try {
        const resizedBuffer: Buffer = await sharp(file.buffer)
            .resize({ width: 800, height: 600 })
            .toBuffer();

        return new Promise<string>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto',
                    folder: 'clutter',
                } as any,
                (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                    if (err) {
                        console.error('Cloudinary upload error:', err);
                        reject(err);
                    } else {
                        if (!result) {
                            console.error('Cloudinary upload error: Result is undefined');
                            reject(new Error('Cloudinary upload result is undefined'));
                        } else {
                            resolve(result.secure_url);
                        }
                    }
                }
            );

            uploadStream.end(resizedBuffer);
        });
    } catch (error) {
        throw error;
    }
};
