import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { size } from "better-auth";
import { title } from "process";
import { Card } from "@/components/ui/card";

type FeatureProps = {
  title: string;
  description: string;
  icon: string;
};

const features: FeatureProps[] = [
  {
    title: "Comprehensive Course Catalog",
    description: "Explore a wide range of courses across various subjects.",
    icon: "📚",
  },
  {
    title: "Interactive Learning",
    description:
      "Engage with interactive content and quizzes to enhance your understanding.",
    icon: "🖥️",
  },
  {
    title: "Community Support",
    description:
      "Join a community of learners and educators for support and collaboration.",
    icon: "🤝",
  },
  {
    title: "Progess Tracking",
    description:
      "Track your learning progress and achievements with our intuitive dashboard.",
    icon: "📈",
  },
];

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div>
      <section className="relative py-20">
        <div className="flex flex-col items-center justify-between p-4">
          <Badge variant={"outline"} className="text-xl">
            The future of online education
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Elevate your learning experience!
          </h1>
          <p className="mt-6 text-lg text-muted-foreground w-[700px] text-center">
            Join our LMS platform to access a wide range of courses and
            resources tailored to your learning needs.
          </p>
          <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:items-center sm:justify-center">
            <Link
              className={buttonVariants({ size: "lg", variant: "default" })}
              href="/courses"
            >
              Explore Our Courses
            </Link>
            <Link
              className={buttonVariants({ size: "lg", variant: "outline" })}
              href="/login"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2: lg:grid-cols-4 gap-6 p-6">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex flex-col  space-x-4">
              <span className="text-4xl">{feature.icon}</span>
              <div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-[18px] text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
