//@ts-nocheck
"use client";
import { Bold, Italic, List, ListOrdered, Strikethrough } from "lucide-react";

import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

const Toolbar = ({ editor, className }) => {
  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex h-10 w-full  bg-transparent px-3 py-1 text-sm  border-b transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium text-colorVariant-subHeading font-medium placeholder:text-muted-foreground placeholder:font-normal focus:border-input focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        aria-label="Toggle italic"
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Toggle italic"
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        aria-label="Toggle italic"
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Toggle italic"
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Toggle italic"
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
    </div>
  );
};

export default Toolbar;
