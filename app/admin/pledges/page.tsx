import { redirect } from "next/navigation";

/** @deprecated Use `/admin/investments`. */
export default function AdminPledgesRedirectPage() {
  redirect("/admin/investments");
}
