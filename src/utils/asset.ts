/**
 * Resolves a public-folder path like "/images/x.webp" against the site's base
 * URL, so images work both on a custom domain ("/") and on GitHub Pages
 * ("/gitanjali-tours-travels/"). Data files keep plain "/images/..." paths.
 */
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '');
}
