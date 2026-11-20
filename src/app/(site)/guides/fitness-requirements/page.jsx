import fs from "fs";
import path from "path";
import FitnessRequirementsScripts from "@/components/FitnessRequirementsScripts";

const fitnessHtmlPath = path.join(process.cwd(), "src/data/orig-fitness-requirements.html");
const fitnessInitPath = path.join(process.cwd(), "src/data/fitness-requirements-init.js");

export const metadata = {
  title: "Fitness Requirements",
  description:
    "Prepare for your trek with our guide on physical conditioning, cardio, and endurance exercises.",
  keywords: "fitness, prepare, exercise, physical, conditioning",
};

// Serves the original fitness-requirements page body verbatim.
export default function FitnessRequirementsPage() {
  const fitnessHtml = fs.readFileSync(fitnessHtmlPath, "utf8");
  const fitnessInit = fs.readFileSync(fitnessInitPath, "utf8");
  return (
    <>
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: fitnessHtml }}
      />
      <FitnessRequirementsScripts initCode={fitnessInit} />
    </>
  );
}
