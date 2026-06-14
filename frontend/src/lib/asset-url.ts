/**
 * Resolves a relative backend storage URL to a full absolute URL.
 * Images stored by Laravel are like `/storage/products/xyz.jpg`.
 * In the browser, these need the backend origin prepended.
 */
export function assetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  // Already absolute
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';
  return `${backend}${path}`;
}
