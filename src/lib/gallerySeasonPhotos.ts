import { z } from "zod";

export const gallerySeasonIds = ["summer", "monsoon", "winter", "spring"] as const;
export type GallerySeason = typeof gallerySeasonIds[number];

const seasonPhoto = z.object({
  src: z.string().trim().min(1).refine((src) => {
    if (/^\/(?!\/|\\)/.test(src)) return true;
    try {
      return ["https:", "http:"].includes(new URL(src).protocol);
    } catch {
      return false;
    }
  }, "Use an uploaded photo or a valid image URL."),
  alt: z.string().trim().max(200),
});

export const gallerySeasonPhotosSchema = z.partialRecord(z.enum(gallerySeasonIds), z.array(seasonPhoto));
export type GallerySeasonPhotos = z.infer<typeof gallerySeasonPhotosSchema>;
