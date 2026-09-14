import React, { useState } from 'react';
import { 
  Sparkles, 
  Monitor, 
  Smartphone, 
  Heart, 
  Maximize, 
  KeyRound, 
  Palette, 
  Grid2X2,
  Check
} from 'lucide-react';

export const Navbar = ({
  orientation,
  setOrientation,
  showFavoritesOnly,
  setShowFavoritesOnly,
  favoritesCount,
  onOpenApiKeyModal,
  onOpenZenMode,
  activeTheme,
  setActiveTheme,
  isLiveApi
}) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const themes = [
    { id: 'cyber-violet', name: 'Cyber Violet', color: '#8b5cf6' },
    { id: 'neon-cyan', name: 'Neon Cyan', color: '#06b6d4' },
    { id: 'sunset-ember', name: 'Sunset Ember', color: '#f97316' },
    { id: 'emerald-matrix', name: 'Emerald Matrix', color: '#10b981' },
    { id: 'amoled-void', name: 'AMOLED Void', color: '#18181b' }
  ];

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        {/* Brand */}
        <div 
          className="navbar-brand" 
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setShowFavoritesOnly(false);
            setOrientation('all');
          }}
        >
          <div className="brand-icon-wrap">
            <Sparkles size={20} color="#ffffff" />
          </div>
          <span>Lumina</span>
          <span className="brand-badge">4K Studio</span>
        </div>

        {/* Orientation Switcher Tabs */}
        <div className="orientation-toggle-group">
          <button
            className={`orientation-tab ${!showFavoritesOnly && orientation === 'all' ? 'active' : ''}`}
            onClick={() => {
              setShowFavoritesOnly(false);
              setOrientation('all');
            }}
          >
            <Grid2X2 size={15} />
            <span>All Media</span>
          </button>
          <button
            className={`orientation-tab ${!showFavoritesOnly && orientation === 'landscape' ? 'active' : ''}`}
            onClick={() => {
              setShowFavoritesOnly(false);
              setOrientation('landscape');
            }}
          >
            <Monitor size={15} />
            <span>🖥️ Desktop 4K</span>
          </button>
          <button
            className={`orientation-tab ${!showFavoritesOnly && orientation === 'portrait' ? 'active' : ''}`}
            onClick={() => {
              setShowFavoritesOnly(false);
              setOrientation('portrait');
            }}
          >
            <Smartphone size={15} />
            <span>📱 Mobile 9:16</span>
          </button>
        </div>

        {/* Right Actions Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Favorites Button */}
          <button
            className={`btn-icon ${showFavoritesOnly ? 'active' : ''}`}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            title="Saved Favorites"
            style={{ position: 'relative' }}
          >
            <Heart size={18} fill={showFavoritesOnly ? '#ffffff' : 'none'} />
            {favoritesCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#ec4899',
                  color: 'white',
                  borderRadius: '10px',
                  fontSize: '0.65rem',
                  padding: '1px 6px',
                  fontWeight: '700',
                  boxShadow: '0 0 8px rgba(236, 72, 153, 0.8)'
                }}
              >
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Theme Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn-icon"
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              title="Change Theme Accent"
            >
              <Palette size={18} />
            </button>

            {showThemeMenu && (
              <div
                className="glass-panel"
                style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: '190px',
                  padding: '8px',
                  zIndex: 60,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '4px 8px', fontWeight: 600 }}>
                  THEME ACCENTS
                </div>
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTheme(t.id);
                      setShowThemeMenu(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: activeTheme === t.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      border: 'none',
                      color: 'var(--text-main)',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.84rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: t.color,
                          boxShadow: `0 0 6px ${t.color}`
                        }}
                      />
                      <span>{t.name}</span>
                    </div>
                    {activeTheme === t.id && <Check size={14} color="var(--primary)" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Zen Ambient Mode */}
          <button
            className="btn-secondary"
            onClick={onOpenZenMode}
            title="Ambient Zen Screensaver Mode"
            style={{ padding: '8px 14px', fontSize: '0.84rem' }}
          >
            <Maximize size={15} />
            <span style={{ display: 'inline' }}>Zen Mode</span>
          </button>

          {/* Pexels API Key Configuration */}
          <button
            className="btn-secondary"
            onClick={onOpenApiKeyModal}
            title="Pexels API Settings"
            style={{
              padding: '8px 14px',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderColor: isLiveApi ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)'
            }}
          >
            <KeyRound size={15} color={isLiveApi ? '#10b981' : 'var(--text-muted)'} />
            <span style={{ fontSize: '0.82rem' }}>Pexels API</span>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: isLiveApi ? '#10b981' : '#8b5cf6',
                boxShadow: `0 0 8px ${isLiveApi ? '#10b981' : '#8b5cf6'}`
              }}
            />
          </button>
        </div>
      </div>
    </nav>
  );
};
