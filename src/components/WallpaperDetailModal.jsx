import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Heart, 
  Smartphone, 
  Monitor, 
  Sliders, 
  ExternalLink, 
  Share2, 
  Check, 
  Layers, 
  Info 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WallpaperDetailModal = ({
  wallpaper,
  onClose,
  onOpenSimulator,
  onOpenStudio,
  onToggleFavorite,
  isFav,
  onDownloadWithPreset
}) => {
  if (!wallpaper) return null;

  const isPortrait = wallpaper.orientation === 'portrait';
  const [selectedRes, setSelectedRes] = useState(
    isPortrait ? 'iphone' : '4k'
  );
  const [copied, setCopied] = useState(false);

  const desktopResolutions = [
    { id: '4k', title: '4K Ultra HD', dims: '3840 × 2160', aspect: '16:9', rec: 'Most 4K Displays' },
    { id: '2k', title: '2K Quad HD', dims: '2560 × 1440', aspect: '16:9', rec: '1440p Gaming / Mac' },
    { id: '1080p', title: 'Full HD', dims: '1920 × 1080', aspect: '16:9', rec: 'Standard Laptops' },
    { id: 'ultrawide', title: 'Ultrawide', dims: '3440 × 1440', aspect: '21:9', rec: 'Curved Monitors' },
    { id: 'original', title: 'Original Source', dims: `${wallpaper.width} × ${wallpaper.height}`, aspect: 'Raw', rec: 'Uncompressed' }
  ];

  const mobileResolutions = [
    { id: 'iphone', title: 'iPhone 16 / 15 Pro', dims: '1320 × 2868', aspect: '19.5:9', rec: 'OLED Super Retina' },
    { id: 'android', title: 'AMOLED 1440p', dims: '1440 × 3120', aspect: '19.5:9', rec: 'Samsung / Pixel' },
    { id: 'portrait_hd', title: 'Standard Mobile HD', dims: '1080 × 2400', aspect: '20:9', rec: 'All Smartphones' },
    { id: 'tablet', title: 'iPad / Tablet', dims: '2048 × 2732', aspect: '3:4', rec: 'Retina Tablets' },
    { id: 'original', title: 'Original Source', dims: `${wallpaper.width} × ${wallpaper.height}`, aspect: 'Raw', rec: 'Uncompressed' }
  ];

  const resolutionList = isPortrait ? mobileResolutions : desktopResolutions;

  const handleDownload = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 }
    });
    onDownloadWithPreset(wallpaper, selectedRes);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(wallpaper.src.original || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="detail-layout">
          {/* Left: High-Res Image View */}
          <div className="detail-preview-area">
            <img
              src={wallpaper.src.large2x || wallpaper.src.large || wallpaper.src.original}
              alt={wallpaper.title}
              className="detail-img"
            />
          </div>

          {/* Right: Actions, Metadata & Download Options */}
          <div className="detail-info-area">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className={`glass-pill ${isPortrait ? 'badge-mobile' : 'badge-4k'}`}>
                  {isPortrait ? <Smartphone size={13} color="#ec4899" /> : <Monitor size={13} color="#38bdf8" />}
                  <span>{wallpaper.resolution}</span>
                </span>
                <span className="glass-pill" style={{ fontSize: '0.78rem' }}>
                  {wallpaper.category}
                </span>
              </div>

              <h2 style={{ fontSize: '1.6rem', lineHeight: 1.2, color: '#ffffff', marginBottom: '10px' }}>
                {wallpaper.title}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                <span>Creator:</span>
                <a
                  href={wallpaper.photographer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                >
                  <span>{wallpaper.photographer}</span>
                  <ExternalLink size={13} />
                </a>
              </div>

              {/* Dominant Color */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Palette:</span>
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: wallpaper.avg_color,
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'inline-block'
                  }}
                />
                <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)' }}>
                  {wallpaper.avg_color}
                </span>
              </div>
            </div>

            {/* Resolution Selector */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#ffffff' }}>
                  Select Download Format:
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  High-res ready
                </span>
              </div>

              <div className="res-options-grid">
                {resolutionList.map((res) => (
                  <div
                    key={res.id}
                    className={`res-card ${selectedRes === res.id ? 'selected' : ''}`}
                    onClick={() => setSelectedRes(res.id)}
                  >
                    <div className="res-title">{res.title}</div>
                    <div className="res-sub">{res.dims} • {res.aspect}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                className="btn-primary"
                onClick={handleDownload}
                style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
              >
                <Download size={18} />
                <span>Download Wallpaper</span>
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 48px', gap: '8px' }}>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    onClose();
                    onOpenSimulator(wallpaper);
                  }}
                >
                  {isPortrait ? <Smartphone size={16} /> : <Monitor size={16} />}
                  <span>Live Simulator</span>
                </button>

                <button
                  className="btn-secondary"
                  onClick={() => {
                    onClose();
                    onOpenStudio(wallpaper);
                  }}
                >
                  <Sliders size={16} />
                  <span>Studio Filters</span>
                </button>

                <button
                  className={`btn-icon ${isFav ? 'active' : ''}`}
                  onClick={() => onToggleFavorite(wallpaper)}
                  title={isFav ? "Favorited" : "Favorite"}
                >
                  <Heart size={18} fill={isFav ? "#ffffff" : "none"} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
