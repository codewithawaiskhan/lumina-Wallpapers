const FAVORITES_STORAGE_KEY = 'lumina_wallpaper_favorites';
const THEME_STORAGE_KEY = 'lumina_active_theme';

export const getFavorites = () => {
  try {
    const data = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to parse favorites from localStorage', e);
    return [];
  }
};

export const saveFavorite = (wallpaper) => {
  const current = getFavorites();
  const exists = current.some((item) => item.id === wallpaper.id);
  let updated;
  if (exists) {
    updated = current.filter((item) => item.id !== wallpaper.id);
  } else {
    updated = [wallpaper, ...current];
  }
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const isFavorite = (id) => {
  const current = getFavorites();
  return current.some((item) => item.id === id);
};

export const getSavedTheme = () => {
  return localStorage.getItem(THEME_STORAGE_KEY) || 'cyber-violet';
};

export const saveTheme = (theme) => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};
