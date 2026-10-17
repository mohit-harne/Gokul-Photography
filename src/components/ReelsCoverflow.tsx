// src/components/ReelsCoverflow.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, type PanInfo } from "motion/react";

export interface ReelItem {
  videoSrc: string;
  poster?: string;
  likes: string | number;
  comments: string | number;
  shares: string | number;
  location: string;
  caption: string;
  audio: string;
}

interface ReelsCoverflowProps {
  studioReels: ReelItem[];
}

export default function ReelsCoverflow({ studioReels }: ReelsCoverflowProps) {
  const [activeIndex, setActiveIndex] = useState(
    Math.floor(studioReels.length / 2)
  );
  const [isMuted, setIsMuted] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(1024);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isDraggingRef = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Track viewport width so 3D coverflow spacing adapts to Mobile, Tablet, and Desktop
  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : studioReels.length - 1));
  }, [studioReels.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < studioReels.length - 1 ? prev + 1 : 0));
  }, [studioReels.length]);

  // Auto-play active center card, pause side cards
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === activeIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeIndex]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Responsive 3D Coverflow Math
  const isMobile = viewportWidth < 640;
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024;

  const baseSpacing = isMobile ? 115 : isTablet ? 165 : 215;
  const zDepthStep = isMobile ? 95 : 130;
  const baseTilt = isMobile ? 32 : 28;

  // Unified Pan / Swipe handler for Desktop Mouse Drag & Mobile Touch
  const handlePanStart = () => {
    isDraggingRef.current = true;
  };

  const handlePanEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = isMobile ? 30 : 50;
    const velocityThreshold = 250;

    if (
      info.offset.x < -swipeThreshold ||
      info.velocity.x < -velocityThreshold
    ) {
      handleNext();
    } else if (
      info.offset.x > swipeThreshold ||
      info.velocity.x > velocityThreshold
    ) {
      handlePrev();
    }

    // Small delay before re-enabling click so a swipe doesn't trigger a card tap
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 80);
  };

  // Fallback native touch handlers for mobile browsers (iOS Safari / Android Chrome)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Only trigger if horizontal swipe is dominant over vertical scroll
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 35) {
      isDraggingRef.current = true;
      if (deltaX < 0) handleNext();
      else handlePrev();

      setTimeout(() => {
        isDraggingRef.current = false;
      }, 100);
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <section className="relative py-12 sm:py-24 bg-neutral-950 border-t border-neutral-900/80 overflow-hidden">
      {/* Header & Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-6 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-[10px] tracking-[0.35em] uppercase text-neutral-400 font-light">
              Reels & Moments
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-white tracking-wide">
            Captured In Motion{" "}
            <span className="italic font-normal text-amber-100/90">
              & Live Energy
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-lg">
            Unscripted glimpses, intimate vows, and royal celebrations straight
            from our studio lens.
          </p>
        </div>

        {/* Controls: Carousel arrows & Instagram follow link */}
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <a
            href="https://www.instagram.com/_gokulphotography"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-neutral-300 hover:text-white border-b border-neutral-700 hover:border-white pb-1 transition-colors"
          >
            <span>Follow @_gokulphotography</span>
            <span>↗</span>
          </a>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous reel"
              className="w-9 h-9 rounded-full border border-neutral-800 bg-neutral-900/70 text-neutral-300 hover:text-white hover:border-neutral-500 hover:bg-neutral-800 flex items-center justify-center transition-all cursor-pointer active:scale-95"
            >
              &#8592;
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next reel"
              className="w-9 h-9 rounded-full border border-neutral-800 bg-neutral-900/70 text-neutral-300 hover:text-white hover:border-neutral-500 hover:bg-neutral-800 flex items-center justify-center transition-all cursor-pointer active:scale-95"
            >
              &#8594;
            </button>
          </div>
        </div>
      </div>

      {/* 3D Coverflow Stage */}
      <motion.div
        onPanStart={handlePanStart}
        onPanEnd={handlePanEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative h-[460px] xs:h-[500px] sm:h-[600px] max-w-7xl mx-auto flex items-center justify-center select-none overflow-visible touch-pan-y"
        style={{ perspective: "1200px" }}
      >
        {studioReels.map((reel, index) => {
          const offset = index - activeIndex;
          const absOffset = Math.abs(offset);
          const isCenter = offset === 0;

          // Responsive Coverflow 3D Calculations
          const xOffset = offset * baseSpacing;
          const scale = isCenter ? 1 : Math.max(0.72, 1 - absOffset * 0.13);
          const rotateY = isCenter
            ? 0
            : offset > 0
            ? -Math.min(48, baseTilt + absOffset * 6)
            : Math.min(48, baseTilt + absOffset * 6);
          const zOffset = isCenter ? 0 : -absOffset * zDepthStep;
          const opacity =
            absOffset > 2
              ? 0
              : isCenter
              ? 1
              : Math.max(0.3, 1 - absOffset * 0.32);
          const zIndex = studioReels.length - absOffset;

          return (
            <motion.div
              key={index}
              onClick={() => {
                if (isDraggingRef.current) return;
                if (!isCenter) {
                  setActiveIndex(index);
                } else {
                  const v = videoRefs.current[index];
                  if (v) v.paused ? v.play() : v.pause();
                }
              }}
              initial={false}
              animate={{
                x: xOffset,
                scale,
                rotateY,
                z: zOffset,
                opacity,
                zIndex,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 26,
                mass: 0.9,
              }}
              style={{
                transformStyle: "preserve-3d",
                pointerEvents: absOffset > 2 ? "none" : "auto",
              }}
              className={`reel-card group absolute w-[235px] xs:w-[260px] sm:w-[320px] aspect-[9/16] rounded-2xl overflow-hidden bg-black border ${
                isCenter
                  ? "border-amber-200/30 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.95)] cursor-grab active:cursor-grabbing"
                  : "border-neutral-800/80 shadow-2xl cursor-pointer"
              }`}
            >
              {/* Darkening Overlay for Inactive Side Cards */}
              {!isCenter && (
                <div className="absolute inset-0 bg-black/45 z-30 pointer-events-none transition-opacity duration-300" />
              )}

              {/* Video Layer */}
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                className="reel-video w-full h-full object-cover pointer-events-none"
                loop
                muted={isMuted}
                playsInline
                preload="metadata"
                poster={reel.poster}
              >
                <source src={reel.videoSrc} type="video/mp4" />
              </video>

              {/* Instagram Top Bar: "Reels" Header & Mute Toggle */}
              <div className="absolute inset-x-0 top-0 pt-3.5 sm:pt-4 px-3.5 sm:px-4 pb-8 bg-gradient-to-b from-black/80 via-black/30 to-transparent z-20 flex items-center justify-between text-white pointer-events-none">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-semibold text-xs sm:text-sm tracking-wide drop-shadow">
                    Reels
                  </span>
                  <svg
                    className="w-3.5 h-3.5 fill-current opacity-80"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                {/* Mute / Unmute Toggle Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="mute-toggle-btn pointer-events-auto p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-all"
                  title="Mute / Unmute"
                >
                  {isMuted ? (
                    <svg
                      className="w-4 h-4 mute-icon"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Instagram Right Sidebar: Interaction Icons */}
              <div className="absolute right-2.5 sm:right-3 bottom-12 sm:bottom-14 z-20 flex flex-col items-center space-y-3 sm:space-y-4 pointer-events-auto">
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col items-center group/btn cursor-pointer"
                >
                  <div className="p-1.5 sm:p-2 text-white hover:text-rose-500 transition-colors drop-shadow">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 stroke-white fill-transparent stroke-[1.8] group-hover/btn:fill-rose-500 group-hover/btn:stroke-rose-500 transition-colors"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-medium text-white drop-shadow -mt-1">
                    {reel.likes}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col items-center group/btn cursor-pointer"
                >
                  <div className="p-1.5 sm:p-2 text-white hover:text-amber-100 transition-colors drop-shadow">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 stroke-white fill-transparent stroke-[1.8]"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-medium text-white drop-shadow -mt-1">
                    {reel.comments}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col items-center group/btn cursor-pointer"
                >
                  <div className="p-1.5 sm:p-2 text-white hover:text-amber-100 transition-colors drop-shadow">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 stroke-white fill-transparent stroke-[1.8] -rotate-12"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-medium text-white drop-shadow -mt-1">
                    {reel.shares}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 sm:p-2 text-white/90 hover:text-white drop-shadow cursor-pointer"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                    <circle cx="12" cy="5" r="1.75" />
                    <circle cx="12" cy="12" r="1.75" />
                    <circle cx="12" cy="19" r="1.75" />
                  </svg>
                </button>

                <div
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-md p-0.5 border-2 border-white/80 overflow-hidden bg-black/60 shadow-lg animate-spin"
                  style={{ animationDuration: "4s" }}
                >
                  <div className="w-full h-full rounded-sm bg-gradient-to-tr from-amber-400 to-rose-500"></div>
                </div>
              </div>

              {/* Instagram Bottom Content Area */}
              <div className="absolute inset-x-0 bottom-0 pr-12 sm:pr-16 pl-3 pb-3 pt-10 sm:pt-12 bg-gradient-to-t from-black via-black/75 to-transparent z-10 flex flex-col justify-end space-y-1.5 sm:space-y-2 pointer-events-none text-white">
                <div className="flex items-center gap-2 pointer-events-auto">
                  <div className="p-[1.5px] rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shrink-0">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black flex items-center justify-center font-bold text-[8px] sm:text-[9px] uppercase border border-black">
                      G
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                      <span className="text-[11px] sm:text-xs font-semibold tracking-wide drop-shadow truncate">
                        _gokulphotography
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-white/80 font-normal">
                        and 4 others
                      </span>
                      <span className="text-white/60 text-xs hidden sm:inline">•</span>
                      <span className="text-[10px] sm:text-[11px] font-semibold text-white/90 border border-white/30 rounded px-1.5 py-0.2 hover:bg-white/20 transition-colors cursor-pointer">
                        Follow
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[9.5px] sm:text-[10px] text-neutral-300 drop-shadow pointer-events-auto">
                  <svg
                    className="w-3 h-3 text-rose-400 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="truncate hover:underline cursor-pointer">
                    {reel.location}
                  </span>
                </div>

                <p className="text-[10px] sm:text-[11px] text-white/90 font-light leading-snug line-clamp-2 drop-shadow">
                  {reel.caption}
                </p>

                <div className="flex items-center gap-1.5 pt-0.5 pointer-events-auto">
                  <div className="flex -space-x-1.5 overflow-hidden shrink-0">
                    <span className="inline-block w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ring-1 ring-black bg-neutral-300"></span>
                    <span className="inline-block w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ring-1 ring-black bg-neutral-400"></span>
                  </div>
                  <p className="text-[8.5px] sm:text-[9.5px] text-neutral-300 font-light truncate">
                    Liked by{" "}
                    <strong className="font-semibold text-white">
                      akash_tikhile_official
                    </strong>{" "}
                    and{" "}
                    <span className="hover:underline cursor-pointer">
                      others
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-[8.5px] sm:text-[9.5px] text-neutral-300 drop-shadow truncate pt-0.5">
                  <svg
                    className="w-2.5 h-2.5 fill-current shrink-0"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                  <span className="truncate">{reel.audio}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-2 mt-4 sm:mt-6">
        {studioReels.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            aria-label={`Go to reel ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === activeIndex
                ? "w-6 bg-amber-200"
                : "w-1.5 bg-neutral-700 hover:bg-neutral-500"
            }`}
          />
        ))}
      </div>
    </section>
  );
}