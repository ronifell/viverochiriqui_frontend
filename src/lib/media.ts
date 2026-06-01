import { apiBaseUrl } from './api';

/** Turn stored upload paths into a browser-loadable URL for the current API host. */
export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return '';

  if (url.startsWith('/uploads/')) {
    return `${apiBaseUrl}${url}`;
  }

  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith('/uploads/')) {
      return `${apiBaseUrl}${parsed.pathname}`;
    }
  } catch {
    // Relative or non-URL strings (e.g. external paths) fall through.
  }

  return url;
}
