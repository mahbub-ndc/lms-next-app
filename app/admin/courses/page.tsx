import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { GetAllCourse } from "./getCourse/GetAllCourse";
import { GetAllCourseCard } from "./_components/GetAllCourseCard";

export default async function CoursePage() {
  const data = await GetAllCourse();

  return (
    <>
      <div className="flex justify-between items-center">
        <h3>Your Courses</h3>
        <Link className={buttonVariants()} href="/admin/courses/create">
          Create Courses
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        {data.map((course) => (
          <GetAllCourseCard key={course.id} course={course} />
        ))}
      </div>
    </>
  );
}
