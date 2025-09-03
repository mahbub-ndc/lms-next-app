"use server";
import { prisma } from "@/lib/db";

export const GetAllCourse = async () => {
  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      status: true,
      category: true,
      smallDescription: true,
      slug: true,
    },
  });

  return data;
};

export type GetAllCourseType = Awaited<ReturnType<typeof GetAllCourse>>[0];
