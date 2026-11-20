import fs from "fs";
import path from "path";
import ProgrammePageBody from "@/components/layout/ProgrammePageBody";

const studentHtml = fs.readFileSync(
  path.join(process.cwd(), "src/data/orig-student-programmes.html"),
  "utf8"
);

export const metadata = {
  title: "Student Programmes",
  description:
    "Safe, educational, and fun adventure camps, nature walks, and heritage treks for schools and colleges.",
  keywords: "student, school, college, camp, education, nature",
};

// Serves the student-programmes page body verbatim.
export default function StudentProgrammesPage() {
  return <ProgrammePageBody html={studentHtml} />;
}
