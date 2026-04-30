/** Client-only helpers for admin table row actions. */

export function openPathInNewTab(path: string) {
  if (typeof window === "undefined") return;
  const url = path.startsWith("http") ? path : `${window.location.origin}${path}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function openPublicCampaign(slug: string) {
  openPathInNewTab(`/campaigns/${encodeURIComponent(slug)}`);
}
