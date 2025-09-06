"use client";

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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import {
  GetSingleCourseType,
  ReorderCourseContent,
} from "../../../getCourse/GetSingleCourse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  GripVertical,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// -----------------------------
// TypeScript types
// -----------------------------
type Lesson = {
  id: string;
  title: string;
  videoKey?: string | null;
  description?: string | null;
  thumbnailKey?: string | null;
  order: number;
};

type Chapter = {
  id: string;
  title: string;
  order: number;
  isOpen: boolean;
  lessons: Lesson[];
};

interface iAppProps {
  data: GetSingleCourseType;
}

export interface SortableItemProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => React.ReactNode;
  className?: string;
  data?: {
    type: "chapter" | "lesson";
    chapterId?: string;
  };
}

// -----------------------------
// Component
// -----------------------------
export default function CourseContent({ data }: iAppProps) {
  const initialItems: Chapter[] =
    data?.chapter.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true,
      lessons: chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        videoKey: lesson.videoKey,
        description: lesson.description,
        thumbnailKey: lesson.thumbnailKey,
        order: lesson.position,
      })),
    })) || [];

  const [items, setItems] = useState<Chapter[]>(initialItems);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // -----------------------------
  // SortableItem helper
  // -----------------------------
  function SortableItem({ id, children, className, data }: SortableItemProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id, data });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn(
          "touch-none",
          className,
          isDragging ? "z-10" : "z-0 opacity-80"
        )}
      >
        {children(listeners)}
      </div>
    );
  }

  // -----------------------------
  // Toggle chapter open/close
  // -----------------------------
  function toggleOpen(chapterId: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === chapterId ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  }

  // -----------------------------
  // Handle drag end
  // -----------------------------
  function handleDragEnd(event: { active: any; over: any }) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id;
    const overId = over.id;
    const activeType = active.data.current?.type as "chapter" | "lesson";
    const overType = over.data.current?.type as "chapter" | "lesson";

    // -----------------------------
    // Reorder chapters
    // -----------------------------
    if (activeType === "chapter" && overType === "chapter") {
      const activeIndex = items.findIndex((item) => item.id === activeId);
      const overIndex = items.findIndex((item) => item.id === overId);
      if (activeIndex === -1 || overIndex === -1) return;

      const reordered = arrayMove(items, activeIndex, overIndex);
      setItems(reordered);

      // Update DB outside state update
      ReorderCourseContent({
        chapters: reordered.map((c, idx) => ({ id: c.id, position: idx + 1 })),
      });
      return;
    }

    // -----------------------------
    // Reorder lessons (same chapter only)
    // -----------------------------
    if (activeType === "lesson" && overType === "lesson") {
      const activeChapterId = active.data.current.chapterId;
      const overChapterId = over.data.current.chapterId;

      if (!activeChapterId || activeChapterId !== overChapterId) return;

      const chapterIndex = items.findIndex((c) => c.id === activeChapterId);
      if (chapterIndex === -1) return;

      const chapter = items[chapterIndex];
      const oldIndex = chapter.lessons.findIndex((l) => l.id === activeId);
      const newIndex = chapter.lessons.findIndex((l) => l.id === overId);
      if (oldIndex === -1 || newIndex === -1) return;

      const reorderedLessons = arrayMove(
        chapter.lessons,
        oldIndex,
        newIndex
      ).map((lesson, idx) => ({ ...lesson, order: idx + 1 }));

      const newItems = [...items];
      newItems[chapterIndex] = { ...chapter, lessons: reorderedLessons };
      setItems(newItems);

      ReorderCourseContent({
        lessons: reorderedLessons.map((l) => ({
          id: l.id,
          position: l.order,
          chapterId: activeChapterId,
        })),
      });
    }
  }

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chapters</CardTitle>
      </CardHeader>
      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <SortableItem
                id={item.id}
                key={item.id}
                data={{ type: "chapter" }}
              >
                {(listeners) => (
                  <Card className="mb-4">
                    <Collapsible
                      open={item.isOpen}
                      onOpenChange={() => toggleOpen(item.id)}
                    >
                      <div className="flex items-center justify-between p-3 border-b border-border">
                        <div className="flex items-center gap-3">
                          <Button {...listeners}>
                            <GripVertical size={24} />
                          </Button>
                          <CollapsibleTrigger>
                            {item.isOpen ? (
                              <ChevronDown size={24} />
                            ) : (
                              <ChevronRight size={24} />
                            )}
                          </CollapsibleTrigger>
                          <p className="font-semibold hover:text-primary cursor-pointer">
                            {item.title}
                          </p>
                        </div>
                        <Button className="text-white hover:text-destructive cursor-pointer">
                          <Trash2 size={24} />
                        </Button>
                      </div>
                      <CollapsibleContent>
                        <SortableContext
                          items={item.lessons.map((lesson) => lesson.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {item.lessons.map((lesson) => (
                            <SortableItem
                              id={lesson.id}
                              key={lesson.id}
                              data={{ type: "lesson", chapterId: item.id }}
                            >
                              {(listeners) => (
                                <div className="p-3 border-b border-border flex items-center">
                                  <Button {...listeners} variant="ghost">
                                    <GripVertical size={24} />
                                  </Button>
                                  <Button variant="ghost">
                                    <FileText size={24} />
                                  </Button>
                                  <p className="font-semibold hover:text-primary cursor-pointer">
                                    <Link
                                      href={`/admin/courses/${data?.id}/edit/lessons/${lesson.id}`}
                                    >
                                      {lesson.title}
                                    </Link>
                                  </p>
                                </div>
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
        </DndContext>
      </CardContent>
    </Card>
  );
}
