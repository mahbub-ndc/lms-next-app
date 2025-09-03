import { z, ZodNumber } from "zod";

export const courseCategories = [
  "Web Design",
  "Web Development",
  "Graphic Design",
  "Digital Marketing",
  "Personal Development",
  "Health & Fitness",
  "Artificial Inteligence",
] as const;
export const courseLvels = ["Beginner", "Intermediate", "Advanced"] as const;
export const courseStatus = ["Draft", "Published", "Archived"] as const;

export const courseSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(20),
  fileKey: z.string().min(1, { message: "File is required" }),
  price: z.coerce.number().min(1) as ZodNumber,
  duration: z.coerce.number().min(1) as ZodNumber,
  level: z.enum(courseLvels),
  status: z.enum(courseStatus),
  category: z.enum(courseCategories),
  smallDescription: z.string().min(3).max(200),
  slug: z.string().min(3),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
