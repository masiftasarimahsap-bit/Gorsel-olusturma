import { Download, ExternalLink } from 'lucide-react';

interface ImageGalleryProps {
    images: Array<{ url: string; index: number }>;
}

export function ImageGallery({ images }: ImageGalleryProps) {
    if (images.length === 0) return null;

    return (
        <div className="gallery-section">
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Etsy'ye Hazır Varyasyonlar</h2>
            <p className="text-muted">İşte ürün listelemeniz için oluşturulmuş 10 yaşam tarzı görseli.</p>

            <div className="gallery-grid">
                {images.map((img) => (
                    <div key={img.index} className={`gallery-item delay-${(img.index % 10) + 1}`}>
                        <img src={img.url} alt={`Varyasyon ${img.index + 1}`} className="gallery-image" />

                        <div className="gallery-overlay">
                            <div className="gallery-actions">
                                <a
                                    href={img.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="action-btn"
                                    title="Yeni sekmede aç"
                                >
                                    <ExternalLink size={18} />
                                </a>
                                <a
                                    href={img.url}
                                    download={`masif-special-varyasyon-${img.index + 1}.png`}
                                    className="action-btn"
                                    title="Görseli indir"
                                    onClick={(e) => {
                                        // Fallback for forcing download since cross-origin a[download] might not work
                                        e.preventDefault();
                                        fetch(img.url)
                                            .then(res => res.blob())
                                            .then(blob => {
                                                const url = window.URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.style.display = 'none';
                                                a.href = url;
                                                a.download = `masif-special-varyasyon-${img.index + 1}.png`;
                                                document.body.appendChild(a);
                                                a.click();
                                                window.URL.revokeObjectURL(url);
                                            })
                                            .catch(err => console.error("Download failed", err));
                                    }}
                                >
                                    <Download size={18} />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
