"use client";

import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { closeHistory } from "@tiptap/pm/history";
import { TextSelection } from "@tiptap/pm/state";
import { canSplit } from "@tiptap/pm/transform";
import StarterKit from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table";
import { Bold, Eraser, Heading1, Heading2, Heading3, Italic, List, ListOrdered, Pilcrow, Redo2, Strikethrough, Table2, Underline, Undo2 } from "lucide-react";
import { saveTrekAbout, trekAboutHtml, trekAboutStyles } from "@/lib/trekAbout";

type Command = "bold" | "italic" | "underline" | "strike" | "paragraph" | "h1" | "h2" | "h3"
  | "bulletList" | "orderedList" | "table" | "clear" | "undo" | "redo";

const toolbarGroups = [
  [
    { label: "Bold", command: "bold", icon: Bold },
    { label: "Italic", command: "italic", icon: Italic },
    { label: "Underline", command: "underline", icon: Underline },
    { label: "Strikethrough", command: "strike", icon: Strikethrough },
  ],
  [
    { label: "Paragraph", command: "paragraph", icon: Pilcrow },
    { label: "H1", command: "h1", icon: Heading1 },
    { label: "H2", command: "h2", icon: Heading2 },
    { label: "H3", command: "h3", icon: Heading3 },
  ],
  [
    { label: "Bullets", command: "bulletList", icon: List },
    { label: "Numbered list", command: "orderedList", icon: ListOrdered },
    { label: "Table", command: "table", icon: Table2 },
  ],
  [
    { label: "Clear formatting", command: "clear", icon: Eraser },
    { label: "Undo", command: "undo", icon: Undo2 },
    { label: "Redo", command: "redo", icon: Redo2 },
  ],
] as const;

const extensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    link: { autolink: false, linkOnPaste: false, openOnClick: false },
  }),
  TableKit,
];

function serializeContent(html: string) {
  if (!html.includes("<table")) return saveTrekAbout(html);
  // Column widths are editor presentation data. Keep the table structure
  // and text in the same allowlisted HTML format as existing About content.
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("table colgroup").forEach((group) => group.remove());
  doc.querySelectorAll("table, th, td").forEach((cell) => {
    for (const name of cell.getAttributeNames()) cell.removeAttribute(name);
  });
  return saveTrekAbout(doc.body.innerHTML);
}

export default function TrekAboutEditor({ value, onChange, label = "About", accessibleLabel = "About trek" }: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  accessibleLabel?: string;
}) {
  const editor = useEditor({
    extensions,
    content: trekAboutHtml(value),
    immediatelyRender: false,
    enableInputRules: false,
    enablePasteRules: false,
    editorProps: {
      attributes: {
        role: "textbox",
        "aria-label": accessibleLabel,
        "aria-multiline": "true",
        class: `min-h-32 select-text bg-white p-3 text-sm focus:outline focus:outline-2 focus:outline-primary ${trekAboutStyles}`,
      },
      handlePaste(view, event) {
        if (!event.clipboardData?.types.includes("text/html")) return false;
        view.pasteText(event.clipboardData.getData("text/plain"));
        return true;
      },
      handleDrop: () => true,
    },
    onCreate: ({ editor }) => {
      if (editor.isEmpty) editor.commands.setBold();
    },
    onUpdate: ({ editor }) => {
      onChange(editor.isEmpty ? "" : serializeContent(editor.getHTML()));
    },
  });

  const toolbar = useEditorState({
    editor,
    selector: ({ editor }) => editor && ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      strike: editor.isActive("strike"),
      paragraph: editor.isActive("paragraph") && !editor.isActive("listItem"),
      h1: editor.isActive("heading", { level: 1 }),
      h2: editor.isActive("heading", { level: 2 }),
      h3: editor.isActive("heading", { level: 3 }),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      table: editor.isActive("table"),
      undo: editor.can().undo(),
      redo: editor.can().redo(),
    }),
  });

  function format(command: Command) {
    if (!editor) return;
    const chain = editor.chain().focus();
    if (command === "undo") return chain.undo().run();
    if (command === "redo") return chain.redo().run();
    chain.command(({ tr }) => { closeHistory(tr); return true; });

    switch (command) {
      case "bold": return chain.toggleBold().run();
      case "italic": return chain.toggleItalic().run();
      case "underline": return chain.toggleUnderline().run();
      case "strike": return chain.toggleStrike().run();
      case "paragraph":
      case "h1":
      case "h2":
      case "h3": {
        if (editor.isActive("listItem")) chain.liftListItem("listItem");
        if (command === "paragraph") return chain.setParagraph().run();
        const level = command === "h1" ? 1 : command === "h2" ? 2 : 3;
        return chain.command(({ tr }) => {
          const { from, to, empty } = tr.selection;
          if (empty) return true;
          let start = from;
          let end = to;
          // Split the trailing edge first so it cannot move the leading edge.
          const $to = tr.doc.resolve(to);
          if ($to.parent.isTextblock && $to.parentOffset > 0
            && $to.parentOffset < $to.parent.content.size && canSplit(tr.doc, to)) {
            tr.split(to);
          }
          const $from = tr.doc.resolve(from);
          if ($from.parent.isTextblock && $from.parentOffset > 0
            && $from.parentOffset < $from.parent.content.size && canSplit(tr.doc, from)) {
            const mappingStart = tr.mapping.maps.length;
            tr.split(from);
            const split = tr.mapping.slice(mappingStart);
            start = split.map(from, 1);
            end = split.map(to, 1);
          }
          tr.setSelection(TextSelection.between(tr.doc.resolve(start), tr.doc.resolve(end)));
          return true;
        }).toggleHeading({ level }).run();
      }
      case "bulletList":
      case "orderedList":
        if (editor.isActive("heading")) chain.setParagraph();
        return (command === "bulletList" ? chain.toggleBulletList() : chain.toggleOrderedList()).run();
      case "table": return chain.insertTable({ rows: 2, cols: 2, withHeaderRow: false }).run();
      case "clear": return chain.unsetAllMarks().clearNodes().run();
    }
  }

  return (
    <div className="grid min-w-0 gap-1.5">
      <div className="text-xs font-semibold text-ink">
        {label} <span className="ml-1 font-normal text-gray-400">· shown on the trek page</span>
      </div>
      <div className="overflow-hidden rounded-lg border border-line">
        <div className="flex flex-wrap items-center gap-y-1 border-b border-line bg-white p-2" role="group" aria-label={`${label} formatting`}>
          {toolbarGroups.map((group, index) => (
            <div key={group[0].label} className={`flex items-center gap-0.5 px-1 ${index > 0 ? "border-l border-line" : ""}`}>
              {group.map(({ label, command, icon: Icon }) => {
                const history = command === "undo" || command === "redo";
                const toggle = !history && command !== "clear";
                return (
                  <button key={label} type="button" aria-label={label} title={label}
                    aria-pressed={toggle ? !!toolbar?.[command] : undefined}
                    disabled={!editor || (history && !toolbar?.[command])}
                    className="grid h-8 w-8 place-items-center rounded text-gray-600 hover:bg-slate-100 hover:text-ink focus-visible:outline focus-visible:outline-primary aria-pressed:bg-primary/10 aria-pressed:text-primary disabled:opacity-40"
                    onMouseDown={(event) => event.preventDefault()} onClick={() => format(command)}>
                    <Icon size={17} aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <EditorContent editor={editor} className="min-h-32" />
      </div>
    </div>
  );
}
