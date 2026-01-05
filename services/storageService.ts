
import imageCompression from 'browser-image-compression';
import { supabase } from './supabaseClient';

interface StorageOptions {
    bucket: string;
    path: string;
    oldPath?: string; // Optional: path to an old file to delete
}

export const storageService = {
    /**
     * Compresses an image file with predefined settings:
     * Max width: 1200px, WebP format, 0.8 quality.
     */
    async compressImage(file: File): Promise<File> {
        const options = {
            maxWidthOrHeight: 1200,
            useWebWorker: true,
            fileType: 'image/webp',
            initialQuality: 0.8,
        };

        try {
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
        } catch (error) {
            console.error('Error compressing image:', error);
            throw error;
        }
    },

    /**
     * Uploads a file to Supabase storage.
     * If oldPath is provided, it deletes the old file first.
     */
    async uploadFile(file: File, options: StorageOptions): Promise<string> {
        const { bucket, path, oldPath } = options;

        try {
            // 1. If it's an update, delete the old file
            if (oldPath) {
                // Extract the filename from the URL if needed, or assume it's a relative path
                const relativeOldPath = oldPath.includes('public/')
                    ? oldPath.split('public/').pop()
                    : oldPath.split('/').slice(-2).join('/'); // basic heuristic for path

                // If oldPath is a full URL, we need to be careful. 
                // For simplicity, let's assume oldPath is the relative path in the bucket.
                // If it's a URL, we'll try to extract the relative path.
                let actualOldPath = oldPath;
                if (oldPath.startsWith('http')) {
                    const urlParts = oldPath.split(`${bucket}/`);
                    if (urlParts.length > 1) {
                        actualOldPath = urlParts[1];
                    }
                }

                const { error: deleteError } = await supabase.storage
                    .from(bucket)
                    .remove([actualOldPath]);

                if (deleteError) {
                    console.warn('Could not delete old file:', deleteError.message);
                }
            }

            // 2. Upload the new file
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(path, file, {
                    upsert: true,
                    contentType: file.type // Ensure correct content type (e.g., image/webp)
                });

            if (uploadError) throw uploadError;

            // 3. Get the public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(path);

            return publicUrl;
        } catch (error) {
            console.error('Error in storageService.uploadFile:', error);
            throw error;
        }
    }
};
