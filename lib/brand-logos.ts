/**
 * Official logo paths under `/public/png/`.
 *
 * Naming: A = horizontal wordmark, B = app / icon, C = emblem, D = vertical, E = monochrome.
 *
 * Generated PWA assets: `/public/icons/` (favicon + launcher) and `/public/pwa/` (install
 * screenshots). Regenerate with `bun run icons:generate` or `npm run icons:generate`.
 */
export const BRAND_LOGOS = {
  /** Main nav on deep green or dark bars (light marks, transparent bg). */
  headerOnDark: "/png/logo_A_horizontal_on_dark.png",
  /** Nav on white / mint / very light backgrounds (dark marks, transparent bg). */
  headerOnLight: "/png/logo_A_horizontal_on_light.png",
  /** Marketing accent on warm gold backgrounds. */
  headerAccent: "/png/logo_A_horizontal_or.png",
  /** Default PWA / maskable / favicon source (filled square, dark). */
  appIconDark: "/png/logo_B_app_sombre.png",
  /** Alternate app tile (gold on dark). */
  appIconAccent: "/png/logo_B_app_or.png",
  /** Small glyph; use on tinted bg (asset is transparent). */
  iconTransparent: "/png/logo_B_icone_transparente.png",
  /** Emblem on light cards. */
  emblemOnLight: "/png/logo_C_embleme_clair.png",
  /** Vertical lockup for print / posters on light paper. */
  verticalOnLight: "/png/logo_D_vertical_sombre.png",
  /** Vertical lockup on dark surfaces. */
  verticalOnDark: "/png/logo_D_vertical_clair.png",
  /** Single-color on dark (watermark / footer on green). */
  monoOnDark: "/png/logo_E_monochrome_blanc.png",
  /** Single-color on light (letterhead). */
  monoOnLight: "/png/logo_E_monochrome_noir.png",
} as const;

/** Raster icons produced by `scripts/generate-brand-icons.mjs`. */
export const BRAND_ICON_FILES = {
  favicon16: "/icons/favicon-16x16.png",
  favicon32: "/icons/favicon-32x32.png",
  appleTouch: "/icons/apple-touch-icon.png",
  pwa192: "/icons/icon-192.png",
  pwa512: "/icons/icon-512.png",
} as const;

/** Install UI / store listing screenshots (`scripts/generate-brand-icons.mjs`). */
export const BRAND_PWA_SCREENSHOTS = {
  narrow: "/pwa/screenshot-narrow.png",
  wide: "/pwa/screenshot-wide.png",
} as const;
