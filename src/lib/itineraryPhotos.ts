export const maxItineraryPhotos = 2;

export function readItineraryPhotos(value?: string | null): string[] {
  if (!value?.trim()) return [];
  if (!value.startsWith("[")) return [value.trim()];
  try {
    const photos: unknown = JSON.parse(value);
    if (Array.isArray(photos)) {
      return photos.filter((photo): photo is string => typeof photo === "string" && !!photo.trim())
        .map((photo) => photo.trim()).slice(0, maxItineraryPhotos);
    }
  } catch {
    // Ignore malformed photo arrays.
  }
  return [];
}

export function saveItineraryPhotos(value?: string | string[]): string | null {
  const photos = typeof value === "string"
    ? readItineraryPhotos(value)
    : (value ?? []).map((photo) => photo.trim()).filter(Boolean);
  if (photos.length < 2) return photos[0] ?? null;
  return JSON.stringify(photos.slice(0, maxItineraryPhotos));
}
