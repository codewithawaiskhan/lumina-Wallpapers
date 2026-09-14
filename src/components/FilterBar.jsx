import React from 'react';
import { 
  CATEGORIES, 
  COLOR_PALETTES 
} from '../data/curatedWallpapers';
import { 
  Sparkles, 
  Zap, 
  Moon, 
  Layers, 
  Mountain, 
  Compass, 
  Feather, 
  Flame, 
  Grid,
  FilterX
} from 'lucide-react';

const iconMap = {
  Sparkles: Sparkles,
  Zap: Zap,
  Moon: Moon,
  Layers: Layers,
  Mountain: Mountain,
  Compass: Compass,
  Feather: Feather,
  Flame: Flame,
  Grid: Grid
};

export const FilterBar = ({
  activeCategory,
  setActiveCategory,
  activeColor,
  setActiveColor,
  totalResults,
  onResetFilters,
  orientation
}) => {
  const hasActiveFilters = activeCategory !== 'all' || activeColor !== 'all';

  return (
    <div className="filter-bar-container">
      <div className="filter-bar-content">
        {/* Categories Scrolling Strip */}
        <div className="categories-scroll">
          {CATEGORIES.map((cat) => {
            const IconComponent = iconMap[cat.icon] || Sparkles;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                className={`category-chip ${isActive ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <IconComponent size={15} color={isActive ? '#ffffff' : 'var(--primary)'} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Second Row: Color Filter & Status */}
        <div className="filter-row">
          {/* Color Palettes */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Color Tone:
            </span>
            <div className="color-filter-group">
              {COLOR_PALETTES.map((color) => {
                const isActive = activeColor === color.id;
                return (
                  <button
                    key={color.id}
                    className={`color-dot-btn ${isActive ? 'active' : ''}`}
                    style={{
                      background: color.hex,
                      border: isActive ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.2)'
                    }}
                    title={color.name}
                    onClick={() => setActiveColor(color.id)}
                  />
                );
              })}
            </div>
          </div>

          {/* Results Summary and Reset */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Showing <strong style={{ color: '#ffffff' }}>{totalResults}</strong> {orientation === 'landscape' ? '4K Desktop' : orientation === 'portrait' ? 'Mobile' : ''} Wallpapers
            </span>

            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="glass-pill"
                style={{ cursor: 'pointer', padding: '4px 10px', fontSize: '0.78rem' }}
              >
                <FilterX size={13} color="#ec4899" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
