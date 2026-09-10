"use client";

import { X, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function VideoModal({
  trigger,
  videoUrl,
  thumbnailSrc,
  title,
  author,
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = typeof controlledIsOpen === "boolean";
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleClose = () => {
    if (isControlled) {
      controlledOnClose?.();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleOpen = () => {
    if (!isControlled) {
      setInternalIsOpen(true);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const modal =
    isOpen && typeof document !== "undefined"
      ? createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
              onClick={handleClose}
            />

            {/* Video Container (Vertical Reel Style) */}
            <div className="relative z-10 w-full max-w-[340px] sm:max-w-sm max-h-[85vh] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/15 flex flex-col">
              {/* Top Bar with Title & Close Button */}
              <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
                <div className="pr-2 truncate">
                  {title && (
                    <h4 className="text-white text-xs sm:text-sm font-bold truncate drop-shadow-sm">
                      {title}
                    </h4>
                  )}
                  {author && (
                    <p className="text-white/80 text-[10px] sm:text-xs truncate">
                      {author}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shrink-0 active:scale-95"
                  aria-label="Close video"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Video Player */}
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
                playsInline
                poster={thumbnailSrc}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {trigger && (
        <div onClick={handleOpen} className="w-full h-full cursor-pointer">
          {trigger}
        </div>
      )}
      {modal}
    </>
  );
}
