
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
        const { bucket = 'nutriclin-media', path, oldPath } = options;

        try {
            // 1. If it's an update, delete the old file
            if (oldPath) {
                let actualOldPath = oldPath;
                if (oldPath.startsWith('http')) {
                    // Extract path after bucket name
                    const urlParts = oldPath.split(`${bucket}/`);
                    if (urlParts.length > 1) {
                        actualOldPath = urlParts[1].split('?')[0];
                    } else {
                        // Fallback: try to get everything after 'object/public/'
                        const publicParts = oldPath.split('public/');
                        if (publicParts.length > 1) {
                            actualOldPath = publicParts[1].split('?')[0];
                        }
                    }
                }

                if (actualOldPath) {
                    const { error: deleteError } = await supabase.storage
                        .from(bucket)
                        .remove([actualOldPath]);

                    if (deleteError) {
                        console.warn('Could not delete old file:', deleteError.message);
                    }
                }
            }

            // 2. Upload the new file
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(path, file, {
                    upsert: true,
                    contentType: file.type || 'image/webp'
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
