//@ts-nocheck
"use client";

import React, { forwardRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import HardBreak from "@tiptap/extension-hard-break";
import Toolbar from "@/components/ui/tiptap/toolbar";


// Define the props interface
interface TiptapProps {
  textContent: string;
  onChange: (html: string) => void;
  className?: string;
}

// Use `HTMLDivElement` type for the ref
const TiptapTextContent = forwardRef<HTMLDivElement, TiptapProps>(
  ({ textContent, onChange, className }, ref) => {
    const editor = useEditor({
      editorProps: {
        attributes: {
          placeholder: "Type here...",
          class:
            "min-h-[150px] max-h-[150px] w-full rounded-md rounded-br-none rounded-bl-none border border-input bg-transparent px-3 py-2 border-b-0 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto",
        },
      },
      extensions: [
        StarterKit.configure({
          orderedList: {
            HTMLAttributes: {
              class: "list-decimal pl-4",
            },
          },
          bulletList: {
            HTMLAttributes: {
              class: "list-disc pl-4",
            },
          },
        }),
        HardBreak.extend({
          addKeyboardShortcuts() {
            return {
              Enter: () => this.editor.commands.setHardBreak(),
            };
          },
        }),
      ],
      content: `<div>${textContent}</div>`, // Set the initial content with the provided value
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML()); // Call the onChange callback with the updated HTML content
      },
      immediatelyRender: false,
    });

    return (
      <div
        ref={ref}
        className={`flex min-h-[250px] flex-col justify-stretch rounded-lg border border-input ${className}`}
      >
        <Toolbar editor={editor} className={""} />
        <EditorContent editor={editor} className="mt-2 bg-white border-none" />
      </div>
    );
  }
);

TiptapTextContent.displayName = "Tiptap";

export default TiptapTextContent;
