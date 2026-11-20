"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/app/admin/data";
import { shopCatalogKey, shopProductsSchema } from "@/lib/shopCatalog";

export async function saveShopCatalog(raw: unknown, expectedRevision: string | null) {
  const { admin } = await requireAdmin();
  const products = shopProductsSchema.safeParse(raw);
  if (!products.success) return { ok: false, error: products.error.issues[0]?.message ?? "Invalid product details." } as const;
  const revision = new Date().toISOString();
  const row = { value: products.data, updated_at: revision };
  const result = expectedRevision === null
    ? await admin.from("site_settings").insert({ key: shopCatalogKey, ...row }).select("updated_at").single()
    : await admin.from("site_settings").update(row).eq("key", shopCatalogKey).eq("updated_at", expectedRevision)
      .select("updated_at").maybeSingle();
  if (result.error?.code === "23505") {
    return { ok: false, error: "The shop changed since you opened it. Reload before saving again." } as const;
  }
  if (result.error) return { ok: false, error: "Could not save the shop catalog." } as const;
  if (!result.data) return { ok: false, error: "The shop changed since you opened it. Reload before saving again." } as const;
  revalidatePath("/shop");
  return { ok: true, revision: result.data.updated_at as string } as const;
}
