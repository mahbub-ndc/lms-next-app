"use server";
import { prisma } from "@/lib/db";

// ✅ Fetch single course with ordered chapters/lessons
export const GetSingleCourse = async (id: string) => {
  const courseData = await prisma.course.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      status: true,
      category: true,
      chapter: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          courseId: true,
          title: true,
          position: true,
          lessons: {
            orderBy: { position: "asc" },
            select: {
              id: true,
              title: true,
              videoKey: true,
              description: true,
              thumbnailKey: true,
              position: true,
            },
          },
        },
      },
      smallDescription: true,
      slug: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return courseData;
};

export type GetSingleCourseType = Awaited<ReturnType<typeof GetSingleCourse>>;

// ✅ Reorder chapters & lessons in DB
export const ReorderCourseContent = async (data: {
  chapters?: { id: string; position: number }[];
  lessons?: { id: string; position: number; chapterId: string }[];
}) => {
  try {
    if (data.chapters) {
      await prisma.$transaction(
        data.chapters.map((c) =>
          prisma.chapter.update({
            where: { id: c.id },
            data: { position: c.position },
          })
        )
      );
    }

    if (data.lessons) {
      await prisma.$transaction(
        data.lessons.map((l) =>
          prisma.lesson.update({
            where: { id: l.id },
            data: {
              position: l.position,
              chapterId: l.chapterId,
            },
          })
        )
      );
    }

    return { success: true };
  } catch (error) {
    console.error("ReorderCourseContent error:", error);
    return { success: false, error: "Failed to reorder course content" };
  }
};

export type ReorderCourseContentType = Awaited<
  ReturnType<typeof ReorderCourseContent>
>;
