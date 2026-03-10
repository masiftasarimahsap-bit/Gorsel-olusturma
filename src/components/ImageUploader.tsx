import { useCallback, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';

interface ImageUploaderProps {
    onImageChange: (file: File | null) => void;
    previewUrl: string | null;
}

export function ImageUploader({ onImageChange, previewUrl }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                onImageChange(file);
            }
        }
    }, [onImageChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageChange(e.target.files[0]);
        }
    };

    const clearImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        onImageChange(null);
    };

    return (
        <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>1. Ürün Fotoğrafını Yükleyin</h2>
            <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Ürününüzün net bir fotoğrafını yükleyin. Yapay zeka ile profesyonel arka planlar oluşturacağız.
            </p>

            <div
                className={`uploader-area ${isDragging ? 'dragging' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
                style={{ flexGrow: 1 }}
            >
                <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleChange}
                />

                {previewUrl ? (
                    <div className="preview-container">
                        <img src={previewUrl} alt="Ürün önizleme" className="preview-image" />
                        <button
                            className="remove-image-btn"
                            onClick={clearImage}
                            title="Fotoğrafı kaldır"
                        >
                            <X size={20} />
                        </button>
                    </div>
                ) : (
                    <>
                        <UploadCloud className="uploader-icon" />
                        <div className="uploader-text">Yüklemek için tıklayın veya sürükleyip bırakın</div>
                        <div className="uploader-subtext">PNG, JPG, WEBP veya GIF (max. 10MB)</div>
                    </>
                )}
            </div>
        </div>
    );
}
