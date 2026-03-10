import { Download, ExternalLink } from 'lucide-react';

interface VideoGalleryProps {
    videoUrl: string | null;
}

export function VideoGallery({ videoUrl }: VideoGalleryProps) {
    if (!videoUrl) return null;

    return (
        <div className="gallery-section" style={{ marginTop: '3rem' }}>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Etsy'ye Hazır Ürün Videosu (Kling V3)</h2>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Ürününüz için yapay zeka tarafından oluşturulan profesyonel kısa video.</p>

            <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-surface)' }}>
                <video
                    src={videoUrl}
                    controls
                    autoPlay
                    loop
                    muted
                    style={{ width: '100%', display: 'block' }}
                />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <a
                        href={videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn"
                        title="Yeni sekmede aç"
                        style={{ background: 'rgba(0, 0, 0, 0.5)' }}
                    >
                        <ExternalLink size={18} />
                    </a>
                    <a
                        href={videoUrl}
                        download={`masif-special-video.mp4`}
                        className="action-btn"
                        title="Videoyu indir"
                        style={{ background: 'rgba(0, 0, 0, 0.5)' }}
                        onClick={(e) => {
                            e.preventDefault();
                            fetch(videoUrl)
                                .then(res => res.blob())
                                .then(blob => {
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.style.display = 'none';
                                    a.href = url;
                                    a.download = `masif-special-video.mp4`;
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
    );
}
