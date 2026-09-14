import { CURATED_WALLPAPERS } from '../data/curatedWallpapers';

const API_KEY_STORAGE_KEY = 'lumina_pexels_api_key';
const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

export const getStoredApiKey = () => {
  return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
};

export const setStoredApiKey = (key) => {
  if (key && key.trim()) {
    localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
};

export const clearStoredApiKey = () => {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
};

export const testApiKey = async (apiKey) => {
  if (!apiKey || !apiKey.trim()) {
    return { success: false, message: 'API key cannot be empty' };
  }
  try {
    const res = await fetch(`${PEXELS_BASE_URL}/curated?per_page=1`, {
      headers: {
        Authorization: apiKey.trim()
      }
    });
    if (res.ok) {
      return { success: true, message: 'Connected to Pexels API successfully!' };
    } else {
      const data = await res.json().catch(() => ({}));
      return { 
        success: false, 
        message: data.error || `HTTP error ${res.status}: Invalid or unauthorized API key` 
      };
    }
  } catch (err) {
    return { success: false, message: `Network error: ${err.message}` };
  }
};

const normalizePexelsPhoto = (photo, requestedOrientation) => {
  const isPortrait = photo.height > photo.width || requestedOrientation === 'portrait';
  const orientation = isPortrait ? 'portrait' : 'landscape';
  const resolution = isPortrait 
    ? `Mobile (${photo.width}×${photo.height})` 
    : photo.width >= 3840 
      ? `4K UHD (${photo.width}×${photo.height})` 
      : `HD (${photo.width}×${photo.height})`;

  return {
    id: photo.id,
    title: photo.alt || (isPortrait ? "Aesthetic Mobile Wallpaper" : "Breathtaking 4K Desktop Wallpaper"),
    orientation,
    aspect_ratio: isPortrait ? "9:16" : "16:9",
    width: photo.width,
    height: photo.height,
    resolution,
    category: "Pexels Live",
    tags: (photo.alt ? photo.alt.toLowerCase().split(' ').slice(0, 5) : ["wallpaper", "hd", orientation]),
    avg_color: photo.avg_color || "#121422",
    photographer: photo.photographer || "Pexels Creator",
    photographer_url: photo.photographer_url || "https://www.pexels.com",
    src: {
      original: photo.src.original,
      large2x: photo.src.large2x,
      large: photo.src.large,
      medium: photo.src.medium,
      landscape: photo.src.landscape,
      portrait: photo.src.portrait,
      tiny: photo.src.tiny
    },
    views: `${Math.floor(Math.random() * 300 + 50)}K`,
    downloads: `${Math.floor(Math.random() * 70 + 10)}K`,
    likes: `${Math.floor(Math.random() * 20 + 2)}K`
  };
};

export const fetchWallpapers = async ({
  query = '',
  orientation = 'all', // 'all' | 'landscape' | 'portrait'
  category = 'all',
  color = 'all',
  page = 1,
  perPage = 18
}) => {
  const apiKey = getStoredApiKey();

  // If live API key is configured, perform Pexels fetch
  if (apiKey) {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('per_page', perPage.toString());

      if (orientation !== 'all') {
        params.append('orientation', orientation);
      }
      if (color !== 'all') {
        params.append('color', color);
      }

      let endpoint = '';
      let effectiveQuery = query.trim();

      if (!effectiveQuery && category !== 'all') {
        effectiveQuery = category === 'AMOLED Black' ? 'dark minimalist amoled' : category;
      }

      if (effectiveQuery) {
        params.append('query', effectiveQuery);
        endpoint = `${PEXELS_BASE_URL}/search?${params.toString()}`;
      } else {
        endpoint = `${PEXELS_BASE_URL}/curated?${params.toString()}`;
      }

      const res = await fetch(endpoint, {
        headers: {
          Authorization: apiKey
        }
      });

      if (res.ok) {
        const data = await res.json();
        const items = (data.photos || []).map((p) => normalizePexelsPhoto(p, orientation));
        return {
          wallpapers: items,
          total_results: data.total_results || items.length,
          page: data.page || page,
          next_page: data.next_page,
          isLiveApi: true
        };
      }
    } catch (err) {
      console.warn('Pexels live API call failed, falling back to curated library:', err);
    }
  }

  // Fallback to Curated Wallpapers Library
  let results = [...CURATED_WALLPAPERS];

  // Filter by orientation
  if (orientation !== 'all') {
    results = results.filter((w) => w.orientation === orientation);
  }

  // Filter by category
  if (category !== 'all') {
    results = results.filter(
      (w) => w.category.toLowerCase().includes(category.toLowerCase()) || 
             w.tags.some(t => t.toLowerCase().includes(category.toLowerCase()))
    );
  }

  // Filter by color
  if (color !== 'all') {
    results = results.filter((w) => 
      w.tags.some(t => t.toLowerCase().includes(color.toLowerCase())) ||
      (color === 'black' && w.category === 'AMOLED Black') ||
      (color === 'purple' && (w.avg_color.includes('2') || w.avg_color.includes('3')))
    );
  }

  // Filter by query
  if (query.trim()) {
    const q = query.toLowerCase();
    results = results.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q) ||
        w.photographer.toLowerCase().includes(q) ||
        w.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Pagination slice
  const startIndex = (page - 1) * perPage;
  const paginated = results.slice(startIndex, startIndex + perPage);

  return {
    wallpapers: paginated,
    total_results: results.length,
    page,
    next_page: startIndex + perPage < results.length ? page + 1 : null,
    isLiveApi: false
  };
};
