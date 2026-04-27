import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/auth/roles";
import { apiFail, apiOk } from "@/lib/http/api-result";
import { uploadImageBuffer } from "@/lib/services/cloudinary";
import { getServerMaxUploadBytes } from "@/lib/upload/limits";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || !isAdminRole(session.user.role)) {
    return NextResponse.json(
      apiFail("FORBIDDEN", "Only administrators can upload images."),
      { status: 403 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(apiFail("VALIDATION", "Expected multipart form data."), {
      status: 400,
    });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(apiFail("VALIDATION", "Missing file field."), { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(apiFail("VALIDATION", "File must be an image."), { status: 400 });
  }

  const maxBytes = getServerMaxUploadBytes();
  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > maxBytes) {
    const mb = (maxBytes / (1024 * 1024)).toFixed(0);
    return NextResponse.json(
      apiFail("VALIDATION", `Image too large (max ${mb}MB).`),
      { status: 400 },
    );
  }

  try {
    const url = await uploadImageBuffer(buffer);
    return NextResponse.json(apiOk({ url }));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json(apiFail("UPLOAD", message), { status: 500 });
  }
}
