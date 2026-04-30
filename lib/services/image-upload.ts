import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/auth/roles";
import { apiFail, apiOk, type ApiResult } from "@/lib/http/api-result";
import { deleteImageByUrl, uploadImageBuffer } from "@/lib/services/cloudinary";
import { getServerMaxUploadBytes } from "@/lib/upload/limits";

type UploadImageHandlerOptions = {
  folder?: string;
  adminOnly?: boolean;
};

export type ImageUploadHandlerResult = { status: number; result: ApiResult<{ url: string }> };
export type ImageDeleteHandlerResult = { status: number; result: ApiResult<{ deleted: boolean }> };

export async function executeImageUpload(
  req: Request,
  { folder = "nexiaa/uploads", adminOnly = false }: UploadImageHandlerOptions = {},
): Promise<ImageUploadHandlerResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { status: 403, result: apiFail("FORBIDDEN", "You must be signed in.") };
  }
  if (adminOnly && !isAdminRole(session.user.role)) {
    return {
      status: 403,
      result: apiFail("FORBIDDEN", "Only administrators can upload images."),
    };
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return { status: 400, result: apiFail("VALIDATION", "Expected multipart form data.") };
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return { status: 400, result: apiFail("VALIDATION", "Missing file field.") };
  }
  if (!file.type.startsWith("image/")) {
    return { status: 400, result: apiFail("VALIDATION", "File must be an image.") };
  }

  const maxBytes = getServerMaxUploadBytes();
  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > maxBytes) {
    const mb = (maxBytes / (1024 * 1024)).toFixed(0);
    return { status: 400, result: apiFail("VALIDATION", `Image too large (max ${mb}MB).`) };
  }

  try {
    const url = await uploadImageBuffer(buffer, { folder });
    return { status: 200, result: apiOk({ url }) };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return { status: 500, result: apiFail("UPLOAD", message) };
  }
}

export async function executeImageDelete(
  req: Request,
  { adminOnly = false }: Pick<UploadImageHandlerOptions, "adminOnly"> = {},
): Promise<ImageDeleteHandlerResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { status: 403, result: apiFail("FORBIDDEN", "You must be signed in.") };
  }
  if (adminOnly && !isAdminRole(session.user.role)) {
    return {
      status: 403,
      result: apiFail("FORBIDDEN", "Only administrators can delete images."),
    };
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return { status: 400, result: apiFail("VALIDATION", "Expected JSON body.") };
  }
  const url =
    typeof body === "object" && body !== null && "url" in body
      ? (body as { url?: unknown }).url
      : undefined;
  if (typeof url !== "string" || url.trim().length === 0) {
    return { status: 400, result: apiFail("VALIDATION", "Missing image url.") };
  }

  try {
    const ok = await deleteImageByUrl(url.trim());
    return { status: 200, result: apiOk({ deleted: ok }) };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Delete failed";
    return { status: 500, result: apiFail("UPLOAD", message) };
  }
}
