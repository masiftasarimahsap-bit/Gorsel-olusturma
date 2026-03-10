import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { ImageUploader } from './components/ImageUploader';
import { ImageGallery } from './components/ImageGallery';
import { fal } from './lib/fal';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [numImages, setNumImages] = useState<number>(10);

  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<Array<{ url: string; index: number }>>([]);

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
    setProgressStatus('Ürün fotoğrafı güvenli bir şekilde yükleniyor...');

    try {
      // 1. Upload the base image securely to Fal storage
      const imageUrl = await fal.storage.upload(file);

      setProgressStatus(`${numImages} premium varyasyon oluşturuluyor... (Bu işlem biraz sürebilir)`);

      // In a real scenario we could make concurrent requests or sequential requests.
      // Easiest is to fire a loop of promises. We use the "photoroom" or "flux-subject" model pattern.
      // Here we will use "fal-ai/flux-subject" as an example of adding backgrounds to subjects.
      // Or we can use the "fal-ai/stable-diffusion-v3-medium/image-to-image", wait, the prompt asks for exactly 10 images.
      // So let's make 10 distinct requests (or a model that supports batch generation).
      // Since fal-ai uses `num_images` we might just pass `num_images: 10`, but some models limit it.
      // E.g. flux only supports 1 image per request usually. We'll fire N requests concurrently.

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
      setProgressStatus(`Tamamlandı! ${validImages.length} varyasyon oluşturuldu.`);

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

            <div className="form-group">
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
                  {numImages} Fotoğraf Oluştur
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
      </main>
    </div>
  );
}

export default App;
