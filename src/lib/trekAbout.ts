const formatMarker = "<!-- trek-about -->";
const allowedTag = /(<\/?(?:p|div|br|strong|b|em|i|u|s|strike|h[1-3]|ul|ol|li|blockquote|pre|code|hr|table|thead|tbody|tr|th|td)>|<\/a>|<a href="https?:\/\/[^"<>]+">)/gi;

function safeMarkup(html: string) {
  return html.split(allowedTag).map((part, index) =>
    index % 2 ? part : part.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
  ).join("");
}

export function trekAboutHtml(value: string) {
  if (value.startsWith(formatMarker)) return safeMarkup(value.slice(formatMarker.length));
  if (!value) return "";
  const text = value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replace(/\r?\n/g, "<br>");
  return `<p>${text}</p>`;
}

export function saveTrekAbout(html: string) {
  return formatMarker + safeMarkup(html);
}

// Rich text sits below a section heading on the public trek page.
export function trekSectionHtml(value: string) {
  const headingSizes = ["text-3xl", "text-2xl", "text-xl"];
  return trekAboutHtml(value).replace(/<(\/?)h([1-3])>/gi, (_, closing, level) => {
    const index = Number(level) - 1;
    const tag = `h${index + 4}`;
    return closing ? `</${tag}>` : `<${tag} class="${headingSizes[index]} text-left font-bold">`;
  });
}

export function trekAboutText(value: string) {
  if (!value.startsWith(formatMarker)) return value;
  return value.slice(formatMarker.length).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export const trekAboutStyles = "break-words [&_p]:mb-3 [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold [&_ul]:list-disc [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:pl-6 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_pre]:whitespace-pre-wrap [&_pre]:rounded [&_pre]:bg-slate-100 [&_pre]:p-3 [&_hr]:my-3 [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2 [&_a]:text-primary [&_a]:underline";
