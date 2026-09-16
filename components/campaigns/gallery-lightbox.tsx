"use client";

import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export type GalleryLightboxItem = {
  url: string;
  alt?: string;
};

type GalleryLightboxProps = {
  images: GalleryLightboxItem[];
  openIndex: number | null;
  onOpenChange: (index: number | null) => void;
};

export function GalleryLightbox({
  images,
  openIndex,
  onOpenChange,
}: GalleryLightboxProps) {
  const open = openIndex != null && openIndex >= 0 && openIndex < images.length;
  const [index, setIndex] = useState(openIndex ?? 0);

  useEffect(() => {
    if (openIndex != null) setIndex(openIndex);
  }, [openIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setIndex((i) => (i + 1) % images.length);
      } else if (e.key === "ArrowLeft") {
        setIndex((i) => (i - 1 + images.length) % images.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  const current = images[index];

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onOpenChange(null);
      }}
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/80 supports-backdrop-filter:backdrop-blur-sm"
        className="max-h-[92vh] w-[min(96vw,960px)] max-w-none gap-0 overflow-hidden border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-none"
      >
        <DialogTitle className="sr-only">
          {current?.alt || "Aperçu de l'image"}
        </DialogTitle>
        <div className="relative flex flex-col items-center">
          <button
            type="button"
            onClick={() => onOpenChange(null)}
            className="absolute -top-10 right-0 z-10 inline-flex size-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25"
            aria-label="Fermer"
          >
            <XIcon className="size-5" />
          </button>

          <div className="relative w-full overflow-hidden rounded-2xl bg-black shadow-sm">
            {current ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.url}
                alt={current.alt || ""}
                className="mx-auto max-h-[78vh] w-full object-contain"
              />
            ) : null}
          </div>

          {images.length > 1 ? (
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setIndex((i) => (i - 1 + images.length) % images.length)
                }
                className="inline-flex size-10 items-center justify-center rounded-full bg-white text-deep-green shadow-sm hover:bg-neutral-50"
                aria-label="Image précédente"
              >
                <ChevronLeftIcon className="size-5" />
              </button>
              <p className="min-w-16 text-center text-sm font-medium text-white">
                {index + 1} / {images.length}
              </p>
              <button
                type="button"
                onClick={() => setIndex((i) => (i + 1) % images.length)}
                className="inline-flex size-10 items-center justify-center rounded-full bg-white text-deep-green shadow-sm hover:bg-neutral-50"
                aria-label="Image suivante"
              >
                <ChevronRightIcon className="size-5" />
              </button>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
