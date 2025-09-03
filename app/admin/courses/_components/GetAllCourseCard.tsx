import { CourseSchemaType } from "@/lib/zodScvhemas";
import { GetAllCourseType } from "../getCourse/GetAllCourse";
import { Card, CardContent } from "@/components/ui/card";
import { file } from "zod";
import { env } from "@/lib/env";
import {
  DollarSign,
  DollarSignIcon,
  Icon,
  MoreVertical,
  PencilIcon,
  School,
  TimerIcon,
  Trash2,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
  IconDashboard,
  IconMoneybag,
  IconPigMoney,
  IconStatusChange,
} from "@tabler/icons-react";
import Dropdown from "@/app/(public)/_components/DropdownMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const GetAllCourseCard = ({ course }: { course: GetAllCourseType }) => {
  console.log("course", course);

  return (
    <div className="flex flex-col gap-2">
      <Card className="group relative pt-0">
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical size={24} className="text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/courses/${course.id}`}>
                  <IconDashboard className="mr-2" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/courses/${course.id}/edit`}>
                  <PencilIcon className="mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/courses/${course.id}/delete`}>
                  <Trash2 className="mr-2" />
                  Delete
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <img
          className="w-full md:h-[300px] h-[150px] object-cover rounded-xl"
          src={`https://${env.AWS_BUCKET_NAME}.t3.storageapi.dev/${course.fileKey}`}
        />
        <CardContent>
          <div className="flex flex-col gap-3">
            <Link href={`/admin/courses/${course.id}`}>
              <h2 className="text-2xl">{course.title}</h2>
            </Link>
            <p>{course.smallDescription}</p>
            <div className="flex justify-between">
              <div className="flex gap-4">
                <div className="flex gap-2 items-center">
                  <TimerIcon
                    className="bg-primary/10  rounded-full"
                    size={24}
                    color="white"
                  />
                  <p className="text-[20px]"> {course.duration} hrs</p>
                </div>
                <div className="flex gap-2 items-center">
                  <School
                    className="bg-primary/10 rounded-full"
                    size={24}
                    color="white"
                  />
                  <p className="text-[20px]"> {course.level}</p>
                </div>
              </div>

              <div className="flex gap-1 items-center">
                <DollarSignIcon size={24} />
                <h3 className="text-[20px]"> {course.price}</h3>
              </div>
            </div>
            <Link href={`/admin/courses/${course.id}/edit`}>
              <button
                className={buttonVariants({
                  size: "sm",

                  className: "w-full cursor-pointer",
                })}
              >
                Edit Course
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
