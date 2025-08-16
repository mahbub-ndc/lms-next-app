"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import Menubar from "./Menubar";
import { json } from "better-auth";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const headingClasses: Record<HeadingLevel, string> = {
  1: "text-4xl font-bold",
  2: "text-3xl font-bold",
  3: "text-2xl font-semibold",
  4: "text-xl font-semibold",
  5: "text-lg font-medium",
  6: "text-base font-medium",
};

export default function RichTextEditor({ field }: { field: any }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),

      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }).extend({
        renderHTML({ node, HTMLAttributes }) {
          const level = node.attrs.level as HeadingLevel;
          return [
            `h${level}`,
            { ...HTMLAttributes, class: headingClasses[level] },
            0,
          ];
        },
      }),
    ],

    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 focus:outline-none prose prose-sm sm: prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-[70%]",
      },
    },

    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
    content: field.value ? JSON.parse(field.value) : "<p>Hello world!</p>",
    immediatelyRender: false,
  });

  return (
    <div className="border border-input mt-0 dark:bg-input/30">
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
