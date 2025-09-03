"use server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { CourseLevel, CourseStatus } from "@/lib/generated/prisma";
import { courseSchema, CourseSchemaType } from "@/lib/zodScvhemas";

export const EditCourse = async (
  course: CourseSchemaType,
  courseId: string
) => {
  const session = await requireAdmin();
  try {
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }
    const result = courseSchema.safeParse(course);
    if (!result.success) {
      return result.error;
    }

    await prisma.course.update({
      where: { id: courseId },
      data: {
        ...result.data,
        level: result.data.level as CourseLevel,
        status: result.data.status as CourseStatus,
      },
    });

    return { success: true, message: "Course updated successfully" };
  } catch (error) {
    console.error("Error updating course:", error);
    return { success: false, message: error };
  }
};
export type EditCourseType = Awaited<ReturnType<typeof EditCourse>>;
