import React from 'react';
import { 
  Heart, 
  Download, 
  Eye, 
  Smartphone, 
  Monitor, 
  Sliders, 
  ExternalLink 
} from 'lucide-react';

export const WallpaperCard = ({
  wallpaper,
  onSelect,
  onOpenSimulator,
  onOpenStudio,
  onToggleFavorite,
  isFav,
  onDirectDownload
}) => {
  const isPortrait = wallpaper.orientation === 'portrait';
  const imgUrl = isPortrait 
    ? (wallpaper.src.portrait || wallpaper.src.medium || wallpaper.src.large)
    : (wallpaper.src.landscape || wallpaper.src.medium || wallpaper.src.large);

  return (
    <div className="wallpaper-card">
      {/* Media Box */}
      <div 
        className={`card-media-wrapper ${isPortrait ? 'aspect-portrait' : 'aspect-landscape'}`}
        onClick={() => onSelect(wallpaper)}
      >
        <img
          src={imgUrl}
          alt={wallpaper.title}
          loading="lazy"
          className="card-image"
        />

        {/* Orientation & Resolution Badge */}
        <div className={`card-badge-top ${isPortrait ? 'badge-mobile' : 'badge-4k'}`}>
          {isPortrait ? (
            <>
              <Smartphone size={12} />
              <span>Mobile 9:16</span>
            </>
          ) : (
            <>
              <Monitor size={12} />
              <span>4K UHD</span>
            </>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          className={`card-fav-btn ${isFav ? 'is-fav' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(wallpaper);
          }}
          title={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={16} fill={isFav ? "#ffffff" : "none"} />
        </button>

        {/* Hover Action Overlay */}
        <div className="card-hover-overlay">
          <div className="card-action-row">
            <button
              className="card-action-btn btn-view"
              onClick={(e) => {
                e.stopPropagation();
                onOpenSimulator(wallpaper);
              }}
              title="Test in Device Simulator"
            >
              {isPortrait ? <Smartphone size={14} /> : <Monitor size={14} />}
              <span>Simulate</span>
            </button>

            <button
              className="card-action-btn btn-view"
              onClick={(e) => {
                e.stopPropagation();
                onOpenStudio(wallpaper);
              }}
              title="Edit in Wallpaper Studio"
            >
              <Sliders size={14} />
              <span>Studio</span>
            </button>

            <button
              className="card-action-btn btn-dl"
              onClick={(e) => {
                e.stopPropagation();
                onDirectDownload(wallpaper);
              }}
              title="Quick Download"
            >
              <Download size={14} />
              <span>Get</span>
            </button>
          </div>
        </div>
      </div>

      {/* Card Info Footer */}
      <div className="card-info">
        <div className="photographer-info">
          <div className="photographer-avatar">
            {wallpaper.photographer ? wallpaper.photographer.charAt(0).toUpperCase() : 'P'}
          </div>
          <a
            href={wallpaper.photographer_url}
            target="_blank"
            rel="noopener noreferrer"
            className="photographer-name"
            title={`Photographer: ${wallpaper.photographer}`}
          >
            {wallpaper.photographer}
          </a>
        </div>

        <div className="card-quick-actions">
          <button
            className="quick-icon-btn"
            onClick={() => onSelect(wallpaper)}
            title="Inspect Details"
          >
            <Eye size={16} />
          </button>
          <button
            className="quick-icon-btn"
            onClick={() => onDirectDownload(wallpaper)}
            title="Download Wallpaper"
          >
            <Download size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
