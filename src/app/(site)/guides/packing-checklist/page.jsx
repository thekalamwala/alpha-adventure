import fs from "fs";
import path from "path";
import PackingChecklistScripts from "@/components/PackingChecklistScripts";

const packingHtmlPath = path.join(process.cwd(), "src/data/orig-packing-checklist.html");
const packingInitPath = path.join(process.cwd(), "src/data/packing-checklist-init.js");

export const metadata = {
  title: "Packing Checklist",
  description:
    "The ultimate packing list for single-day Sahyadri treks, multi-day Himalayan expeditions, and camping.",
  keywords: "packing, list, checklist, luggage, clothes, gear",
};

// Serves the original packing-checklist page body verbatim.
export default function PackingChecklistPage() {
  const packingHtml = fs.readFileSync(packingHtmlPath, "utf8");
  const packingInit = fs.readFileSync(packingInitPath, "utf8");
  return (
    <>
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: packingHtml }}
      />
      <PackingChecklistScripts initCode={packingInit} />
    </>
  );
}
