import React, { useState, useRef, useCallback, useEffect } from "react";

/* ════════════════════════════════════════
   LOOK CAROUSEL
   Displays a horizontally swipeable gallery of:
   · 2-3 room angle images (first slot = selectedLook.img)
   · 1 video slide (last slot)

   Features:
   · Touch / mouse drag swipe
   · Slide counter badge  ("1 / 4")
   · Dot indicators
   · Thumbnail strip
   · Slide label badge
   · Desktop arrow buttons
   · Children rendered as overlay on every slide
════════════════════════════════════════ */

/* ── Supplementary angle images keyed by room type ── */
const ROOM_ANGLE_IMAGES: Record<string, string[]> = {
  living: [
    "https://images.unsplash.com/photo-1757924461488-ef9ad0670978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1772475385581-9bec234dc2ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  ],
  bedroom: [
    "https://images.unsplash.com/photo-1717860477853-9538cf52833c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1772475385581-9bec234dc2ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  ],
  kitchen: [
    "https://images.unsplash.com/photo-1760067537565-1d4cbb8da0c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1757924461488-ef9ad0670978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  ],
  dining: [
    "https://images.unsplash.com/photo-1760067537565-1d4cbb8da0c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1772475385581-9bec234dc2ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  ],
  default: [
    "https://images.unsplash.com/photo-1757924461488-ef9ad0670978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1717860477853-9538cf52833c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  ],
};

/* Stock interior walkthrough video (Pexels, royalty-free) */
const LOOK_VIDEO_URL =
  "https://videos.pexels.com/video-files/3253313/3253313-hd_1280_720_25fps.mp4";

const SLIDE_LABELS = ["Main View", "Detail Angle", "Room Corner", "Video Tour"];

function getRoomKey(room: string): string {
  const r = room.toLowerCase();
  if (r.includes("living")) return "living";
  if (r.includes("bed")) return "bedroom";
  if (r.includes("kitchen")) return "kitchen";
  if (r.includes("dining")) return "dining";
  return "default";
}

export interface LookCarouselProps {
  mainImage: string;
  lookName?: string;
  room?: string;
  /** Fixed height in px (e.g. 406 for mobile), or "100%" for desktop fill */
  height: number | string;
  /** Overlay children (top bar, hotspot layer, bottom info) */
  children?: React.ReactNode;
  /** Called whenever the active slide index changes */
  onSlideChange?: (index: number) => void;
  /** If true, show left/right arrow buttons (desktop) */
  showArrows?: boolean;
}

export function LookCarousel({
  mainImage,
  lookName = "Look",
  room = "living",
  height,
  children,
  onSlideChange,
  showArrows = false,
}: LookCarouselProps) {
  const key = getRoomKey(room);
  const angleImages = ROOM_ANGLE_IMAGES[key] ?? ROOM_ANGLE_IMAGES.default;

  /* Build slide list: main + 2 angles + 1 video */
  const slides: Array<{ type: "image" | "video"; src: string; label: string }> =
    [
      { type: "image", src: mainImage, label: SLIDE_LABELS[0] },
      { type: "image", src: angleImages[0], label: SLIDE_LABELS[1] },
      { type: "image", src: angleImages[1], label: SLIDE_LABELS[2] },
      { type: "video", src: LOOK_VIDEO_URL, label: SLIDE_LABELS[3] },
    ];

  const total = slides.length;
  const [activeIdx, setActiveIdx] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* Touch / drag state */
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isDragging = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);

  const goTo = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(total - 1, idx));
      setActiveIdx(clamped);
      setVideoPlaying(false);
      onSlideChange?.(clamped);
    },
    [total, onSlideChange]
  );

  /* Pause video when slide changes away */
  useEffect(() => {
    if (videoRef.current && activeIdx !== total - 1) {
      videoRef.current.pause();
      setVideoPlaying(false);
    }
  }, [activeIdx, total]);

  /* ── Touch handlers ── */
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;
    setDragOffset(0);
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    /* Only track horizontal drag once clearly horizontal */
    if (!isDragging.current && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 6) {
      isDragging.current = true;
    }
    if (isDragging.current) {
      e.preventDefault();
      setDragOffset(dx);
    }
  }

  function handleTouchEnd() {
    if (isDragging.current && Math.abs(dragOffset) > 42) {
      goTo(dragOffset < 0 ? activeIdx + 1 : activeIdx - 1);
    }
    setDragOffset(0);
    isDragging.current = false;
    touchStartX.current = null;
    touchStartY.current = null;
  }

  /* ── Mouse drag (desktop) ── */
  const mouseStartX = useRef<number | null>(null);
  const [mouseDrag, setMouseDrag] = useState(0);

  function handleMouseDown(e: React.MouseEvent) {
    mouseStartX.current = e.clientX;
    setMouseDrag(0);
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (mouseStartX.current === null) return;
    setMouseDrag(e.clientX - mouseStartX.current);
  }

  function handleMouseUp() {
    if (Math.abs(mouseDrag) > 42) {
      goTo(mouseDrag < 0 ? activeIdx + 1 : activeIdx - 1);
    }
    mouseStartX.current = null;
    setMouseDrag(0);
  }

  const combinedOffset = dragOffset + mouseDrag;
  const containerH = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      style={{
        width: "100%",
        height: containerH,
        position: "relative",
        overflow: "hidden",
        userSelect: "none",
        touchAction: "pan-y",
        cursor: combinedOffset !== 0 ? "grabbing" : "grab",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* ── Slides track ── */}
      <div
        style={{
          display: "flex",
          width: `${total * 100}%`,
          height: "100%",
          transform: `translateX(calc(${(-activeIdx * 100) / total}% + ${combinedOffset}px))`,
          transition: combinedOffset !== 0 ? "none" : "transform 0.32s cubic-bezier(0.32,0.72,0,1)",
          willChange: "transform",
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            style={{
              width: `${100 / total}%`,
              height: "100%",
              flexShrink: 0,
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(180deg,#C8B4A0 0%,#A88C68 100%)",
            }}
          >
            {slide.type === "image" ? (
              <img
                src={slide.src}
                alt={`${lookName} — ${slide.label}`}
                draggable={false}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  pointerEvents: "none",
                }}
              />
            ) : (
              /* ── Video slide ── */
              <div style={{ position: "absolute", inset: 0 }}>
                <video
                  ref={videoRef}
                  src={slide.src}
                  loop
                  playsInline
                  muted={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {/* Overlay gradient when paused */}
                {!videoPlaying && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.42)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (videoRef.current) {
                        videoRef.current.play();
                        setVideoPlaying(true);
                      }
                    }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.18)",
                        backdropFilter: "blur(8px)",
                        border: "2px solid rgba(255,255,255,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {/* Play triangle */}
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        bottom: 80,
                        left: 0,
                        right: 0,
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-gilroy)",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.9)",
                          letterSpacing: "0.02em",
                        }}
                      >
                        Video Tour
                      </span>
                      <div
                        style={{
                          fontFamily: "var(--font-roboto)",
                          fontSize: 11,
                          color: "rgba(255,255,255,0.6)",
                          marginTop: 3,
                        }}
                      >
                        Tap to play · Room walkthrough
                      </div>
                    </div>
                  </div>
                )}
                {/* Pause button when playing */}
                {videoPlaying && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      videoRef.current?.pause();
                      setVideoPlaying(false);
                    }}
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.45)",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Per-slide label badge (top-left, only on non-first slides) */}
            {i > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: 56,
                  left: 16,
                  background: "rgba(0,0,0,0.42)",
                  backdropFilter: "blur(6px)",
                  borderRadius: 6,
                  padding: "3px 8px",
                  zIndex: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-roboto)",
                    fontSize: 9,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.85)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {slide.label}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Overlay children (top bar, hotspots, bottom info) rendered above slides ── */}
      {children}

      {/* ── Desktop arrow buttons ── */}
      {showArrows && (
        <>
          {activeIdx > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); goTo(activeIdx - 1); }}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.3)",
                cursor: "pointer",
                zIndex: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 18,
                transition: "background 0.15s",
              }}
            >
              ‹
            </button>
          )}
          {activeIdx < total - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goTo(activeIdx + 1); }}
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.3)",
                cursor: "pointer",
                zIndex: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 18,
                transition: "background 0.15s",
              }}
            >
              ›
            </button>
          )}
        </>
      )}

      {/* ── Bottom controls row: [counter pill · · · ·] ── */}
      <div
        style={{
          position: "absolute",
          bottom: 14,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          zIndex: 9,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        {/* Counter pill — left-anchored */}
        <div
          style={{
            background: "rgba(0,0,0,0.52)",
            backdropFilter: "blur(8px)",
            borderRadius: 99,
            padding: "3px 10px",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-roboto)",
              fontSize: 11,
              fontWeight: 700,
              color: "rgba(255,255,255,0.95)",
              letterSpacing: "0.04em",
            }}
          >
            {activeIdx + 1} / {total}
          </span>
        </div>

        {/* Dot indicators — centred in remaining space */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 5 }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); goTo(i); }}
              style={{
                width: i === activeIdx ? 20 : 6,
                height: 6,
                borderRadius: 99,
                background: i === activeIdx ? "white" : "rgba(255,255,255,0.45)",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "width 0.22s cubic-bezier(0.32,0.72,0,1), background 0.22s",
                flexShrink: 0,
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Spacer to balance counter pill width */}
        <div style={{ width: 44, flexShrink: 0 }} />
      </div>

      {/* ── Thumbnail strip — above the counter/dots row ── */}
      <div
        style={{
          position: "absolute",
          bottom: 38,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 6,
          padding: "0 16px",
          zIndex: 8,
        }}
      >
        {slides.map((slide, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); goTo(i); }}
            style={{
              width: 44,
              height: 32,
              borderRadius: 6,
              overflow: "hidden",
              padding: 0,
              border: `2px solid ${
                i === activeIdx ? "white" : "rgba(255,255,255,0.28)"
              }`,
              cursor: "pointer",
              flexShrink: 0,
              position: "relative",
              transition: "border-color 0.2s",
              background: "#555",
            }}
            aria-label={`Slide ${i + 1}: ${slide.label}`}
          >
            {slide.type === "image" ? (
              <img
                src={slide.src}
                alt={slide.label}
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  opacity: i === activeIdx ? 1 : 0.7,
                  transition: "opacity 0.2s",
                }}
              />
            ) : (
              /* Video thumbnail — play icon overlay */
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#222",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(255,255,255,0.8)">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}