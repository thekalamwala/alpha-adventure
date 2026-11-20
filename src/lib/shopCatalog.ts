import { z } from "zod";

export const shopCatalogKey = "shop_catalog";
export const shopCategories = ["fashion", "apparel", "collection", "accessories"] as const;

const productSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/).max(80),
  name: z.string().trim().min(1, "Product name is required.").max(160),
  category: z.enum(shopCategories),
  price: z.number().min(0).max(1_000_000).refine((n) => Math.abs(Math.round(n * 100) - n * 100) < 0.00001),
  image: z.string().trim().refine((src) => /^\/(?![\/\\])/.test(src) || /^https?:\/\/[^\s]+$/i.test(src), "Upload a photo or enter a valid image URL."),
  description: z.string().trim().max(3000),
  specs: z.string().trim().max(3000),
});

export const shopProductsSchema = z.array(productSchema).superRefine((products, ctx) => {
  if (new Set(products.map(({ id }) => id)).size !== products.length) {
    ctx.addIssue({ code: "custom", message: "Product identifiers must be unique." });
  }
});
export type ShopProduct = z.infer<typeof productSchema>;
