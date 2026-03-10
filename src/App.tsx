import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { ImageUploader } from './components/ImageUploader';
import { ImageGallery } from './components/ImageGallery';
import { VideoGallery } from './components/VideoGallery';
import { fal } from './lib/fal';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [numImages, setNumImages] = useState<number>(10);
  const [generateVideo, setGenerateVideo] = useState<boolean>(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<Array<{ url: string; index: number }>>([]);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  // Clean up object URL when file changes
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const handleGenerate = async () => {
    if (!file || !prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedImages([]);
    setGeneratedVideoUrl(null);
    setProgressStatus('Ürün fotoğrafı güvenli bir şekilde yükleniyor...');

    try {
      const imageUrl = await fal.storage.upload(file);

      // --- PHASE 1: IMAGE GENERATION ---
      setProgressStatus(`${numImages} premium varyasyon oluşturuluyor... (Bu işlem biraz sürebilir)`);

      const promises = Array.from({ length: numImages }).map(async (_, index) => {
        try {
          // For the sake of this prompt, using fal-ai/flux-subject / fal-ai/photoroom 
          // or fal-ai/nano-banana-2/edit as the API expects.
          // Using a mock endpoint fal-ai/flux-subject to represent environment generation
          const response = await fal.subscribe("fal-ai/nano-banana-2/edit", {
            input: {
              prompt: `Premium etsy product photography, lifestyle aesthetic: ${prompt}`,
              image_urls: [imageUrl],
              num_images: 1 // doing 1 per request to increase variance & avoid timeouts
            },
            logs: true
          });

          if (response.data && response.data.images && response.data.images[0]) {
            return {
              url: response.data.images[0].url,
              index
            };
          }
          return null;
        } catch (error) {
          console.error(`Error generating image ${index}:`, error);
          return null;
        }
      });

      const results = await Promise.all(promises);
      const validImages = results.filter((res): res is { url: string, index: number } => res !== null);
      setGeneratedImages(validImages);

      // --- PHASE 2: VIDEO GENERATION (Kling V3) ---
      if (generateVideo) {
        setProgressStatus('Kling V3 Pro ile yaşam tarzı videosu oluşturuluyor... (Bu işlem uzun sürebilir)');

        try {
          const videoResult = await fal.subscribe("fal-ai/kling-video/v3/pro/image-to-video", {
            input: {
              prompt: `Premium etsy product photography, lifestyle aesthetic: ${prompt}`,
              start_image_url: imageUrl,
              duration: "5",
              generate_audio: false,
              aspect_ratio: "16:9"
            },
            logs: true
          });

          if (videoResult.data && videoResult.data.video && videoResult.data.video.url) {
            setGeneratedVideoUrl(videoResult.data.video.url);
          }
        } catch (videoError) {
          console.error("Video generation failed:", videoError);
        }
      }

      setProgressStatus(`Tamamlandı! ${validImages.length} varyasyon ${generatedVideoUrl ? 've 1 video ' : ''}oluşturuldu.`);

    } catch (error) {
      console.error("Generation failed:", error);
      setProgressStatus('Oluşturma başarısız oldu. Lütfen internet bağlantınızı veya API anahtarınızı kontrol edin.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <header className="header">
        <h1 className="text-gradient">Masif Special</h1>
        <p>Tek bir ürün fotoğrafını Etsy algoritmasına uygun dilediğiniz sayıda premium yaşam tarzı karesine dönüştürün</p>
      </header>

      <main className="main-content">
        <div className="top-section">
          {/* Uploader Section */}
          <div className="upload-wrapper">
            <ImageUploader
              previewUrl={previewUrl}
              onImageChange={setFile}
            />
          </div>

          {/* Prompt Form Section */}
          <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>2. Yaşam Tarzı Sahnesini Betimleyin</h2>
            <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Ortam hakkında özel detaylar ekleyin. Yapay zekamız ürününüzü bu sahneye kusursuz bir şekilde entegre edecek.
            </p>

            <div className="form-group" style={{ flexGrow: 1 }}>
              <label className="form-label" htmlFor="promptInput">Ortam Özellikleri (Prompt)</label>
              <textarea
                id="promptInput"
                className="form-control"
                placeholder="örn. Sıcak sabah güneşi alan rahat bir oturma odası, rustik ahşap bir sehpa üzerinde, arka planda hafif bulanık ev bitkileri..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <span className="input-hint">Açıklamayı Etsy algoritması estetiği için otomatik olarak optimize ediyoruz.</span>
            </div>

            <div className="form-group" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label" htmlFor="numImagesInput">Kaç Fotoğraf Oluşturulsun?</label>
                <input
                  id="numImagesInput"
                  type="number"
                  min="1"
                  max="20"
                  className="form-control"
                  value={numImages}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setNumImages(isNaN(val) ? 1 : Math.min(Math.max(val, 1), 20));
                  }}
                  style={{ padding: '0.5rem 1rem' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label className="form-label">Video Oluşturulsun mu? (Kling V3)</label>
                <div
                  className="form-control"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    background: generateVideo ? 'rgba(123, 97, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                    borderColor: generateVideo ? 'var(--accent-color)' : 'var(--border-color)',
                  }}
                  onClick={() => setGenerateVideo(!generateVideo)}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: '2px solid var(--accent-color)',
                    marginRight: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: generateVideo ? 'var(--accent-color)' : 'transparent'
                  }}>
                    {generateVideo && <Sparkles size={14} color="white" />}
                  </div>
                  <span>{generateVideo ? 'Evet, Video da Üret' : 'Hayır, Sadece Fotoğraf'}</span>
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleGenerate}
              disabled={!file || !prompt.trim() || isGenerating}
              style={{ width: '100%', marginTop: 'auto', padding: '1rem', fontSize: '1.125rem' }}
            >
              {isGenerating ? (
                <span>Oluşturuluyor...</span>
              ) : (
                <>
                  <Sparkles size={20} />
                  Üretimi Başlat ({numImages} Görsel {generateVideo ? '+ 1 Video' : ''})
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generation Status & Output */}
        {isGenerating && (
          <div className="glass-panel generation-status">
            <div className="loader-spinner"></div>
            <h3 className="loading-text">Görseller Hazırlanıyor</h3>
            <p className="loading-subtext">{progressStatus}</p>
          </div>
        )}

        {!isGenerating && generatedImages.length > 0 && (
          <ImageGallery images={generatedImages} />
        )}

        {!isGenerating && generatedVideoUrl && (
          <VideoGallery videoUrl={generatedVideoUrl} />
        )}
      </main>
    </div>
  );
}

export default App;
