import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { isPublicSupabaseConfigured, publicClient } from "@/lib/seo";
import { defaultGoogleReviewSettings, googleReviewSettingsKey, googleReviewSettingsSchema } from "@/lib/googleReviewSettings";

export const getGoogleReviewSettings = cache(unstable_cache(async () => {
  if (!isPublicSupabaseConfigured) return defaultGoogleReviewSettings;
  const { data } = await publicClient().from("site_settings")
    .select("value").eq("key", googleReviewSettingsKey).maybeSingle();
  const parsed = googleReviewSettingsSchema.safeParse(data?.value);
  return parsed.success ? parsed.data : defaultGoogleReviewSettings;
}, [googleReviewSettingsKey], { tags: [googleReviewSettingsKey], revalidate: 300 }));
