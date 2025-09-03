"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  GripVertical,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// -------------------- SortableItem --------------------
export interface sortableItemProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => React.ReactNode;
  className?: string;
  data?: {
    type: "chapter" | "lesson";
    chapterId?: string;
  };
}

export function SortableItem({
  children,
  id,
  className,
  data,
}: sortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn("touch-auto", className, isDragging ? "z-10" : "z-0")}
    >
      {children(listeners)}
    </div>
  );
}

// -------------------- Types --------------------
interface Lesson {
  id: string;
  title: string;
  description: string | null;
  position: number;
  thumbnailKey: string | null;
  videoKey: string | null;
}

interface Chapter {
  id: string;
  title: string;
  position: number;
  lessons: Lesson[];
}

export interface GetSingleCourseType {
  chapter: Chapter[];
  // other fields like level, etc.
}

interface iAppProps {
  data: GetSingleCourseType | null;
}

// -------------------- CourseContent --------------------
export default function CourseContent({ data }: iAppProps) {
  const initialData =
    data?.chapter?.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: false, // start collapsed
      lessons:
        chapter.lessons?.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          order: lesson.position,
          description: lesson.description,
          thumbnailKey: lesson.thumbnailKey,
          videoKey: lesson.videoKey,
        })) || [],
    })) || [];

  const [items, setItems] = useState(initialData);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function toggleOpen(chapterId: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === chapterId ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  }

  function handleDragEnd(event: { active: any; over: any }) {
    const { active, over } = event;
    if (!over) return;

    if (active.id === over.id) return;

    setItems((prev) => {
      // --- CASE 1: Reordering chapters ---
      if (
        active.data.current?.type === "chapter" &&
        over.data.current?.type === "chapter"
      ) {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      }

      // --- CASE 2: Reordering lessons inside the same chapter ---
      if (
        active.data.current?.type === "lesson" &&
        over.data.current?.type === "lesson"
      ) {
        const activeChapterId = active.data.current.chapterId;
        const overChapterId = over.data.current.chapterId;

        // only reorder inside SAME chapter
        if (activeChapterId === overChapterId) {
          return prev.map((chapter) => {
            if (chapter.id !== activeChapterId) return chapter;

            const oldIndex = chapter.lessons.findIndex(
              (l) => l.id === active.id
            );
            const newIndex = chapter.lessons.findIndex((l) => l.id === over.id);

            return {
              ...chapter,
              lessons: arrayMove(chapter.lessons, oldIndex, newIndex),
            };
          });
        }
      }

      return prev;
    });
  }

  if (!data) {
    return <div>No course data found.</div>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle>Chapters</CardTitle>
        </CardHeader>
        <CardContent>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((chapter) => (
              <SortableItem
                key={chapter.id}
                id={chapter.id}
                data={{ type: "chapter" }}
              >
                {(listeners) => (
                  <Card>
                    <Collapsible
                      open={chapter.isOpen}
                      onOpenChange={() => toggleOpen(chapter.id)}
                    >
                      <CardHeader className="flex flex-row items-center justify-between border-b">
                        <div className="flex flex-row items-center gap-2">
                          {/* Drag handle */}
                          <button {...listeners}>
                            <GripVertical size={20} />
                          </button>

                          {/* Toggle button */}
                          <button onClick={() => toggleOpen(chapter.id)}>
                            {chapter.isOpen ? (
                              <ChevronDown size={20} />
                            ) : (
                              <ChevronRight size={20} />
                            )}
                          </button>

                          <span className="text-muted-foreground hover:text-primary">
                            {chapter.title}
                          </span>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardHeader>

                      <CollapsibleContent className="p-2">
                        <SortableContext
                          items={chapter.lessons}
                          strategy={verticalListSortingStrategy}
                        >
                          {chapter.lessons.map((lesson) => (
                            <SortableItem
                              key={lesson.id}
                              id={lesson.id}
                              data={{ type: "lesson", chapterId: chapter.id }}
                            >
                              {(listeners) => (
                                <CardContent>
                                  <div className="flex flex-row items-center gap-2">
                                    {/* Drag handle */}
                                    <button {...listeners}>
                                      <GripVertical size={20} />
                                    </button>

                                    <span className="flex flex-row items-center gap-2 text-muted-foreground hover:text-primary">
                                      <FileText size={20} />
                                      {lesson.title}
                                    </span>
                                  </div>
                                </CardContent>
                              )}
                            </SortableItem>
                          ))}
                        </SortableContext>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
}
