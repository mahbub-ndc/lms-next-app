import { Separator } from "@/components/ui/separator";
import { GetSingleCourse } from "../../getCourse/GetSingleCourse";
import { Params } from "next/dist/server/request/params";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {} from "@/components/ui/card";
import { EditCourseForm } from "./_components/EditCourseForm";
import CourseContent from "./_components/CourseContent";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { redirect } from "next/navigation";

type params = Promise<{ courseId: string }>;

export default async function EditCoursePage({ params }: { params: params }) {
  const { courseId } = await params;
  const course = await GetSingleCourse(courseId as string);
  const session = await requireAdmin();

  if (!session?.user?.id) {
    return redirect("/login");
  }

  return (
    <div>
      <h3 className="text-2xl">Edit Course: {course?.title}</h3>
      <Separator className="my-4" />
      <Tabs defaultValue="basic-info">
        <TabsList className="w-full">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="course-content">Course Content</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">
          <Card>
            <CardContent>
              <EditCourseForm course={course} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="course-content">
          <Card>
            <CardContent>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <p className="text-sm text-muted-foreground pb-4">
                    Edit the course content here. You can add, remove, and
                    reorder chapters.
                  </p>
                </CardDescription>
                <CourseContent data={course} />
              </CardContent>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
