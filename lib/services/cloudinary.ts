import { v2 as cloudinary } from "cloudinary";

function ensureConfigured() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }
  cloudinary.config({ cloud_name, api_key, api_secret });
}

/**
 * Upload an image buffer to Cloudinary. Returns the **secure** HTTPS URL.
 */
export async function uploadImageBuffer(
  buffer: Buffer,
  options?: { folder?: string; publicId?: string },
): Promise<string> {
  ensureConfigured();
  const folder = options?.folder ?? "nexiaa/campaigns";

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        ...(options?.publicId ? { public_id: options.publicId } : {}),
      },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        if (!result?.secure_url) {
          reject(new Error("Cloudinary upload returned no URL"));
          return;
        }
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
}
