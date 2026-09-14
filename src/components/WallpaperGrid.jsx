import React from 'react';
import { WallpaperCard } from './WallpaperCard';
import { Sparkles, RefreshCw, FolderHeart, ImageOff } from 'lucide-react';

export const WallpaperGrid = ({
  wallpapers,
  loading,
  onSelectWallpaper,
  onOpenSimulator,
  onOpenStudio,
  onToggleFavorite,
  favorites,
  onDirectDownload,
  orientation,
  showFavoritesOnly,
  onResetFilters,
  onLoadMore,
  hasMore
}) => {
  const isFav = (id) => favorites.some((f) => f.id === id);

  if (loading && wallpapers.length === 0) {
    return (
      <div className="grid-container">
        <div className={`wallpaper-grid ${orientation === 'portrait' ? 'mobile-view' : orientation === 'landscape' ? 'desktop-view' : ''}`}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-lg)',
                aspectRatio: orientation === 'portrait' ? '9/16' : '16/9',
                background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite'
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (wallpapers.length === 0) {
    return (
      <div className="grid-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div 
          className="glass-panel" 
          style={{ 
            maxWidth: '520px', 
            margin: '0 auto', 
            padding: '40px 24px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '16px' 
          }}
        >
          {showFavoritesOnly ? (
            <>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(236,72,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FolderHeart size={28} color="#ec4899" />
              </div>
              <h3>No Favorite Wallpapers Yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Click the heart icon on any desktop or mobile wallpaper to build your personal moodboard collection.
              </p>
            </>
          ) : (
            <>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ImageOff size={28} color="var(--primary)" />
              </div>
              <h3>No Wallpapers Found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No wallpapers match your current search or filters. Try adjusting your query or resetting filters.
              </p>
              <button
                className="btn-primary"
                onClick={onResetFilters}
                style={{ marginTop: '8px' }}
              >
                <RefreshCw size={16} />
                <span>Reset All Filters</span>
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <section className="grid-container">
      <div className={`wallpaper-grid ${orientation === 'portrait' ? 'mobile-view' : orientation === 'landscape' ? 'desktop-view' : ''}`}>
        {wallpapers.map((wallpaper) => (
          <WallpaperCard
            key={wallpaper.id}
            wallpaper={wallpaper}
            onSelect={onSelectWallpaper}
            onOpenSimulator={onOpenSimulator}
            onOpenStudio={onOpenStudio}
            onToggleFavorite={onToggleFavorite}
            isFav={isFav(wallpaper.id)}
            onDirectDownload={onDirectDownload}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && !showFavoritesOnly && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
          <button
            className="btn-secondary"
            onClick={onLoadMore}
            disabled={loading}
            style={{ padding: '12px 32px', fontSize: '0.95rem' }}
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="spin-animate" />
                <span>Loading more art...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} color="var(--primary)" />
                <span>Load More Wallpapers</span>
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
};
