import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Download, 
  RotateCcw, 
  Sliders, 
  Sparkles, 
  Smartphone, 
  Monitor, 
  Sun, 
  Contrast, 
  Droplet, 
  Eye, 
  Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WallpaperStudioModal = ({
  wallpaper,
  onClose,
  onOpenSimulator
}) => {
  if (!wallpaper) return null;

  const canvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgElementRef = useRef(null);

  // Filter States
  const [brightness, setBrightness] = useState(100); // 50 - 150
  const [contrast, setContrast] = useState(100);     // 50 - 150
  const [saturation, setSaturation] = useState(100); // 0 - 200
  const [blur, setBlur] = useState(0);               // 0 - 25
  const [hueRotate, setHueRotate] = useState(0);     // 0 - 360
  const [grayscale, setGrayscale] = useState(0);     // 0 - 100
  const [sepia, setSepia] = useState(0);             // 0 - 100
  const [vignette, setVignette] = useState(0);       // 0 - 100

  // Aspect ratio presets
  const [aspectPreset, setAspectPreset] = useState('original'); // 'original' | '16:9' | '9:16' | '21:9' | '1:1'

  // Pre-load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = wallpaper.src.large2x || wallpaper.src.large || wallpaper.src.original;
    img.onload = () => {
      imgElementRef.current = img;
      setImageLoaded(true);
      renderCanvas();
    };
  }, [wallpaper]);

  // Re-render canvas whenever filters change
  useEffect(() => {
    if (imageLoaded) {
      renderCanvas();
    }
  }, [brightness, contrast, saturation, blur, hueRotate, grayscale, sepia, vignette, aspectPreset, imageLoaded]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const img = imgElementRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');

    // Calculate dimensions based on aspect preset
    let targetW = img.naturalWidth || 1920;
    let targetH = img.naturalHeight || 1080;

    if (aspectPreset === '16:9') {
      targetW = 1920;
      targetH = 1080;
    } else if (aspectPreset === '9:16') {
      targetW = 1080;
      targetH = 1920;
    } else if (aspectPreset === '21:9') {
      targetW = 2560;
      targetH = 1080;
    } else if (aspectPreset === '1:1') {
      targetW = 1200;
      targetH = 1200;
    }

    // Downscale for preview performance if too big
    const maxDim = 1400;
    const scale = Math.min(1, maxDim / Math.max(targetW, targetH));
    canvas.width = Math.round(targetW * scale);
    canvas.height = Math.round(targetH * scale);

    // Apply CSS-like canvas filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur * scale}px) hue-rotate(${hueRotate}deg) grayscale(${grayscale}%) sepia(${sepia}%)`;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image with cover aspect ratio
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = canvas.width / canvas.height;

    let sx, sy, sWidth, sHeight;
    if (imgAspect > canvasAspect) {
      sHeight = img.naturalHeight;
      sWidth = img.naturalHeight * canvasAspect;
      sx = (img.naturalWidth - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = img.naturalWidth;
      sHeight = img.naturalWidth / canvasAspect;
      sx = 0;
      sy = (img.naturalHeight - sHeight) / 2;
    }

    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);

    // Vignette overlay
    if (vignette > 0) {
      ctx.filter = 'none';
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 4,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 1.3
      );
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, `rgba(0,0,0,${vignette / 100})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const applyPreset = (name) => {
    switch (name) {
      case 'amoled':
        setBrightness(85);
        setContrast(140);
        setSaturation(130);
        setGrayscale(0);
        setSepia(0);
        setVignette(60);
        setBlur(0);
        break;
      case 'cyber':
        setBrightness(110);
        setContrast(130);
        setSaturation(160);
        setHueRotate(280);
        setGrayscale(0);
        setSepia(0);
        setVignette(30);
        break;
      case 'sunset':
        setBrightness(105);
        setContrast(115);
        setSaturation(140);
        setHueRotate(340);
        setSepia(35);
        setGrayscale(0);
        break;
      case 'noir':
        setBrightness(95);
        setContrast(145);
        setSaturation(0);
        setGrayscale(100);
        setSepia(0);
        setVignette(40);
        break;
      case 'home_blur':
        setBrightness(90);
        setContrast(100);
        setSaturation(110);
        setBlur(14);
        break;
      default: // reset
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
        setBlur(0);
        setHueRotate(0);
        setGrayscale(0);
        setSepia(0);
        setVignette(0);
    }
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    const link = document.createElement('a');
    link.download = `lumina-studio-${wallpaper.id}-${aspectPreset}.png`;
    link.href = canvas.toDataURL('image/png', 0.95);
    link.click();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '1150px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '16px 24px', 
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(9, 10, 16, 0.9)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sliders size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>
              Wallpaper Studio & Filter Lab
            </h3>
            <span className="glass-pill" style={{ fontSize: '0.75rem' }}>
              Real-time Canvas Engine
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="btn-secondary"
              onClick={() => {
                onClose();
                onOpenSimulator(wallpaper);
              }}
              style={{ padding: '6px 12px', fontSize: '0.82rem' }}
            >
              <Smartphone size={14} />
              <span>Simulate</span>
            </button>
            <button className="modal-close-btn" style={{ position: 'static' }} onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Studio Workspace */}
        <div className="studio-layout">
          {/* Left Canvas Preview */}
          <div className="studio-canvas-wrap">
            <canvas ref={canvasRef} className="studio-canvas" />
          </div>

          {/* Right Controls Sidebar */}
          <div className="studio-controls-sidebar">
            {/* Aspect Preset Selector */}
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff', display: 'block', marginBottom: '8px' }}>
                Crop / Aspect Ratio:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {[
                  { id: 'original', label: 'Original' },
                  { id: '16:9', label: '16:9 Desktop' },
                  { id: '9:16', label: '9:16 Mobile' },
                  { id: '21:9', label: '21:9 Ultra' },
                  { id: '1:1', label: '1:1 Square' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAspectPreset(item.id)}
                    className="glass-pill"
                    style={{
                      justifyContent: 'center',
                      background: aspectPreset === item.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                      color: aspectPreset === item.id ? '#ffffff' : 'var(--text-muted)',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.76rem',
                      padding: '6px'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff', display: 'block', marginBottom: '8px' }}>
                Instant Style Presets:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <button className="tag-pill" onClick={() => applyPreset('amoled')}>🌌 AMOLED Deep</button>
                <button className="tag-pill" onClick={() => applyPreset('cyber')}>⚡ Cyber Neon</button>
                <button className="tag-pill" onClick={() => applyPreset('sunset')}>🌅 Sunset Warm</button>
                <button className="tag-pill" onClick={() => applyPreset('noir')}>🎬 Noir B&W</button>
                <button className="tag-pill" onClick={() => applyPreset('home_blur')}>📱 iOS/Android Home Blur</button>
                <button className="tag-pill" onClick={() => applyPreset('reset')}>🔄 Reset</button>
              </div>
            </div>

            {/* Adjustment Sliders */}
            <div className="filter-slider-group">
              <div className="slider-header">
                <span>Brightness</span>
                <span className="slider-val">{brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="custom-range"
              />
            </div>

            <div className="filter-slider-group">
              <div className="slider-header">
                <span>Contrast</span>
                <span className="slider-val">{contrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="160"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="custom-range"
              />
            </div>

            <div className="filter-slider-group">
              <div className="slider-header">
                <span>Saturation</span>
                <span className="slider-val">{saturation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="custom-range"
              />
            </div>

            <div className="filter-slider-group">
              <div className="slider-header">
                <span>Home Screen Blur</span>
                <span className="slider-val">{blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="custom-range"
              />
            </div>

            <div className="filter-slider-group">
              <div className="slider-header">
                <span>Vignette Darkness</span>
                <span className="slider-val">{vignette}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                value={vignette}
                onChange={(e) => setVignette(Number(e.target.value))}
                className="custom-range"
              />
            </div>

            <div className="filter-slider-group">
              <div className="slider-header">
                <span>Hue Color Shift</span>
                <span className="slider-val">{hueRotate}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={hueRotate}
                onChange={(e) => setHueRotate(Number(e.target.value))}
                className="custom-range"
              />
            </div>

            {/* Export Button */}
            <div style={{ marginTop: '10px' }}>
              <button
                className="btn-primary"
                onClick={handleExport}
                style={{ width: '100%', padding: '12px' }}
              >
                <Download size={18} />
                <span>Export Processed Wallpaper</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
