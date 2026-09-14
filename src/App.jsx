import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSpotlight } from './components/HeroSpotlight';
import { FilterBar } from './components/FilterBar';
import { WallpaperGrid } from './components/WallpaperGrid';
import { WallpaperDetailModal } from './components/WallpaperDetailModal';
import { DeviceSimulatorModal } from './components/DeviceSimulatorModal';
import { WallpaperStudioModal } from './components/WallpaperStudioModal';
import { ZenScreensaver } from './components/ZenScreensaver';
import { ApiKeyModal } from './components/ApiKeyModal';

import { 
  fetchWallpapers, 
  getStoredApiKey 
} from './services/pexelsApi';
import { 
  getFavorites, 
  saveFavorite, 
  getSavedTheme, 
  saveTheme 
} from './services/favoritesStorage';

import { CheckCircle2, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  // Theme & API key state
  const [activeTheme, setActiveTheme] = useState(() => getSavedTheme());
  const [isLiveApi, setIsLiveApi] = useState(() => Boolean(getStoredApiKey()));

  // Core Feed Filter States
  const [orientation, setOrientation] = useState('all'); // 'all' | 'landscape' | 'portrait'
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeColor, setActiveColor] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Wallpaper Data State
  const [wallpapers, setWallpapers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);

  // Spotlight Wallpaper for Hero
  const [spotlightWallpaper, setSpotlightWallpaper] = useState(null);

  // Favorites & Collections
  const [favorites, setFavorites] = useState(() => getFavorites());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Modals
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);
  const [simulatorWallpaper, setSimulatorWallpaper] = useState(null);
  const [studioWallpaper, setStudioWallpaper] = useState(null);
  const [showZenMode, setShowZenMode] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync Theme with document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme);
    saveTheme(activeTheme);
  }, [activeTheme]);

  // Load Initial & Filtered Wallpapers
  const loadWallpapers = useCallback(async (pageNum = 1, isAppend = false) => {
    setLoading(true);
    try {
      const res = await fetchWallpapers({
        query: searchQuery,
        orientation,
        category: activeCategory,
        color: activeColor,
        page: pageNum,
        perPage: 18
      });

      if (isAppend) {
        setWallpapers((prev) => [...prev, ...res.wallpapers]);
      } else {
        setWallpapers(res.wallpapers);
        if (res.wallpapers.length > 0 && !spotlightWallpaper) {
          setSpotlightWallpaper(res.wallpapers[0]);
        }
      }

      setTotalResults(res.total_results);
      setHasMore(Boolean(res.next_page));
      setIsLiveApi(res.isLiveApi);
    } catch (err) {
      console.error('Failed to load wallpapers', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, orientation, activeCategory, activeColor, spotlightWallpaper]);

  // Fetch when filters change
  useEffect(() => {
    if (!showFavoritesOnly) {
      setPage(1);
      loadWallpapers(1, false);
    }
  }, [orientation, activeCategory, activeColor, showFavoritesOnly, loadWallpapers]);

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    setPage(1);
    loadWallpapers(1, false);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setActiveColor('all');
    setOrientation('all');
    setShowFavoritesOnly(false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadWallpapers(nextPage, true);
  };

  // Favorites Management
  const handleToggleFavorite = (wp) => {
    const updated = saveFavorite(wp);
    setFavorites(updated);
    const exists = updated.some((f) => f.id === wp.id);
    if (exists) {
      showToast(`Added "${wp.title.slice(0, 24)}..." to favorites!`);
    } else {
      showToast(`Removed from favorites`);
    }
  };

  // Direct Download Engine
  const handleDirectDownload = async (wallpaper, presetId = 'original') => {
    showToast(`Preparing high-res download for "${wallpaper.title}"...`);
    
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });

    try {
      const sourceUrl = wallpaper.src.original || wallpaper.src.large2x || wallpaper.src.large;
      
      // Fetch as blob to trigger native file save
      const res = await fetch(sourceUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `lumina-wallpaper-${wallpaper.id}-${presetId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      showToast(`Wallpaper downloaded successfully! 🎉`);
    } catch (e) {
      // Fallback open in new tab if CORS prevents direct blob download
      window.open(wallpaper.src.original, '_blank');
      showToast(`Wallpaper opened in full resolution tab.`);
    }
  };

  // Active wallpapers feed based on favorites tab
  const displayedWallpapers = showFavoritesOnly ? favorites : wallpapers;

  return (
    <div className="app-container">
      {/* Ambient Animated Gradient Orbs */}
      <div className="ambient-glow-bg">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>

      {/* Navigation Header */}
      <Navbar
        orientation={orientation}
        setOrientation={setOrientation}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        favoritesCount={favorites.length}
        onOpenApiKeyModal={() => setShowApiKeyModal(true)}
        onOpenZenMode={() => setShowZenMode(true)}
        activeTheme={activeTheme}
        setActiveTheme={setActiveTheme}
        isLiveApi={isLiveApi}
      />

      {/* Parallax Hero Spotlight (Shown in standard explore mode) */}
      {!showFavoritesOnly && (
        <HeroSpotlight
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          setOrientation={setOrientation}
          onSelectWallpaper={setSelectedWallpaper}
          spotlightWallpaper={spotlightWallpaper || displayedWallpapers[0]}
        />
      )}

      {/* Filters & Category Strip */}
      {!showFavoritesOnly && (
        <FilterBar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          activeColor={activeColor}
          setActiveColor={setActiveColor}
          totalResults={totalResults}
          onResetFilters={handleResetFilters}
          orientation={orientation}
        />
      )}

      {/* Favorites Banner if in favorites view */}
      {showFavoritesOnly && (
        <div style={{ maxWidth: '1440px', margin: '30px auto 0', padding: '0 24px', width: '100%' }}>
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={20} fill="#ffffff" color="#ffffff" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: '#ffffff', margin: 0 }}>Your Curated Moodboard</h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {favorites.length} saved 4K & Mobile wallpapers
                </span>
              </div>
            </div>
            <button
              className="btn-secondary"
              onClick={() => setShowFavoritesOnly(false)}
            >
              Browse All Wallpapers
            </button>
          </div>
        </div>
      )}

      {/* Main Wallpaper Responsive Grid */}
      <WallpaperGrid
        wallpapers={displayedWallpapers}
        loading={loading}
        onSelectWallpaper={setSelectedWallpaper}
        onOpenSimulator={setSimulatorWallpaper}
        onOpenStudio={setStudioWallpaper}
        onToggleFavorite={handleToggleFavorite}
        favorites={favorites}
        onDirectDownload={handleDirectDownload}
        orientation={orientation}
        showFavoritesOnly={showFavoritesOnly}
        onResetFilters={handleResetFilters}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
      />

      {/* Wallpaper Detail & Download Modal */}
      {selectedWallpaper && (
        <WallpaperDetailModal
          wallpaper={selectedWallpaper}
          onClose={() => setSelectedWallpaper(null)}
          onOpenSimulator={setSimulatorWallpaper}
          onOpenStudio={setStudioWallpaper}
          onToggleFavorite={handleToggleFavorite}
          isFav={favorites.some((f) => f.id === selectedWallpaper.id)}
          onDownloadWithPreset={handleDirectDownload}
        />
      )}

      {/* Live Device Simulator Modal */}
      {simulatorWallpaper && (
        <DeviceSimulatorModal
          wallpaper={simulatorWallpaper}
          onClose={() => setSimulatorWallpaper(null)}
          onOpenStudio={setStudioWallpaper}
        />
      )}

      {/* Wallpaper Studio Image Editor Modal */}
      {studioWallpaper && (
        <WallpaperStudioModal
          wallpaper={studioWallpaper}
          onClose={() => setStudioWallpaper(null)}
          onOpenSimulator={setSimulatorWallpaper}
        />
      )}

      {/* Zen Fullscreen Screensaver */}
      {showZenMode && (
        <ZenScreensaver
          wallpapers={displayedWallpapers.length > 0 ? displayedWallpapers : wallpapers}
          onClose={() => setShowZenMode(false)}
        />
      )}

      {/* Pexels API Key Configuration Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onKeyUpdated={() => {
          setIsLiveApi(Boolean(getStoredApiKey()));
          loadWallpapers(1, false);
        }}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="toast-banner">
          <Sparkles size={18} color="var(--primary)" />
          <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
