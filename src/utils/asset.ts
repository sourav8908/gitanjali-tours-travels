/**
 * Resolves a public-folder path like "/images/x.webp" against the site's base
 * URL, so images work both on a custom domain ("/") and on GitHub Pages
 * ("/gitanjali-tours-travels/"). Data URLs (photos uploaded in the demo admin)
 * and full URLs are returned unchanged.
 */
export function asset(path: string): string {
  if (/^(data:|https?:)/.test(path)) return path;
  return import.meta.env.BASE_URL + path.replace(/^\//, '');
}
