"use server";
import { prisma } from "@/lib/db";

export const GetSingleCourse = async (id: string) => {
  const courseData = await prisma.course.findUnique({
    where: { id: id },
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
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
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
