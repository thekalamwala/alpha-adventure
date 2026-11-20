import fs from "fs";
import path from "path";
import { getGoogleReviewSettings } from "@/lib/getGoogleReviewSettings";
import { formatGoogleReviews } from "@/lib/googleReviewSettings";

const footerHtml = fs.readFileSync(
  path.join(process.cwd(), "src/data/orig-footer.html"),
  "utf8"
);

export default async function SiteFooter() {
  const reviews = formatGoogleReviews(await getGoogleReviewSettings());
  return (
    <div
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: footerHtml.replace("<!-- google-reviews -->", reviews) }}
    />
  );
}
