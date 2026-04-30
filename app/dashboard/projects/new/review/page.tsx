import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export default async function NewProjectReviewPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }
  redirect("/dashboard/projects?mode=new");
}
