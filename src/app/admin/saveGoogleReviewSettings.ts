"use server";

import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/app/admin/data";
import { googleReviewSettingsKey, googleReviewSettingsSchema } from "@/lib/googleReviewSettings";

export async function saveGoogleReviewSettings(input: unknown) {
  const { admin } = await requireAdmin();
  const parsed = googleReviewSettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Enter a rating from 1 to 5 and a whole review count of zero or more." } as const;

  const { error } = await admin.from("site_settings").upsert({
    key: googleReviewSettingsKey,
    value: parsed.data,
    updated_at: new Date().toISOString(),
  });
  if (error) return { ok: false, error: "Could not save Google review settings." } as const;

  revalidateTag(googleReviewSettingsKey);
  return { ok: true } as const;
}
