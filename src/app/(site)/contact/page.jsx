import fs from "fs";
import path from "path";
import ContactFormScripts from "@/components/ContactFormScripts";

export const metadata = { title: "Contact Us (Need Help?)" };

// Serves the original contact page body verbatim; ContactFormScripts wires the
// contact form to POST /api/leads so submissions are persisted.
export default function ContactPage() {
  const contactHtml = fs.readFileSync(
    path.join(process.cwd(), "src/data/orig-contact.html"),
    "utf8"
  );

  return (
    <>
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: contactHtml }}
      />
      <ContactFormScripts />
    </>
  );
}
