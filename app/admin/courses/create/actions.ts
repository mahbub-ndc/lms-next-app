"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CourseLevel, CourseStatus } from "@/lib/generated/prisma";

import {
  courseLvels,
  courseSchema,
  CourseSchemaType,
  courseStatus,
} from "@/lib/zodScvhemas";
import { headers } from "next/headers";

import z from "zod";

export const CreateCourse = async (data: CourseSchemaType) => {
  try {
    // Get session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    // Validate data
    const validation = courseSchema.safeParse(data);
    if (!validation.success) {
      // Return validation errors
      return { success: false, errors: validation.error.issues };
    }

    const createdCourse = await prisma.course.create({
      data: {
        ...validation.data,
        userId: session.user.id,
        level: z.enum(courseLvels).parse(validation.data.level) as CourseLevel,
        status: z
          .enum(courseStatus)
          .parse(validation.data.status) as CourseStatus,
      },
    });
    // toast.success("Course created successfully");
    return { success: true, course: createdCourse };
  } catch (error) {
    console.error("Error creating course:", error);
    //toast.error("Error creating course");
    return { success: false, error: (error as Error).message };
  }
};
