import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo2,
  Redo2,
  Heading2,
  Heading3,
  Pilcrow,
  Minus,
} from "lucide-react";

interface ContentEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

// Strips tags to check for genuinely empty content — Tiptap's "empty" state
// still serializes to something like "<p></p>", which isn't empty by
// string length, so a plain .trim() check on the HTML would false-negative.
export function isRichTextEmpty(html: string) {
  const text = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  return text.length === 0;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      className={`h-8 w-8 p-0 ${active ? "bg-muted text-foreground" : "text-muted-foreground"}`}
    >
      {children}
    </Button>
  );
}

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 px-2 py-1.5">
      <ToolbarButton
        label="Paragraph"
        active={editor.isActive("paragraph")}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        <Pilcrow className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Inline code"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="h-4 w-4" />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Horizontal rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="h-4 w-4" />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton
        label="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}

export function ContentEditor({ value, onChange, placeholder }: ContentEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[220px] px-3 py-3 focus:outline-none " +
          "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 " +
          "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1.5 " +
          "[&_p]:mb-3 [&_p:last-child]:mb-0 " +
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 " +
          "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 " +
          "[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:mb-3 " +
          "[&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm " +
          "[&_pre]:bg-muted [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:mb-3 [&_pre]:overflow-x-auto " +
          "[&_hr]:my-4 [&_hr]:border-border",
      },
    },
    onUpdate: ({ editor }) => onChange(editor?.getHTML()),
  });

  // Keep the editor in sync when `value` changes from outside — e.g. an
  // existing post loading asynchronously after the editor has already
  // mounted with an empty string.
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;

    const html = value ?? "";

    if (editor.getHTML() !== html) {
      editor.commands.setContent(html, false);
    }
  }, [editor, value]);

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  const showPlaceholder = editor && isRichTextEmpty(editor.getHTML());

  return (
    <div className="relative rounded-lg border border-input bg-background overflow-hidden focus-within:ring-1 focus-within:ring-ring">
      <Toolbar editor={editor} />
      <div className="relative">
        {showPlaceholder && placeholder && (
          <span className="pointer-events-none absolute left-3 top-3 text-sm text-muted-foreground">
            {placeholder}
          </span>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
