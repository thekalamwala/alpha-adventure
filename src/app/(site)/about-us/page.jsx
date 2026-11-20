import fs from "fs";
import path from "path";
import AboutScripts from "@/components/AboutScripts";

const aboutHtmlPath = path.join(process.cwd(), "src/data/orig-about-us.html");
const aboutInit = fs.readFileSync(
  path.join(process.cwd(), "src/data/about-us-init.js"),
  "utf8"
);

export const metadata = { title: "About Us" };

// Serves the original about-us page body verbatim.
export default function AboutPage() {
  const aboutHtml = fs.readFileSync(aboutHtmlPath, "utf8");
  return (
    <>
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: aboutHtml }}
      />
      <AboutScripts initCode={aboutInit} />
    </>
  );
}
