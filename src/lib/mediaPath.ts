let RAW_BASE = import.meta.env.VITE_API_BASE_URL || '';
// If API base ends with /api or /api/..., strip it for static file serving
// e.g. https://domain.com/api -> https://domain.com
//      https://domain.com/api/v1 -> https://domain.com
const API_BASE = (() => {
  if (!RAW_BASE && typeof window !== 'undefined') return window.location.origin;
  try {
    const url = new URL(RAW_BASE);
    const segments = url.pathname.split('/').filter(Boolean);
    if (segments.length) {
      // Remove typical api segment patterns
      if (segments[0].toLowerCase() === 'api') {
        segments.shift();
      }
      // If next segment is version like v1, v2 etc AND static files not under it, drop it too
      if (segments[0] && /^v\d+$/i.test(segments[0])) {
        segments.shift();
      }
      url.pathname = segments.length ? '/' + segments.join('/') : '/';
    }
    // Ensure no trailing slash for consistent concatenation
    return url.origin + (url.pathname === '/' ? '' : url.pathname.replace(/\/$/, ''));
  } catch {
    return RAW_BASE.replace(/\/$/, '');
  }
})();

export function resolveMediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  // Normalize backslashes to forward slashes (Windows paths)
  path = path.replace(/\\+/g, '/');
  // Already absolute or protocol-relative
  if (/^(https?:)?\/\//i.test(path)) return path;
  // Handle possible double leading slashes cleanup
  const cleaned = path.replace(/^\/\/+/, '/');
  if (cleaned.startsWith('/uploads')) return `${API_BASE}${cleaned}`;
  if (cleaned.startsWith('uploads/')) return `${API_BASE}/${cleaned}`;
  // If path is something like images/foo.png or projects/3/file.jpg assume under /uploads/
  if (/^(images|projects|articles)\//i.test(cleaned)) {
    return `${API_BASE}/uploads/${cleaned}`.replace(/([^:]\/)\/+/g, '$1/');
  }
  // If path appears to be a file without protocol and API_BASE available
  if (/(png|jpe?g|gif|webp|mp4|webm)$/i.test(cleaned) && API_BASE) {
    // Try prefixing with base + '/'+ cleaned (avoid duplicate slashes)
    return `${API_BASE}/${cleaned.replace(/^\//,'')}`;
  }
  return cleaned; // fallback
}

export function normalizeProjectMedia<T extends { coverImage?: string; media?: { url: string }[] }>(project: T): T {
  return {
    ...project,
    coverImage: resolveMediaUrl(project.coverImage),
    media: project.media?.map(m => ({ ...m, url: resolveMediaUrl(m.url) || m.url }))
  };
}
