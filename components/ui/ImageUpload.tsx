
import React, { useState, useRef } from 'react';
import { Camera, Plus, Loader2, User, Building2 } from 'lucide-react';
import { storageService } from '../../services/storageService';

interface ImageUploadProps {
    currentImageUrl?: string | null;
    onUploadComplete: (url: string) => void;
    type?: 'avatar' | 'logo';
    placeholder?: 'user' | 'clinic';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    bucket?: string;
    folder?: string;
    className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    currentImageUrl,
    onUploadComplete,
    type = 'avatar',
    placeholder = 'user',
    size = 'md',
    bucket = 'nutriclin-media',
    folder = 'uploads',
    className = ''
}) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-24 h-24',
        lg: 'w-32 h-32',
        xl: 'w-40 h-40',
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);

            // 1. Compress
            const compressed = await storageService.compressImage(file);

            // 2. Upload
            const fileName = `${type}-${Date.now()}.webp`;
            const publicUrl = await storageService.uploadFile(compressed, {
                bucket,
                path: `${folder}/${fileName}`,
                oldPath: currentImageUrl || undefined
            });

            // 3. Callback
            onUploadComplete(publicUrl);
        } catch (err: any) {
            console.error('Upload error:', err);
            // Let the parent handle visual error or we could use toast here too
            throw err;
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={`relative group ${className}`}>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
            />

            <div
                className={`${sizeClasses[size]} ${type === 'avatar' ? 'rounded-full' : 'rounded-3xl'} overflow-hidden bg-cream-100 border-4 border-white shadow-soft-lg ring-2 ring-cream-200 relative flex items-center justify-center`}
            >
                {uploading ? (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                        <Loader2 className="animate-spin text-coral-500" size={size === 'sm' ? 20 : 32} />
                    </div>
                ) : null}

                {currentImageUrl ? (
                    <img src={currentImageUrl} alt="Upload" className="w-full h-full object-cover" />
                ) : (
                    <div className="text-cream-400">
                        {placeholder === 'user' ? <User size={size === 'xl' ? 64 : 48} /> : <Building2 size={size === 'xl' ? 64 : 48} />}
                    </div>
                )}
            </div>

            <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="absolute -right-1 -bottom-1 w-10 h-10 bg-coral-500 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-coral-600 transition-all hover:scale-110 active:scale-95 disabled:opacity-50 z-20 group-hover:shadow-coral-200/50"
            >
                {type === 'avatar' ? <Camera size={20} /> : <Plus size={24} />}
            </button>
        </div>
    );
};

export default ImageUpload;
