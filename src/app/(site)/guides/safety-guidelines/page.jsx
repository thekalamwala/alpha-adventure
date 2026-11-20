import fs from "fs";
import path from "path";
import SafetyGuidelinesScripts from "@/components/SafetyGuidelinesScripts";

const htmlPath = path.join(process.cwd(), "src/data/orig-safety-guidelines.html");
const initPath = path.join(process.cwd(), "src/data/safety-guidelines-init.js");

export const metadata = {
  title: "Safety Guidelines",
  description:
    "Our detailed safety protocols, emergency response plans, and safety measures on trails.",
  keywords: "safety, guidelines, rescue, emergency, first-aid",
};

// Serves the original safety-guidelines page body verbatim.
export default function SafetyGuidelinesPage() {
  const safetyHtml = fs.readFileSync(htmlPath, "utf8");
  const safetyInit = fs.readFileSync(initPath, "utf8");
  return (
    <>
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: safetyHtml }}
      />
      <SafetyGuidelinesScripts initCode={safetyInit} />
    </>
  );
}
