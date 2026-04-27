"use client";

import { FileIcon, ImageIcon, UploadCloudIcon, XIcon } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getClientMaxUploadBytes } from "@/lib/upload/limits";

export type FileDropZoneProps = {
  /** HTML `accept` attribute, e.g. `image/*` or `image/*,.pdf` */
  accept?: string;
  /** Max size in bytes (defaults from `NEXT_PUBLIC_MAX_UPLOAD_MB`). */
  maxBytes?: number;
  /** Remote URL after upload (e.g. Cloudinary) — shown when no local staging preview. */
  remoteUrl?: string | null;
  /** Called with the chosen file; parent typically uploads then sets `remoteUrl`. */
  onFileSelect: (file: File) => void | Promise<void>;
  onClear?: () => void;
  disabled?: boolean;
  isUploading?: boolean;
  /** Shown under the zone */
  hint?: string;
  className?: string;
};

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function acceptsFile(file: File, accept: string): boolean {
  const trimmed = accept.trim();
  if (!trimmed || trimmed === "*/*") return true;
  const parts = trimmed.split(",").map((p) => p.trim());
  for (const part of parts) {
    if (part.endsWith("/*")) {
      const prefix = part.slice(0, -1);
      if (file.type.startsWith(prefix)) return true;
    } else if (part.startsWith(".")) {
      if (file.name.toLowerCase().endsWith(part.toLowerCase())) return true;
    } else if (file.type === part) return true;
  }
  return false;
}

export function FileDropZone({
  accept = "image/*",
  maxBytes: maxBytesProp,
  remoteUrl,
  onFileSelect,
  onClear,
  disabled = false,
  isUploading = false,
  hint,
  className,
}: FileDropZoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const maxBytes = maxBytesProp ?? getClientMaxUploadBytes();
  const [dragOver, setDragOver] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [localName, setLocalName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const localPreviewRef = useRef<string | null>(null);

  const revokeLocal = useCallback(() => {
    if (localPreviewRef.current) {
      URL.revokeObjectURL(localPreviewRef.current);
      localPreviewRef.current = null;
    }
    setLocalPreview(null);
    setLocalName(null);
  }, []);

  useEffect(() => {
    return () => revokeLocal();
  }, [revokeLocal]);

  const displayUrl = localPreview || (remoteUrl?.trim() ? remoteUrl : null);
  const isImagePreview =
    displayUrl &&
    (localPreview !== null ||
      /\.(png|jpe?g|webp|gif|avif|svg)(\?|$)/i.test(displayUrl) ||
      displayUrl.includes("cloudinary.com"));

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      if (file.size > maxBytes) {
        setError(`File is too large (max ${formatBytes(maxBytes)}).`);
        return;
      }
      if (!acceptsFile(file, accept)) {
        setError("This file type is not allowed.");
        return;
      }
      revokeLocal();
      const url = URL.createObjectURL(file);
      localPreviewRef.current = url;
      setLocalPreview(url);
      setLocalName(file.name);
      try {
        await onFileSelect(file);
        revokeLocal();
      } catch {
        revokeLocal();
        setError("Upload failed. Try again.");
      }
    },
    [accept, maxBytes, onFileSelect, revokeLocal],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) void processFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (disabled || isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) void processFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) setDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const busy = disabled || isUploading;

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={busy}
        onChange={onInputChange}
      />

      <div
        role="presentation"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cn(
          "relative overflow-hidden rounded-xl border-2 border-dashed transition-colors",
          dragOver && !busy ? "border-primary bg-primary/5" : "border-muted-foreground/25 bg-muted/20",
          busy && "pointer-events-none opacity-60",
        )}
      >
        {displayUrl && isImagePreview ? (
          <div className="relative aspect-video w-full bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayUrl}
              alt=""
              className="size-full object-contain"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 py-3 pt-10">
              <span className="truncate text-xs font-medium text-white">
                {localName ?? (remoteUrl ? "Saved image" : "")}
              </span>
              <div className="flex shrink-0 gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="h-8"
                  disabled={busy}
                  onClick={() => inputRef.current?.click()}
                >
                  Replace
                </Button>
                {onClear ? (
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="size-8"
                    disabled={busy}
                    onClick={() => {
                      revokeLocal();
                      onClear();
                      setError(null);
                    }}
                    aria-label="Remove file"
                  >
                    <XIcon className="size-4" />
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        ) : displayUrl ? (
          <div className="flex items-center gap-3 p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
              <FileIcon className="size-6 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{localName ?? "Attached file"}</p>
              <p className="text-xs text-muted-foreground">Preview not available for this type.</p>
            </div>
            <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => inputRef.current?.click()}>
              Replace
            </Button>
            {onClear ? (
              <Button type="button" size="icon" variant="ghost" disabled={busy} onClick={() => { revokeLocal(); onClear(); }} aria-label="Remove">
                <XIcon className="size-4" />
              </Button>
            ) : null}
          </div>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 px-4 py-10 text-center outline-none transition hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-background shadow-sm">
              {accept.includes("image") ? (
                <ImageIcon className="size-6 text-muted-foreground" aria-hidden />
              ) : (
                <UploadCloudIcon className="size-6 text-muted-foreground" aria-hidden />
              )}
            </span>
            <span className="text-sm font-medium text-foreground">
              Drag and drop or click to upload
            </span>
            <span className="max-w-sm text-xs text-muted-foreground">
              Max {formatBytes(maxBytes)}
              {accept ? ` · ${accept}` : ""}
            </span>
          </button>
        )}

        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-[2px]">
            <p className="text-sm font-medium text-foreground">Uploading…</p>
          </div>
        ) : null}
      </div>

      {!displayUrl ? (
        <p className="text-xs text-muted-foreground">
          {hint ?? "Images are uploaded securely. You will see a preview after choosing a file."}
        </p>
      ) : null}

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
