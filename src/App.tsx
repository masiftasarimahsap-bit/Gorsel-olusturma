import { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft, Sun, Moon } from 'lucide-react';
import { ImageUploader } from './components/ImageUploader';
import { ImageGallery } from './components/ImageGallery';
import { VideoGallery } from './components/VideoGallery';
import { fal } from './lib/fal';

// Define categories and their templates
type CategoryType = 'samdan' | 'vazo' | 'ayak';

const CATEGORY_TEMPLATES: Record<CategoryType, Array<{ title: string, prompt: string, image: string }>> = {
  samdan: [
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
  ],
  vazo: [
    {
      title: "Konsol Üzeri Kuru Çiçekli",
      prompt: "High-end interior photography, a beautiful wooden vase placed on a modern wooden entryway console table, filled with elegant dried pampas grass and eucalyptus, warm natural sunlight streaming from a side window, soft shadows, neutral beige wall background, premium home decor magazine style, 85mm lens, 2667x2000",
      image: "/template-vazo-1.png"
    },
    {
      title: "Minimalist Sehpa Odaklı",
      prompt: "Minimalist luxury living room photography, a single elegant wooden vase sitting on a low profile stone coffee table, empty vase emphasizing its sculptural handmade form, soft diffused natural daylight, Japandi interior aesthetic, ultra realistic wood grain texture, 2667x2000",
      image: "/template-vazo-2.png"
    },
    {
      title: "Stüdyo Portre Vazo",
      prompt: "Commercial studio product photography of a handmade wooden vase on a pure warm cream seamless backdrop, dramatic yet soft studio lighting highlighting the curves and natural wood grain, empty vase, extremely sharp focus, luxury artisan brand catalog style, 2667x2000",
      image: "/template-vazo-3.png"
    },
    {
      title: "Rustik Mutfak Adası",
      prompt: "Warm rustic interior photography, a handcrafted wooden vase on a marble kitchen island, holding fresh olive branches, blurred warm kitchen background with subtle copper accents, inviting morning sunlight, slow living aesthetic, highly detailed wood texture, 2667x2000",
      image: "/template-vazo-4.png"
    },
    {
      title: "Keten Masa Örtüsü Romantizmi",
      prompt: "Artisan lifestyle photography, a beautiful wooden vase placed on a table covered with wrinkled natural linen fabric, holding a few long-stemmed dried wildflowers, moody and soft diffused window light, wabi-sabi aesthetic, rich wood tones, 2667x2000",
      image: "/template-vazo-5.png"
    },
    {
      title: "Karanlık ve Dramatik Stüdyo",
      prompt: "Moody dramatic studio photography, a sculptural wooden vase on a dark slate background, single soft spotlight revealing the gorgeous natural wood grain and silhouette, high contrast, luxury boutique styling, no flowers, 2667x2000",
      image: "/template-vazo-6.png"
    },
    {
      title: "Kitaplık Karası Minimal",
      prompt: "Interior styling photography, an elegant wooden vase placed on a stylish matte black bookshelf next to a few neutral colored art books, soft interior lighting, modern contemporary home decor, ultra realistic, sharp focus on the vase, 2667x2000",
      image: "/template-vazo-7.png"
    },
    {
      title: "Pencere Önü Berrak Işık",
      prompt: "Bright natural lighting photography, a wooden vase sitting on a white windowsill, sheer curtains softly blowing in the background, pure morning sunlight casting soft long shadows, fresh spring aesthetic, minimal and clean, 2667x2000",
      image: "/template-vazo-8.png"
    },
    {
      title: "Doğal Taş Kaide Üzerinde",
      prompt: "Gallery exhibition style photography, a masterpiece handmade wooden vase displayed on a raw travertine stone plinth, warm beige gallery walls, spotlight illumination from above, museum quality art object, ultra realistic texture, 2667x2000",
      image: "/template-vazo-9.png"
    },
    {
      title: "Banyo Spa Atmosferi",
      prompt: "Luxury spa bathroom interior photography, a smooth wooden vase resting on a concrete vanity counter next to rolled white towels, holding simple green stems, tranquil and calming atmosphere, soft diffused light, premium wellness aesthetic, 2667x2000",
      image: "/template-vazo-10.png"
    },
    {
      title: "Yumuşak Pastel Gradyan",
      prompt: "Modern commercial product photography, a wooden vase on a smooth pastel background (soft terracotta to blush pink), clean seamless studio setup, directional softbox lighting, trendy interior design look, highly detailed wood surface, 2667x2000",
      image: "/template-vazo-11.png"
    },
    {
      title: "Makro Ahşap Dokusu",
      prompt: "Extreme macro product photography focusing tightly on the intricate natural grain of a wooden vase, shallow depth of field, warm rich wood tones perfectly illuminated, luxury advertising aesthetic, ultra sharp detail, 2667x2000",
      image: "/template-vazo-12.png"
    },
    {
      title: "Yerde Minimalist Köşe",
      prompt: "Architectural interior photography, a large floor-standing wooden vase tucked nicely into a clean corner of a modern room with polished concrete floors and white walls, filled with tall architectural dried branches, serene minimal space, soft daylight, 2667x2000",
      image: "/template-vazo-13.png"
    },
    {
      title: "Yemek Masası Merkez Parçası",
      prompt: "Elegant dining room photography, a wooden vase serving as a beautiful centerpiece on a large oak dining table, surrounding blurred chairs, holding a lush arrangement of neutral dried flora, warm inviting evening light, premium lifestyle, 2667x2000",
      image: "/template-vazo-14.png"
    },
    {
      title: "Gölge Oyunu Stüdyo",
      prompt: "Artistic studio photography, a handcrafted wooden vase on a warm beige background with beautiful dappled sunlight shadows (like leaves from a tree) cast across the scene, poetic and warm mood, premium artisan product styling, 2667x2000",
      image: "/template-vazo-15.png"
    }
  ],
  ayak: [
    {
      title: "Modern Sehpa Altında",
      prompt: "Interior lifestyle photography, focusing closely on an elegant handmade wooden furniture leg attached to a modern minimalist white coffee table, resting on a plush cream-colored rug, modern living room setting, warm natural sunlight, highly detailed wood grain, 2667x2000",
      image: "/template-ayak-1.png"
    },
    {
      title: "Endüstriyel Masa Montajı",
      prompt: "Professional furniture photography, a sturdy wooden furniture leg attached to a thick raw edge wooden dining table, set on polished concrete floor, industrial chic studio loft apartment background, sharp focus on the leg design, ultra realistic, 2667x2000",
      image: "/template-ayak-2.png"
    },
    {
      title: "Ürün Stüdyo Çekimi",
      prompt: "High-end commercial studio product photo of a single handmade wooden furniture leg standing upright on a pure white seamless background, softbox lighting, soft ground shadow, clean catalog aesthetic, perfect color accuracy, 2667x2000",
      image: "/template-ayak-3.png"
    },
    {
      title: "Koltuk Ayağı Detayı",
      prompt: "Close-up interior photography, a beautifully turned wooden furniture leg supporting a luxurious beige bouclé fabric sofa, sitting on warm oak hardwood flooring, cozy and premium living room aesthetic, soft window light, sharp detail on the wood, 2667x2000",
      image: "/template-ayak-4.png"
    },
    {
      title: "Marangoz Atölyesi Tezgahı",
      prompt: "Artisan workshop lifestyle photography, a newly crafted wooden furniture leg resting horizontally on a rustic wooden workbench, wood shavings and vintage woodworking tools beautifully blurred in the background, warm moody workshop lighting, authentic craft mood, 2667x2000",
      image: "/template-ayak-5.png"
    },
    {
      title: "Karanlık Dramatik Katalog",
      prompt: "Moody dramatic studio photography, a sculptural wooden furniture leg standing against a deep almost-black backdrop, a single rim light highlighting the turning details and silhouette, luxury furniture hardware catalog style, 2667x2000",
      image: "/template-ayak-6.png"
    },
    {
      title: "Retro Konsol Ayağı",
      prompt: "Mid-century modern aesthetic photography, an elegant tapered wooden furniture leg attached to a sleek retro credenza cabinet, resting on a geometric patterned rug, warm nostalgic interior lighting, highly realistic wood texture, 2667x2000",
      image: "/template-ayak-7.png"
    },
    {
      title: "Zarif Yatak Ayağı",
      prompt: "Bedroom interior photography, focusing on a beautifully carved wooden furniture leg supporting a luxury upholstered bed frame, soft neutral carpet flooring, peaceful morning sunlight filtering through the room, calming atmosphere, 2667x2000",
      image: "/template-ayak-8.png"
    },
    {
      title: "Beton Zemin Kontrastı",
      prompt: "Minimalist architecture photography, a sharp and modern wooden furniture leg attached to a black side table, resting strictly on a raw gray concrete floor, high contrast, clean lines, contemporary design aesthetic, sharp focus, 2667x2000",
      image: "/template-ayak-9.png"
    },
    {
      title: "Doku Makro Çekimi",
      prompt: "Extreme macro studio photography of a wooden furniture leg, focusing intensely on the natural wood grain and flawless finish, beautiful warm ambient light, blurred background for depth, premium manufacturing quality showcase, 2667x2000",
      image: "/template-ayak-10.png"
    },
    {
      title: "Dış Mekan Ahşap Deck",
      prompt: "Outdoor patio lifestyle photography, a sturdy wooden furniture leg attached to an outdoor lounge chair, resting on weather-resistant teak wooden decking, soft bright summer daylight, relaxed outdoor living aesthetic, 2667x2000",
      image: "/template-ayak-11.png"
    },
    {
      title: "Pastel Arkaplan Stüdyo",
      prompt: "Trendy commercial photography, a wooden furniture leg standing alone on a smooth sage green studio backdrop, soft diffused lighting, modern and playful design catalog aesthetic, popping wood color against the pastel background, 2667x2000",
      image: "/template-ayak-12.png"
    },
    {
      title: "Mermer Zemin Lüks",
      prompt: "Luxury interior photography, a refined wooden furniture leg attached to an entryway elegant table, resting on glossy white marble flooring with subtle gray veining, high-end residential aesthetic, perfect lighting reflection, 2667x2000",
      image: "/template-ayak-13.png"
    },
    {
      title: "Yumuşak Gölge Oyunu",
      prompt: "Artistic product photography, a solitary wooden furniture leg standing on a warm beige surface, with beautiful, long, geometric shadows cast by strong directional late afternoon sunlight, minimal and poetic mood, 2667x2000",
      image: "/template-ayak-14.png"
    },
    {
      title: "Rustik Zemin Parkesi",
      prompt: "Cozy interior detail photography, a solid wooden furniture leg attached to a rustic coffee table, resting on reclaimed wide-plank oak flooring, warm inviting cottage core aesthetic, rich textures, soft natural window light, 2667x2000",
      image: "/template-ayak-15.png"
    }
  ]
};

function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryType | null>(null);
  const [productSize, setProductSize] = useState<string>('');

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [numImages, setNumImages] = useState<number>(1);
  const [generateImages, setGenerateImages] = useState<boolean>(true);
  const [generateVideo, setGenerateVideo] = useState<boolean>(false);
  const [videoPrompt, setVideoPrompt] = useState<string>('');
  const [videoFormat, setVideoFormat] = useState<'16:9' | '1:1' | '9:16'>('16:9');
  const [cameraMovement, setCameraMovement] = useState<string>('');
  const [handInteraction, setHandInteraction] = useState<string>('');

  const [appTheme, setAppTheme] = useState<'light' | 'dark'>('dark');
  const [visualMood, setVisualMood] = useState<string>('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', appTheme);
  }, [appTheme]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<Array<{ url: string; index: number }>>([]);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  // --- HISTORY STATE ---
  type HistoryItem = {
    id: string;
    url: string;
    prompt: string;
    category: CategoryType;
    timestamp: number;
    type: 'image' | 'video';
  };
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentView, setCurrentView] = useState<'editor' | 'history'>('editor');

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('masif_special_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history on change
  useEffect(() => {
    localStorage.setItem('masif_special_history', JSON.stringify(history));
  }, [history]);

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

      const moodPrompt = visualMood ? `, in a ${visualMood} style and atmosphere` : '';

      // --- PHASE 1: IMAGE GENERATION ---
      let validImages: { url: string, index: number }[] = [];
      if (generateImages) {
        setProgressStatus(`${numImages} premium varyasyon oluşturuluyor... (Bu işlem biraz sürebilir)`);

        const scalePrompt = productSize.trim() !== ''
          ? `CRITICAL INSTRUCTION: Maintain the exact scale, color, shape, and design of the provided product exactly as it is. The product is a ${productSize}. Do NOT distort its dimensions. `
          : `CRITICAL INSTRUCTION: Maintain the exact scale, color, and shape of the provided product. `;

        const promises = Array.from({ length: numImages }).map(async (_, index) => {
          try {
            const activePrompt = selectedTemplates.length > 0
              ? selectedTemplates[index % selectedTemplates.length]
              : prompt;

            const response = await fal.subscribe("fal-ai/nano-banana-2/edit", {
              input: {
                prompt: `${scalePrompt}Premium etsy product photography, lifestyle aesthetic: ${activePrompt}${moodPrompt}`,
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
        validImages = results.filter((res): res is { url: string, index: number } => res !== null);
        setGeneratedImages(validImages);
      }

      // --- PHASE 2: VIDEO GENERATION (Kling V3) ---
      if (generateVideo) {
        setProgressStatus('Kling V3 Pro ile yaşam tarzı videosu oluşturuluyor... (Bu işlem uzun sürebilir)');

        try {
          const activeVideoBasePrompt = selectedTemplates.length > 0 ? selectedTemplates[0] : prompt;
          const isLightingInteraction = handInteraction.includes("lighter") || handInteraction.includes("lights the candle");

          let baseVideoPrompt = videoPrompt.trim()
            ? `${videoPrompt} ${cameraMovement} ${handInteraction}`.trim()
            : `Premium etsy product photography, lifestyle aesthetic: ${activeVideoBasePrompt}${moodPrompt}. ${cameraMovement} ${handInteraction}`.trim();

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

      // Update History
      const newItems: HistoryItem[] = validImages.map(img => {
        const itemPrompt = selectedTemplates.length > 0
          ? selectedTemplates[img.index % selectedTemplates.length]
          : prompt;

        return {
          id: Math.random().toString(36).substr(2, 9),
          url: img.url,
          prompt: itemPrompt,
          category: activeCategory!,
          timestamp: Date.now(),
          type: 'image'
        };
      });

      if (generatedVideoUrl) {
        const videoBasePrompt = selectedTemplates.length > 0 ? selectedTemplates[0] : prompt;
        newItems.push({
          id: Math.random().toString(36).substr(2, 9),
          url: generatedVideoUrl,
          prompt: videoPrompt || videoBasePrompt,
          category: activeCategory!,
          timestamp: Date.now(),
          type: 'video'
        });
      }

      setHistory(prev => [...newItems, ...prev].slice(0, 50));

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', position: 'relative' }}>
          {activeCategory && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setActiveCategory(null);
                setPrompt('');
                setProductSize('');
              }}
              style={{
                position: 'absolute',
                left: 0,
                padding: '0.6rem 1.2rem',
                fontSize: '0.85rem'
              }}
            >
              <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Geri
            </button>
          )}

          <h1 className="text-gradient">Masif Special AI Studio</h1>

          <div style={{ position: 'absolute', right: 0 }}>
            <button
              className="btn btn-secondary"
              onClick={() => setAppTheme(appTheme === 'dark' ? 'light' : 'dark')}
              style={{
                padding: '0.6rem',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={appTheme === 'dark' ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
            >
              {appTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
        <p>Etsy algoritmasına uygun premium yaşam tarzı görselleri ve videoları oluşturun</p>
      </header>

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        <button
          className={`nav-tab ${currentView === 'editor' ? 'active' : ''}`}
          onClick={() => setCurrentView('editor')}
        >
          <Sparkles size={18} />
          <span className={currentView === 'editor' ? 'text-gradient' : ''}>Düzenleyici</span>
        </button>
        <button
          className={`nav-tab ${currentView === 'history' ? 'active' : ''}`}
          onClick={() => setCurrentView('history')}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🕒</span>
            <span className={currentView === 'history' ? 'text-gradient' : ''}>Galeri</span>
            {history.length > 0 && (
              <span style={{
                position: 'absolute',
                top: -8,
                right: -12,
                background: 'var(--error-color)',
                color: 'white',
                fontSize: '0.65rem',
                padding: '1px 5px',
                borderRadius: '10px',
                fontWeight: 'bold'
              }}>
                {history.length}
              </span>
            )}
          </div>
        </button>
      </nav>

      <main className="main-content">
        {currentView === 'history' ? (
          <div className="glass-panel" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="history-header">
              <h2>Üretim Galerisi</h2>
              <button
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem' }}
                onClick={() => {
                  if (confirm('Tüm geçmişi silmek istediğinize emin misiniz?')) {
                    setHistory([]);
                  }
                }}
              >
                Geçmişi Temizle
              </button>
            </div>

            {history.length === 0 ? (
              <div className="empty-history">
                <div className="empty-history-icon" style={{ fontSize: '3rem' }}>📁</div>
                <p>Henüz bir üretim yapmadınız.</p>
                <button
                  className="btn btn-primary"
                  style={{ marginTop: '1.5rem' }}
                  onClick={() => setCurrentView('editor')}
                >
                  Hemen Başla
                </button>
              </div>
            ) : (
              <div className="history-grid">
                {history.map(item => (
                  <div key={item.id} className="history-card">
                    <div className="history-image-container">
                      {item.type === 'video' ? (
                        <video src={item.url} className="history-image" muted onMouseOver={e => e.currentTarget.play()} onMouseOut={e => e.currentTarget.pause()} />
                      ) : (
                        <img src={item.url} alt="Geçmiş Görsel" className="history-image" loading="lazy" />
                      )}
                      <div className="gallery-overlay">
                        <div className="gallery-actions">
                          <a href={item.url} target="_blank" rel="noreferrer" className="action-btn" title="Genişlet">
                            🔍
                          </a>
                          <button
                            className="action-btn"
                            title="Sil"
                            onClick={() => setHistory(prev => prev.filter(h => h.id !== item.id))}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="history-info">
                      <div className="history-meta">
                        <span>{item.category.toUpperCase()}</span>
                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="history-prompt" title={item.prompt}>{item.prompt}</p>
                      <div className="history-footer">
                        <button
                          className="btn btn-secondary"
                          style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem' }}
                          onClick={() => {
                            setActiveCategory(item.category);
                            setPrompt(item.prompt);
                            setCurrentView('editor');
                          }}
                        >
                          Düzenle
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : !activeCategory ? (
          <div className="category-selection" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 500 }}>Hangi ürün tipini oluşturmak istiyorsunuz?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '1000px' }}>
              <div
                className="category-card glass-panel"
                onClick={() => {
                  setActiveCategory('samdan');
                  setSelectedTemplates([]);
                }}
                style={{ cursor: 'pointer', transition: 'all 0.3s ease', textAlign: 'center', padding: '2rem 1.5rem' }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🕯️</div>
                <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent-color)' }}>Ahşap Şamdan</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>Mumluklar, şamdan kapları ve dekoratif mumluklar için özel stüdyo ve yaşam tarzı şablonları.</p>
              </div>

              <div
                className="category-card glass-panel"
                onClick={() => {
                  setActiveCategory('vazo');
                  setSelectedTemplates([]);
                }}
                style={{ cursor: 'pointer', transition: 'all 0.3s ease', textAlign: 'center', padding: '2rem 1.5rem' }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏺</div>
                <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent-color)' }}>Ahşap Vazo</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>Dekoratif ahşap vazolar, kuru çiçek sahneleri ve premium iç mekan tasarım şablonları.</p>
              </div>

              <div
                className="category-card glass-panel"
                onClick={() => {
                  setActiveCategory('ayak');
                  setSelectedTemplates([]);
                }}
                style={{ cursor: 'pointer', transition: 'all 0.3s ease', textAlign: 'center', padding: '2rem 1.5rem' }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🪑</div>
                <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent-color)' }}>Ahşap Ayak</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>Masa, sehpa, koltuk ayakları için ölçek korumalı, mobilya ve marangoz atölyesi sahneleri.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="editor-view" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="top-section" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '2rem', alignItems: 'start' }}>
              <div className="upload-wrapper">
                <ImageUploader
                  previewUrl={previewUrl}
                  onImageChange={setFile}
                />
              </div>

              <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>2. Yaşam Tarzı Sahnesini Betimleyin</h2>
                <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  Ortam hakkında özel detaylar ekleyin. Yapay zekamız ürününüzü bu sahneye kusursuz bir şekilde entegre edecek.
                </p>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: '0.75rem', display: 'block' }}>Görsel Atmosfer (Mood)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem' }}>
                    {[
                      { id: '', label: 'Standart', icon: '✨' },
                      { id: 'bohemian, earthy tones, natural fabrics, eclectic', label: 'Bohem', icon: '🌿' },
                      { id: 'minimalist, scandinavian, clean lines, bright, airy', label: 'Minimal', icon: '⚪' },
                      { id: 'industrial, raw textures, concrete, metal, moody', label: 'Endüstriyel', icon: '🧱' },
                      { id: 'luxury, velvet, gold accents, elegant lighting', label: 'Lüks', icon: '💎' },
                      { id: 'vintage, retro filter, warm grain, nostalgia', icon: '🎥', label: 'Vintage' }
                    ].map(mood => (
                      <div
                        key={mood.label}
                        onClick={() => setVisualMood(mood.id)}
                        style={{
                          cursor: 'pointer',
                          padding: '0.5rem',
                          borderRadius: 'var(--radius-md)',
                          border: visualMood === mood.id ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                          background: visualMood === mood.id ? 'rgba(123, 97, 255, 0.1)' : 'rgba(0,0,0,0.05)',
                          textAlign: 'center',
                          transition: 'all 0.2s',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <span style={{ fontSize: '1.2rem' }}>{mood.icon}</span>
                        <div style={{ fontSize: '0.7rem', fontWeight: 600 }}>{mood.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem', minWidth: 0 }}>
                  <p className="form-label" style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Örnek Şablonlar (Çoklu Seçim)</p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: '0.75rem',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    paddingRight: '0.5rem',
                    paddingBottom: '0.5rem'
                  }}>
                    {CATEGORY_TEMPLATES[activeCategory].map((tpl, i) => {
                      const isSelected = selectedTemplates.includes(tpl.prompt);
                      const selectionIndex = selectedTemplates.indexOf(tpl.prompt);

                      return (
                        <div
                          key={i}
                          onClick={() => {
                            let newList;
                            if (isSelected) {
                              newList = selectedTemplates.filter(p => p !== tpl.prompt);
                            } else {
                              newList = [...selectedTemplates, tpl.prompt];
                            }
                            setSelectedTemplates(newList);
                            setNumImages(newList.length || 1);
                            if (newList.length === 1) {
                              setPrompt(newList[0]);
                            } else if (newList.length === 0) {
                              setPrompt('');
                            }
                          }}
                          style={{
                            cursor: 'pointer',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            border: isSelected ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                            transition: 'all 0.2s ease',
                            background: isSelected ? 'rgba(123, 97, 255, 0.1)' : 'rgba(255,255,255,0.02)',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            position: 'relative'
                          }}
                        >
                          <img src={tpl.image} alt={tpl.title} style={{ width: '100%', height: '100px', objectFit: 'cover', background: '#2c2c31' }} />
                          {isSelected && (
                            <div style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              background: 'var(--accent-gradient)',
                              color: 'white',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px',
                              fontWeight: 'bold',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                              zIndex: 2
                            }}>
                              {selectionIndex + 1}
                            </div>
                          )}
                          <div style={{ padding: '0.4rem', fontSize: '0.7rem', textAlign: 'center', fontWeight: 500, lineHeight: 1.2, background: 'rgba(0,0,0,0.4)', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {tpl.title}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Ürün Boyutu ve Türü</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={
                      activeCategory === 'ayak' ? "örn. 72 cm Ahşap Masa Ayağı" :
                        activeCategory === 'vazo' ? "örn. 30 cm Uzun Ahşap Vazo" :
                          "örn. Standart Boy Ahşap Şamdan"
                    }
                    value={productSize}
                    onChange={(e) => setProductSize(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Ortam Özellikleri (Prompt)</label>
                  <textarea
                    className="form-control"
                    placeholder="Sahnemizi betimleyin..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    style={{ minHeight: '80px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Fotoğraf Üretimi</label>
                    <div className="btn-group" style={{ display: 'flex', gap: '0.25rem' }}>
                      <button className={`btn ${generateImages ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }} onClick={() => setGenerateImages(true)}>Evet</button>
                      <button className={`btn ${!generateImages ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }} onClick={() => setGenerateImages(false)}>Hayır</button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Video Üretimi</label>
                    <div className="btn-group" style={{ display: 'flex', gap: '0.25rem' }}>
                      <button className={`btn ${generateVideo ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }} onClick={() => setGenerateVideo(true)}>Evet</button>
                      <button className={`btn ${!generateVideo ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }} onClick={() => setGenerateVideo(false)}>Hayır</button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
                  {generateImages && (
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Fotoğraf Adedi</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        className="form-control"
                        value={numImages}
                        onChange={(e) => setNumImages(Math.min(Math.max(parseInt(e.target.value) || 1, 1), 20))}
                        style={{ padding: '0.5rem' }}
                      />
                    </div>
                  )}

                  {generateVideo && (
                    <div className="video-settings-group" style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>Video Özel Ayarları</h3>

                      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label className="form-label" style={{ fontSize: '0.8rem' }}>Video Özel Betimlemesi (Opsiyonel)</label>
                        <textarea
                          className="form-control"
                          placeholder="Video için özel bir senaryo yazın (Boş bırakılırsa ana prompt kullanılır)..."
                          value={videoPrompt}
                          onChange={(e) => setVideoPrompt(e.target.value)}
                          style={{ minHeight: '60px', fontSize: '0.85rem' }}
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label className="form-label" style={{ fontSize: '0.8rem' }}>Kamera Hareketi</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                          {[
                            { id: '', label: 'Standart' },
                            { id: 'The camera slowly zooms in towards the product.', label: 'Yakınlaşma' },
                            { id: 'The camera pans slowly from left to right.', label: 'Soldan Sağa Pan' },
                            { id: 'The camera orbits around the product.', label: 'Etrafında Dönüş' }
                          ].map(move => (
                            <button
                              key={move.label}
                              className={`btn ${cameraMovement === move.id ? 'btn-primary' : 'btn-secondary'}`}
                              onClick={() => setCameraMovement(move.id)}
                              style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                            >
                              {move.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label className="form-label" style={{ fontSize: '0.8rem' }}>El Etkileşimi</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                          {[
                            { id: '', label: 'Yok' },
                            { id: 'A hand slowly reaches out and touches the product texture carefully.', label: 'Dokunma' },
                            ...(activeCategory === 'samdan' ? [{ id: 'A hand holding a lighter slowly approaches and lights the candle inside the holder.', label: 'Mumu Yak' }] : []),
                            ...(activeCategory === 'vazo' ? [{ id: 'A hand slowly places a beautiful dried flower in the vase.', label: 'Çiçek Koy' }] : [])
                          ].map(hand => (
                            <button
                              key={hand.label}
                              className={`btn ${handInteraction === hand.id ? 'btn-primary' : 'btn-secondary'}`}
                              onClick={() => setHandInteraction(hand.id)}
                              style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                            >
                              {hand.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.8rem' }}>Video Formatı</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.25rem' }}>
                          {[{ r: '16:9', i: '▭' }, { r: '1:1', i: '□' }, { r: '9:16', i: '▯' }].map(f => (
                            <div
                              key={f.r}
                              onClick={() => setVideoFormat(f.r as any)}
                              style={{
                                cursor: 'pointer',
                                padding: '0.4rem',
                                borderRadius: 'var(--radius-sm)',
                                border: videoFormat === f.r ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                                background: videoFormat === f.r ? 'rgba(123,97,255,0.1)' : 'rgba(0,0,0,0.1)',
                                textAlign: 'center'
                              }}
                            >
                              <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{f.r}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-primary"
                  onClick={handleGenerate}
                  disabled={!file || !prompt.trim() || isGenerating || (!generateImages && !generateVideo)}
                  style={{ width: '100%', marginTop: '2rem', padding: '1.25rem', fontSize: '1.1rem' }}
                >
                  {isGenerating ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <div className="loader-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px', marginBottom: 0 }}></div>
                      <span>Oluşturuluyor...</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <Sparkles size={20} />
                      <span>
                        {!generateImages && generateVideo ? 'Sadece Videoyu Oluştur' :
                          generateImages && !generateVideo ? 'Varyasyonları Oluştur' :
                            'Fotoğraf ve Video Oluştur'}
                      </span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '2rem' }}>
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
        </div>
      </main>
    </div>
  );
}

export default App;
