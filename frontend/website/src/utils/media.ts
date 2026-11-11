/**
 * Resolves a media URL from database or config into an accessible browser URL.
 */
export const getMediaUrl = (url?: string | null): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }

  // If it's a website root public asset (like /subakeerthii-portrait.png)
  if (
    url.includes('subakeerthii-portrait') ||
    url.includes('client-banner') ||
    url.includes('favicon')
  ) {
    return url.startsWith('/') ? url : `/${url}`;
  }

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
  const backendBase = apiBase.replace(/\/api\/v1\/?$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${backendBase}${cleanPath}`;
};
