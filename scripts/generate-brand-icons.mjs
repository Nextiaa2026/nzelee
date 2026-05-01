/**
 * Builds favicons, PWA launcher icons, and install-preview screenshots from brand PNGs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
/** Gold square tile — reads well on home screens and small sizes. */
const iconSource = path.join(root, "public/png/logo_B_app_or.png");
const horizontalLogo = path.join(root, "public/png/logo_A_horizontal_clair.png");
const outDir = path.join(root, "public/icons");
const pwaDir = path.join(root, "public/pwa");

const THEME_BG = { r: 11, g: 45, b: 36, alpha: 1 };

async function squareIcon(size, innerRatio = 0.82) {
  const inner = Math.round(size * innerRatio);
  const buf = await sharp(iconSource)
    .resize(inner, inner, { fit: "contain", background: THEME_BG })
    .png()
    .toBuffer();
  const meta = await sharp(buf).metadata();
  const w = meta.width ?? inner;
  const h = meta.height ?? inner;
  const left = Math.max(0, Math.floor((size - w) / 2));
  const top = Math.max(0, Math.floor((size - h) / 2));
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: THEME_BG,
    },
  })
    .composite([{ input: buf, left, top }])
    .png();
}

/**
 * Centered wordmark on brand background (Chrome / Edge install UI, in-app browsers).
 */
async function screenshotWordmark(width, height, logoMaxWidth) {
  const logoBuf = await sharp(horizontalLogo)
    .resize({ width: logoMaxWidth, fit: "inside", withoutEnlargement: true })
    .png()
    .toBuffer();
  const meta = await sharp(logoBuf).metadata();
  const lw = meta.width ?? logoMaxWidth;
  const lh = meta.height ?? 80;
  const left = Math.max(0, Math.round((width - lw) / 2));
  const top = Math.max(0, Math.round((height - lh) / 2));
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: THEME_BG,
    },
  })
    .composite([{ input: logoBuf, left, top }])
    .png();
}

async function main() {
  if (!fs.existsSync(iconSource)) {
    console.error("Missing icon source:", iconSource);
    process.exit(1);
  }
  if (!fs.existsSync(horizontalLogo)) {
    console.error("Missing horizontal logo:", horizontalLogo);
    process.exit(1);
  }
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(pwaDir, { recursive: true });

  const tasks = [
    ["favicon-16x16.png", 16, 0.88],
    ["favicon-32x32.png", 32, 0.88],
    ["apple-touch-icon.png", 180, 0.82],
    ["icon-192.png", 192, 0.82],
    ["icon-512.png", 512, 0.82],
  ];

  for (const [name, size, ratio] of tasks) {
    const img = await squareIcon(size, ratio);
    await img.toFile(path.join(outDir, name));
    console.log("wrote", path.join("public/icons", name));
  }

  const narrow = await screenshotWordmark(390, 844, 340);
  await narrow.toFile(path.join(pwaDir, "screenshot-narrow.png"));
  console.log("wrote public/pwa/screenshot-narrow.png");

  const wide = await screenshotWordmark(1920, 1080, 920);
  await wide.toFile(path.join(pwaDir, "screenshot-wide.png"));
  console.log("wrote public/pwa/screenshot-wide.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
