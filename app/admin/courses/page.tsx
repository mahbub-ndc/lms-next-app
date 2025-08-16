import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function CoursePage() {
  return (
    <>
      <div className="flex justify-between items-center">
        <h3>Your Courses</h3>
        <Link className={buttonVariants()} href="/admin/courses/create">
          Create Courses
        </Link>
      </div>
      <div>
        <p>Here you can see all the course details here</p>
      </div>
    </>
  );
}
