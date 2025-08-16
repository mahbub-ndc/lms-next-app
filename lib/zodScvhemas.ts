import { z } from "zod";

export const courseLvels = ["Beginner", "Intermediate", "Advanced"];
export const courseStatus = ["Draft", "Published", "Archived"];
export const courseCategories = [
  "Web Design",
  "Web Development",
  "Graphic Design",
  "Digital Marketing",
  "Personal Development",
  "Health & Fitness",
  "Artificial Inteligence",
] as const;

export const courseSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(20),
  fileKey: z.string(),
  price: z.number().min(1).max(500),
  duration: z.number().min(1).max(500),
  level: z.enum(courseLvels),
  status: z.enum(courseStatus),
  category: z.enum(courseCategories),
  smallDescription: z.string().min(3).max(100),
  slug: z.string().min(3),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
