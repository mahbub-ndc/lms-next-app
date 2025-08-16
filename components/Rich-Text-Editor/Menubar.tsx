import React, { useEffect, useState } from "react";
import { Editor } from "@tiptap/react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  ListIcon,
  ListOrdered,
  Strikethrough,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Toggle } from "../ui/toggle";

interface iEditorProps {
  editor: Editor | null;
}

import {
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
} from "lucide-react";

const headingIcons = {
  1: Heading1Icon,
  2: Heading2Icon,
  3: Heading3Icon,
  4: Heading4Icon,
  5: Heading5Icon,
  6: Heading6Icon,
};

export default function Menubar({ editor }: iEditorProps) {
  // local state to trigger re-render
  const [, setUpdate] = useState(0);

  useEffect(() => {
    if (!editor) return;

    // Listener to update component on selection or transaction changes
    const updateListener = () => setUpdate((x) => x + 1);

    editor.on("selectionUpdate", updateListener);
    editor.on("transaction", updateListener);

    return () => {
      editor.off("selectionUpdate", updateListener);
      editor.off("transaction", updateListener);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className=" border border-input border-x-0 border-t-0 rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center ">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              pressed={editor.isActive("bold")}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
              className={cn(
                editor.isActive("bold") && "bg-muted text-muted-foreground"
              )}
            >
              <Bold className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bold</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              pressed={editor.isActive("italic")}
              onPressedChange={() =>
                editor.chain().focus().toggleItalic().run()
              }
              className={cn(
                editor.isActive("italic") && "bg-muted text-muted-foreground"
              )}
            >
              <Italic className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Italic</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              pressed={editor.isActive("strike")}
              onPressedChange={() =>
                editor.chain().focus().toggleStrike().run()
              }
              className={cn(
                editor.isActive("strike") && "bg-muted text-muted-foreground"
              )}
            >
              <Strikethrough className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Strike</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          {([1, 2, 3, 4, 5, 6] as const).map((level) => {
            const Icon = headingIcons[level];
            return (
              <Tooltip key={level}>
                <TooltipTrigger asChild>
                  <Toggle
                    type="button"
                    pressed={editor.isActive("heading", { level })}
                    onPressedChange={() =>
                      editor.chain().focus().toggleHeading({ level }).run()
                    }
                    className={cn(
                      editor.isActive("heading", { level }) &&
                        "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Heading {level}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
          <TooltipTrigger asChild>
            <Toggle
              pressed={editor.isActive("bulletList")}
              onPressedChange={() =>
                editor.chain().focus().toggleBulletList().run()
              }
              className={cn(
                editor.isActive("bulletList") &&
                  "bg-muted text-muted-foreground"
              )}
            >
              <ListIcon className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bullet List</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              pressed={editor.isActive("orderedList")}
              onPressedChange={() =>
                editor.chain().focus().toggleOrderedList().run()
              }
              className={cn(
                editor.isActive("bulletList") &&
                  "bg-muted text-muted-foreground"
              )}
            >
              <ListOrdered className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ordered List</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="w-px h-6 bg-border mx-2"></div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={editor.isActive("leftAlign")}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("left").run()
            }
            className={cn(
              editor.isActive("leftAlign") && "bg-muted text-muted-foreground"
            )}
          >
            <AlignLeft className="h-4 w-4" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>Left Align</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={editor.isActive("center")}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("center").run()
            }
            className={cn(
              editor.isActive("center") && "bg-muted text-muted-foreground"
            )}
          >
            <AlignCenter className="h-4 w-4" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>Center Align</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={editor.isActive("right")}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("right").run()
            }
            className={cn(
              editor.isActive("right") && "bg-muted text-muted-foreground"
            )}
          >
            <AlignRight className="h-4 w-4" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>Right Align</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
