/**
 * Resolves a storage URL or path into a full, reachable media URL.
 * Supports absolute URLs, relative /uploads paths, persistent data URIs, and website static assets.
 */
export const getMediaUrl = (url?: string | null): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }

  // Known static client assets from the official live website
  if (
    url.includes('subakeerthii-portrait') ||
    url.includes('client-banner') ||
    url.includes('favicon')
  ) {
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `https://subakeerthii.in${cleanPath}`;
  }

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
  const backendBase = apiBase.replace(/\/api\/v1\/?$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${backendBase}${cleanPath}`;
};
