import React from 'react';
import { Search, Sparkles, Monitor, Smartphone, Sliders, X, Eye } from 'lucide-react';

export const HeroSpotlight = ({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  setOrientation,
  onSelectWallpaper,
  spotlightWallpaper
}) => {
  const quickTags = [
    "Cyberpunk City",
    "AMOLED Black",
    "Nordic Aurora",
    "3D Abstract Waves",
    "Tokyo Neon",
    "Anime Sunset",
    "Minimalist Sand"
  ];

  const heroImg = spotlightWallpaper?.src?.large2x || spotlightWallpaper?.src?.original || "https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=1920";

  return (
    <section className="hero-section">
      <div className="hero-card">
        {/* Dynamic Animated Background */}
        <img
          src={heroImg}
          alt="Featured Wallpaper Spotlight"
          className="hero-backdrop-img"
        />
        <div className="hero-gradient-overlay" />

        {/* Hero Content */}
        <div className="hero-content">
          <div className="hero-pill-badge">
            <Sparkles size={14} color="#38bdf8" />
            <span>Spotlight & Daily 4K Feature</span>
          </div>

          <h1 className="hero-title">
            Expressive <span>Wallpapers</span> for Desktop & Mobile
          </h1>

          <p className="hero-subtitle">
            Immerse your screens in curated 4K Ultra-HD landscape art and vivid 9:16 AMOLED mobile backgrounds with instant device simulation and in-browser studio editing.
          </p>

          {/* Search Bar Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearchSubmit(searchQuery);
            }}
            className="search-wrapper"
          >
            <Search size={20} color="var(--text-muted)" />
            <input
              type="text"
              className="search-input"
              placeholder="Search 4K, Cyberpunk, AMOLED, Nature, Anime, Minimalist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  onSearchSubmit('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={16} />
              </button>
            )}
            <button type="submit" className="search-btn">
              <span>Discover</span>
            </button>
          </form>

          {/* Quick Filter Tags */}
          <div className="quick-tags">
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginRight: '4px' }}>Trending:</span>
            {quickTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className="tag-pill"
                onClick={() => {
                  setSearchQuery(tag);
                  onSearchSubmit(tag);
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Quick Hero Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '22px', flexWrap: 'wrap' }}>
            <button
              className="btn-secondary"
              onClick={() => setOrientation('landscape')}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Monitor size={16} color="#38bdf8" />
              <span>Explore 4K Desktop</span>
            </button>
            <button
              className="btn-secondary"
              onClick={() => setOrientation('portrait')}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Smartphone size={16} color="#ec4899" />
              <span>Explore Mobile 9:16</span>
            </button>
            {spotlightWallpaper && (
              <button
                className="btn-primary"
                onClick={() => onSelectWallpaper(spotlightWallpaper)}
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                <Eye size={16} />
                <span>View Spotlight</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
