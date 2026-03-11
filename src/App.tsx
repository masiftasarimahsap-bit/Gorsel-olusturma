import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { ImageUploader } from './components/ImageUploader';
import { ImageGallery } from './components/ImageGallery';
import { VideoGallery } from './components/VideoGallery';
import { fal } from './lib/fal';

const PROMPT_TEMPLATES = [
  {
    title: "Ahşap Mumluk Stüdyo Çekimi",
    prompt: "High-end studio product photo of a handmade beech wood candle holder with an elegant white candle placed inside, shot on pure white seamless background, softbox lighting from both sides, subtle soft shadow, ultra clean commercial look, product perfectly centered, realistic wood texture, macro level detail, luxury ecommerce photography, sharp focus",
    image: "/template-1.png"
  },
  {
    title: "Siyah Arkaplan Stüdyo Çekimi",
    prompt: "Luxury studio photography of handmade natural wood candle holder with a slim neutral candle on deep matte black background, dramatic soft spotlight, cinematic shadow falloff, premium brand catalog style, ultra realistic texture, high contrast professional lighting, 85mm product lens, 2667x2000 resolution",
    image: "/template-2.png"
  },
  {
    title: "Soft Lifestyle Stüdyo",
    prompt: "Professional studio lifestyle product photography, handmade beech wood candle holder with a beautiful unscented candle on neutral beige studio background, soft diffused daylight simulation, elegant shadow, minimal modern aesthetic, interior decor magazine style, ultra realistic, high detail wood grain, 2667x2000",
    image: "/template-3.png"
  },
  {
    title: "Ultra Close Detay",
    prompt: "Macro studio product photography of handmade beech wood candle holder containing a smooth candle, extreme wood grain detail, shallow depth of field, luxury product advertising style, soft studio lighting, ultra sharp focus on texture, blurred background, commercial catalog shot, 2667x2000",
    image: "/template-4.png"
  },
  {
    title: "Mumlu Dekoratif Versiyon",
    prompt: "Professional studio photo of handmade beech wood candle holder with elegant candle placed inside, soft studio lighting, natural shadow, premium home decor catalog style, ultra realistic, clean seamless background, commercial ecommerce photography, 2667x2000",
    image: "/template-5.png"
  },
  {
    title: "Keten Kumaş Üzerinde Signature",
    prompt: "Signature style studio photo of handmade beech wood candle holder with a minimalist candle placed on natural wrinkled linen fabric, warm beige studio background, soft directional daylight simulation, calm artisan luxury mood, ultra realistic wood texture, boutique home decor brand photography, 2667x2000",
    image: "/template-6.png"
  },
  {
    title: "Doğal Taş Minimal Sahne",
    prompt: "Signature artisan studio photography, handmade wooden candle holder holding a neutral colored candle on raw light travertine stone surface, warm neutral studio background, soft shadow gradient, premium slow living aesthetic, ultra realistic product focus, 2667x2000",
    image: "/template-7.png"
  },
  {
    title: "Floating Minimal Signature",
    prompt: "Signature minimal studio product photography, handmade beech wood candle holder with an elegant white candle inside appearing slightly floating with soft shadow underneath, warm cream gradient background, ultra clean luxury brand style, realistic wood grain, 2667x2000",
    image: "/template-8.png"
  },
  {
    title: "Editorial Magazin Signature",
    prompt: "Editorial signature style studio photo, handmade wooden candle holder containing a sleek candle styled like luxury interior magazine product shot, warm soft studio daylight, beige tonal backdrop, premium artisan branding mood, ultra realistic, 2667x2000",
    image: "/template-9.png"
  },
  {
    title: "Mumlu Signature Atmosfer",
    prompt: "Signature warm artisan studio photography, handmade beech wood candle holder with elegant neutral candle, soft diffused studio light, warm beige background, calm premium home decor brand feeling, ultra realistic, 2667x2000",
    image: "/template-10.png"
  },
  {
    title: "Mikro Doku Premium Signature",
    prompt: "Signature macro studio product photo, handmade beech wood candle holder holding a pristine unlit candle, extreme wood grain detail focus, soft warm studio lighting, creamy neutral blurred background, luxury artisan brand catalog style, 2667x2000",
    image: "/template-11.png"
  },
  {
    title: "Minimal Seramik Props Signature",
    prompt: "Signature studio photo of handmade wooden candle holder with a modern candle and minimal matte ceramic decor prop, warm neutral background, soft studio lighting, boutique premium home styling aesthetic, ultra realistic, 2667x2000",
    image: "/template-12.png"
  },
  {
    title: "Japandi Signature Minimal",
    prompt: "Japandi inspired signature studio photography, handmade beech wood candle holder featuring a sleek candle, warm neutral background, minimal natural styling, soft daylight studio simulation, calm luxury mood, ultra realistic, 2667x2000",
    image: "/template-13.png"
  },
  {
    title: "Soft Gradient Studio Signature",
    prompt: "Signature studio product photography, handmade wooden candle holder holding a neutral beige candle on smooth warm gradient background (cream to beige), soft directional studio light, premium ecommerce catalog quality, ultra realistic, 2667x2000",
    image: "/template-14.png"
  },
  {
    title: "Shadow Play Signature",
    prompt: "Signature artisan studio photography, handmade beech wood candle holder containing an elegant candle with artistic soft shadow play on warm neutral background, premium boutique decor brand look, ultra realistic texture detail, 2667x2000",
    image: "/template-15.png"
  }
];

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [numImages, setNumImages] = useState<number>(10);
  const [generateVideo, setGenerateVideo] = useState<boolean>(false);
  const [videoPrompt, setVideoPrompt] = useState<string>('');
  const [videoFormat, setVideoFormat] = useState<'16:9' | '1:1' | '9:16'>('16:9');
  const [cameraMovement, setCameraMovement] = useState<string>('');
  const [handInteraction, setHandInteraction] = useState<string>('');

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
          // If the lighting interaction is selected, make sure we emphasize an initially unlit candle getting lit.
          const isLightingInteraction = handInteraction.includes("lighter") || handInteraction.includes("lights the candle");

          let baseVideoPrompt = videoPrompt.trim()
            ? `${videoPrompt} ${cameraMovement} ${handInteraction}`.trim()
            : `Premium etsy product photography, lifestyle aesthetic: ${prompt}. ${cameraMovement} ${handInteraction}`.trim();

          if (isLightingInteraction) {
            baseVideoPrompt += ". The image starts with an unlit candle inside the holder, then a hand holding a lighter slowly approaches and lights it, bringing the warm flame to life.";
          }

          const videoResult = await fal.subscribe("fal-ai/kling-video/v3/pro/image-to-video", {
            input: {
              prompt: baseVideoPrompt,
              start_image_url: imageUrl,
              duration: "5",
              generate_audio: false,
              aspect_ratio: videoFormat
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
          <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>2. Yaşam Tarzı Sahnesini Betimleyin</h2>
            <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Ortam hakkında özel detaylar ekleyin. Yapay zekamız ürününüzü bu sahneye kusursuz bir şekilde entegre edecek.
            </p>

            {/* Prompt Templates */}
            <div style={{ marginBottom: '1.5rem', minWidth: 0 }}>
              <p className="form-label" style={{ marginBottom: '0.75rem' }}>Örnek Şablonlar (Hızlı Seçim)</p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '1rem',
                maxHeight: '400px',
                overflowY: 'auto',
                paddingRight: '0.5rem',
                paddingBottom: '0.5rem'
              }}>
                {PROMPT_TEMPLATES.map((tpl, i) => (
                  <div
                    key={i}
                    onClick={() => setPrompt(tpl.prompt)}
                    style={{
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: prompt === tpl.prompt ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                      transition: 'all 0.2s ease',
                      background: prompt === tpl.prompt ? 'rgba(123, 97, 255, 0.1)' : 'rgba(255,255,255,0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%'
                    }}
                    className="template-card"
                  >
                    <img src={tpl.image} alt={tpl.title} style={{ width: '100%', height: '140px', objectFit: 'contain', background: '#fff' }} />
                    <div style={{ padding: '0.75rem 0.5rem', fontSize: '0.8rem', textAlign: 'center', fontWeight: 500, lineHeight: 1.3, background: 'rgba(0,0,0,0.5)', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {tpl.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
                <div style={{ display: 'flex', gap: '0.5rem', height: '100%' }}>
                  <button
                    className="btn"
                    style={{
                      flex: 1,
                      background: generateVideo ? 'var(--accent-gradient)' : 'rgba(0, 0, 0, 0.2)',
                      border: `1px solid ${generateVideo ? 'transparent' : 'var(--border-color)'}`,
                      color: generateVideo ? 'white' : 'var(--text-muted)'
                    }}
                    onClick={() => setGenerateVideo(true)}
                  >
                    Evet (Video Üret)
                  </button>
                  <button
                    className="btn"
                    style={{
                      flex: 1,
                      background: !generateVideo ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.2)',
                      border: `1px solid ${!generateVideo ? 'rgba(255, 255, 255, 0.2)' : 'var(--border-color)'}`,
                      color: !generateVideo ? 'white' : 'var(--text-muted)'
                    }}
                    onClick={() => setGenerateVideo(false)}
                  >
                    Hayır (Sadece Fotoğraf)
                  </button>
                </div>
              </div>
            </div>

            {generateVideo && (
              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label className="form-label" htmlFor="videoPromptInput">Video Özellikleri (Opsiyonel Video Promptu)</label>
                <textarea
                  id="videoPromptInput"
                  className="form-control"
                  placeholder="örn. Kamera yavaşça ürüne yaklaşıyor, mum alevi hafifçe dalgalanıyor, soft gün ışığı..."
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  style={{ minHeight: '80px', padding: '0.75rem' }}
                />
                <span className="input-hint" style={{ marginTop: '0.5rem', display: 'block' }}>
                  Boş bırakılırsa, yukarıda yazdığınız görsel promptu video için de temel alınacaktır. Özel kamera hareketleri veya zaman çizelgesi ekleyebilirsiniz.
                </span>
              </div>
            )}

            {generateVideo && (
              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label className="form-label">Video Formatı (Görüntü Oranı)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {[
                    { ratio: '16:9', label: 'Etsy / Yatay', icon: '▭', desc: 'Mağaza listelemeleri, kapak videoları ve YouTube için ideal.' },
                    { ratio: '1:1', label: 'Kare', icon: '□', desc: 'Instagram Akış ve Facebook gönderileri için ideal.' },
                    { ratio: '9:16', label: 'Dikey (Reels)', icon: '▯', desc: 'Instagram Reels, TikTok, Shorts ve Pinterest için ideal.' }
                  ].map((format) => (
                    <div
                      key={format.ratio}
                      className="format-option"
                      onClick={() => setVideoFormat(format.ratio as '16:9' | '1:1' | '9:16')}
                      style={{
                        position: 'relative',
                        cursor: 'pointer',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: videoFormat === format.ratio ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                        background: videoFormat === format.ratio ? 'rgba(123, 97, 255, 0.1)' : 'rgba(0,0,0,0.2)',
                        textAlign: 'center',
                        transition: 'all 0.2sease'
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: videoFormat === format.ratio ? 'var(--accent-color)' : 'var(--text-muted)' }}>{format.icon}</div>
                      <div style={{ fontWeight: 500 }}>{format.ratio}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{format.label}</div>
                      <div className="format-tooltip" style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginBottom: '10px',
                        background: 'rgba(0,0,0,0.9)',
                        color: 'white',
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        width: '150px',
                        textAlign: 'center',
                        opacity: 0,
                        visibility: 'hidden',
                        transition: 'opacity 0.2s',
                        zIndex: 10,
                        pointerEvents: 'none'
                      }}>
                        {format.desc}
                        <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', border: '5px solid transparent', borderTopColor: 'rgba(0,0,0,0.9)' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {generateVideo && (
              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label className="form-label">Kamera Hareketi</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {[
                    { id: '', label: 'Sabit / AI Sürprizi', class: '' },
                    { id: 'Slow cinematic zoom in.', label: 'Yaklaş (Zoom In)', class: 'preview-zoom-in' },
                    { id: 'Slow cinematic pan right.', label: 'Sağa Kay (Pan)', class: 'preview-pan-right' },
                    { id: 'Cinematic orbit around the object.', label: 'Etrafında Dön', class: 'preview-orbit' }
                  ].map((move) => (
                    <div
                      key={move.label}
                      className={`camera-option ${move.class}`}
                      onClick={() => setCameraMovement(move.id)}
                      style={{
                        position: 'relative',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: cameraMovement === move.id ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                        background: cameraMovement === move.id ? 'rgba(123, 97, 255, 0.1)' : 'rgba(0,0,0,0.2)',
                        textAlign: 'center',
                        fontSize: '0.85rem',
                        overflow: 'hidden',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '60px'
                      }}
                    >
                      <div className="camera-bg-preview" />
                      <span style={{ position: 'relative', zIndex: 1, fontWeight: 500, pointerEvents: 'none', color: cameraMovement === move.id ? 'white' : 'var(--text-muted)' }}>
                        {move.label}
                      </span>
                    </div>
                  ))}
                </div>
                <span className="input-hint" style={{ marginTop: '0.5rem', display: 'block' }}>
                  Hareketi önizlemek için fare ile butonların üzerine gelin.
                </span>
              </div>
            )}

            {generateVideo && (
              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label className="form-label">İnsan Etkileşimi (Opsiyonel)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {[
                    { id: '', label: 'Etkileşim Yok', icon: '✨' },
                    { id: 'A natural human hand elegantly places the product onto the surface.', label: 'Ürünü Bırakma', icon: '🤌' },
                    { id: 'A natural human hand holding a lighter slowly approaches the candle holder and carefully lights the unlit candle, bringing the flame to life.', label: 'Mumu Yakma', icon: '🔥' }
                  ].map((interaction) => (
                    <div
                      key={interaction.label}
                      onClick={() => setHandInteraction(interaction.id)}
                      style={{
                        cursor: 'pointer',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: handInteraction === interaction.id ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                        background: handInteraction === interaction.id ? 'rgba(123, 97, 255, 0.1)' : 'rgba(0,0,0,0.2)',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <span style={{ fontSize: '1.25rem' }}>{interaction.icon}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: handInteraction === interaction.id ? 'white' : 'var(--text-muted)' }}>
                        {interaction.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
