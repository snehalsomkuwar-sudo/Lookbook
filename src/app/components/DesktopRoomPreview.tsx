import { useState, useRef, useCallback, useEffect } from "react";

interface DesktopRoomPreviewProps {
  imageUrl: string;
  lookName: string;
  onClose: () => void;
}

type Phase = "upload" | "preview";

export function DesktopRoomPreview({ imageUrl, lookName, onClose }: DesktopRoomPreviewProps) {
  const [phase, setPhase] = useState<Phase>("upload");
  const [roomDataUrl, setRoomDataUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Composite controls
  const [overlayOpacity, setOverlayOpacity] = useState(0.88);
  const [overlayScale, setOverlayScale] = useState(0.55);
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSelected, setIsSelected] = useState(false);

  // Status
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const roomImgRef = useRef<HTMLImageElement>(null);
  const overlayImgRef = useRef<HTMLImageElement>(null);
  const previewAreaRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while modal open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Click outside overlay to deselect
  useEffect(() => {
    const handler = () => setIsSelected(false);
    window.addEventListener("mouseup", handler);
    return () => window.removeEventListener("mouseup", handler);
  }, []);

  const loadFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setRoomDataUrl(e.target?.result as string);
      setOverlayPosition({ x: 0, y: 0 });
      setOverlayScale(0.55);
      setOverlayOpacity(0.88);
      setPhase("preview");
    };
    reader.readAsDataURL(file);
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    e.target.value = "";
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  }, []);

  /* ── Drag handlers for the look overlay ──────────────────────── */
  const handleOverlayMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setIsSelected(true);
    setDragStart({ x: e.clientX - overlayPosition.x, y: e.clientY - overlayPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOverlayPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  /* ── Canvas compositing helper ───────────────────────────────── */
  // Replicates CSS objectFit:cover math so the export matches screen
  const composite = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const roomImg = roomImgRef.current;
      const overlayImg = overlayImgRef.current;
      const area = previewAreaRef.current;
      const canvas = canvasRef.current;
      if (!roomImg || !overlayImg || !area || !canvas) { resolve(null); return; }

      const areaW = area.clientWidth;
      const areaH = area.clientHeight;

      // Export at 2× for quality
      const SCALE = 2;
      canvas.width = areaW * SCALE;
      canvas.height = areaH * SCALE;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(SCALE, SCALE);

      // --- Draw room with cover crop ---
      const rW = roomImg.naturalWidth;
      const rH = roomImg.naturalHeight;
      const areaAspect = areaW / areaH;
      const imgAspect = rW / rH;
      let srcX = 0, srcY = 0, srcW = rW, srcH = rH;
      if (imgAspect > areaAspect) {
        // Image wider → crop sides
        srcW = rH * areaAspect;
        srcX = (rW - srcW) / 2;
      } else {
        // Image taller → crop top/bottom
        srcH = rW / areaAspect;
        srcY = (rH - srcH) / 2;
      }
      ctx.drawImage(roomImg, srcX, srcY, srcW, srcH, 0, 0, areaW, areaH);

      // --- Draw look overlay ---
      // Natural size of overlay rendered at overlayScale
      const oNatW = overlayImg.naturalWidth;
      const oNatH = overlayImg.naturalHeight;
      // On screen the img element is constrained to maxWidth/maxHeight
      const maxW = areaW * 0.8;
      const maxH = areaH * 0.75;
      const fitScale = Math.min(1, maxW / oNatW, maxH / oNatH);
      const renderedW = oNatW * fitScale * overlayScale;
      const renderedH = oNatH * fitScale * overlayScale;

      const centerX = areaW / 2 + overlayPosition.x;
      const centerY = areaH / 2 + overlayPosition.y;
      const oX = centerX - renderedW / 2;
      const oY = centerY - renderedH / 2;

      ctx.globalAlpha = overlayOpacity;
      ctx.drawImage(overlayImg, oX, oY, renderedW, renderedH);
      ctx.globalAlpha = 1;

      canvas.toBlob(resolve, "image/jpeg", 0.94);
    });
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    const blob = await composite();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lookbook-preview-${Date.now()}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    }
    setIsDownloading(false);
  };

  const handleShare = async () => {
    const blob = await composite();
    if (!blob) return;
    const file = new File([blob], "lookbook-preview.jpg", { type: "image/jpeg" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ title: `LookBook — ${lookName}`, files: [file] });
        return;
      } catch (_) { /* fall through */ }
    }
    // Fallback: copy link text
    try {
      await navigator.clipboard.writeText(`Check out this look on LookBook by Livspace: ${lookName}`);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    } catch (_) {}
  };

  /* ════════════════════════════════════════════════════════════════
     PHASE: UPLOAD
  ════════════════════════════════════════════════════════════════ */
  if (phase === "upload") {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(13,13,13,0.78)",
          backdropFilter: "blur(8px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            background: "var(--card)",
            borderRadius: "var(--radius)",
            width: "100%",
            maxWidth: 540,
            overflow: "hidden",
            boxShadow: "0 32px 96px rgba(0,0,0,0.45)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 22px 18px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-gilroy)",
                  fontWeight: "var(--font-weight-semibold)",
                  fontSize: "var(--text-base)",
                  color: "var(--foreground)",
                }}
              >
                🛋️ Preview in Your Space
              </div>
              <div
                style={{
                  fontFamily: "var(--font-gilroy)",
                  fontSize: 12,
                  color: "var(--muted-foreground)",
                  marginTop: 3,
                }}
              >
                {lookName}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 34,
                height: 34,
                background: "var(--muted)",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                color: "var(--foreground)",
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>

          {/* Look thumbnail strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 22px",
              background: "var(--background)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <img
              src={imageUrl}
              alt={lookName}
              style={{
                width: 68,
                height: 52,
                objectFit: "cover",
                borderRadius: 8,
                flexShrink: 0,
                border: "1px solid var(--border)",
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: "var(--font-gilroy)",
                  fontWeight: "var(--font-weight-medium)",
                  fontSize: "var(--text-sm)",
                  color: "var(--foreground)",
                }}
              >
                This look will be placed in your photo
              </div>
              <div
                style={{
                  fontFamily: "var(--font-gilroy)",
                  fontSize: 12,
                  color: "var(--muted-foreground)",
                  marginTop: 2,
                }}
              >
                You can drag, resize, and adjust opacity after upload
              </div>
            </div>
          </div>

          {/* Drop zone */}
          <div style={{ padding: "22px 22px 26px" }}>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDragOver ? "var(--primary)" : "var(--border)"}`,
                borderRadius: "var(--radius)",
                background: isDragOver ? "rgba(235,89,95,0.05)" : "var(--background)",
                padding: "36px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                transition: "all 0.18s",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  background: isDragOver ? "rgba(235,89,95,0.12)" : "var(--muted)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  transition: "all 0.18s",
                }}
              >
                🏠
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-gilroy)",
                    fontWeight: "var(--font-weight-semibold)",
                    fontSize: "var(--text-base)",
                    color: "var(--foreground)",
                    marginBottom: 5,
                  }}
                >
                  {isDragOver ? "Drop your photo here" : "Upload a photo of your room"}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-gilroy)",
                    fontSize: 13,
                    color: "var(--muted-foreground)",
                    lineHeight: 1.55,
                  }}
                >
                  Drag & drop or click to browse · JPG, PNG, WEBP
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                style={{
                  marginTop: 4,
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                  border: "none",
                  borderRadius: 9999,
                  height: 44,
                  padding: "0 28px",
                  fontFamily: "var(--font-gilroy)",
                  fontWeight: "var(--font-weight-medium)",
                  fontSize: "var(--text-sm)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                📂 Choose Photo
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFilePick}
              style={{ display: "none" }}
            />
            <div
              style={{
                marginTop: 14,
                fontFamily: "var(--font-gilroy)",
                fontSize: 12,
                color: "var(--muted-foreground)",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              💡 A wide-angle photo of your room works best. The look will be layered on top so you can see it in your space.
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════════
     PHASE: PREVIEW — Room fills screen, look overlaid on top
  ════════════════════════════════════════════════════════════════ */
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── Top bar ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, transparent 100%)",
          padding: "18px 22px 52px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          pointerEvents: "none",
        }}
      >
        {/* re-enable pointer on buttons */}
        <button
          onClick={onClose}
          style={{
            pointerEvents: "all",
            width: 40,
            height: 40,
            background: "rgba(255,255,255,0.14)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "50%",
            color: "white",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          ✕
        </button>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "var(--font-gilroy)",
              fontWeight: "var(--font-weight-semibold)",
              fontSize: "var(--text-sm)",
              color: "white",
            }}
          >
            Preview in Your Space
          </div>
          <div
            style={{
              fontFamily: "var(--font-gilroy)",
              fontSize: 12,
              color: "rgba(255,255,255,0.6)",
              marginTop: 2,
            }}
          >
            {lookName}
          </div>
        </div>
        <button
          onClick={() => { setPhase("upload"); setRoomDataUrl(null); }}
          style={{
            pointerEvents: "all",
            height: 34,
            padding: "0 16px",
            background: "rgba(255,255,255,0.13)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 9999,
            color: "white",
            fontFamily: "var(--font-gilroy)",
            fontSize: 12,
            fontWeight: "var(--font-weight-medium)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          🔄 Change photo
        </button>
      </div>

      {/* ── Compositing canvas (visual) ── */}
      <div
        ref={previewAreaRef}
        style={{
          position: "absolute",
          inset: 0,
          // leave room for bottom panel — we account with padding, but the area fills all
          overflow: "hidden",
          cursor: isDragging ? "grabbing" : "default",
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Room photo fills the entire area with cover */}
        {roomDataUrl && (
          <img
            ref={roomImgRef}
            src={roomDataUrl}
            alt="Your room"
            draggable={false}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
              userSelect: "none",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        )}

        {/* Look overlay — draggable, centered, sits on top of room */}
        <div
          onMouseDown={handleOverlayMouseDown}
          style={{
            position: "absolute",
            zIndex: 2,
            top: "50%",
            left: "50%",
            transform: `translate(calc(-50% + ${overlayPosition.x}px), calc(-50% + ${overlayPosition.y}px)) scale(${overlayScale})`,
            transformOrigin: "center center",
            opacity: overlayOpacity,
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
            // Visible selection ring when selected
            outline: isSelected ? "2px dashed rgba(255,255,255,0.7)" : "2px dashed transparent",
            outlineOffset: 6,
            borderRadius: 8,
            transition: isDragging ? "none" : "outline 0.15s, opacity 0.15s",
          }}
        >
          <img
            ref={overlayImgRef}
            src={imageUrl}
            alt={lookName}
            draggable={false}
            style={{
              display: "block",
              maxWidth: "80vw",
              maxHeight: "75vh",
              objectFit: "contain",
              borderRadius: 8,
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Drag hint — fades in briefly then disappears */}
        {!isDragging && overlayPosition.x === 0 && overlayPosition.y === 0 && (
          <div
            style={{
              position: "absolute",
              zIndex: 3,
              bottom: "34%",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(0,0,0,0.52)",
              backdropFilter: "blur(8px)",
              borderRadius: 9999,
              padding: "7px 16px",
              color: "rgba(255,255,255,0.85)",
              fontFamily: "var(--font-gilroy)",
              fontSize: 12,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              animation: "fadeInOut 3.5s ease forwards",
            }}
          >
            ✥ Drag the look to reposition
          </div>
        )}
      </div>

      {/* ── Bottom controls panel ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.65) 60%, transparent 100%)",
          padding: "52px 28px 28px",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            maxWidth: 620,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            pointerEvents: "all",
          }}
        >
          {/* Sliders */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
            {/* Opacity */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontFamily: "var(--font-gilroy)", fontWeight: "var(--font-weight-medium)" }}>
                  Opacity
                </span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "var(--font-gilroy)" }}>
                  {Math.round(overlayOpacity * 100)}%
                </span>
              </div>
              <input
                type="range" min="15" max="100"
                value={Math.round(overlayOpacity * 100)}
                onChange={(e) => setOverlayOpacity(Number(e.target.value) / 100)}
                style={{ width: "100%", accentColor: "var(--primary)", cursor: "pointer" }}
              />
            </div>
            {/* Scale */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontFamily: "var(--font-gilroy)", fontWeight: "var(--font-weight-medium)" }}>
                  Size
                </span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "var(--font-gilroy)" }}>
                  {Math.round(overlayScale * 100)}%
                </span>
              </div>
              <input
                type="range" min="15" max="180"
                value={Math.round(overlayScale * 100)}
                onChange={(e) => setOverlayScale(Number(e.target.value) / 100)}
                style={{ width: "100%", accentColor: "var(--primary)", cursor: "pointer" }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            {/* Reset */}
            <button
              onClick={() => { setOverlayPosition({ x: 0, y: 0 }); setOverlayScale(0.55); setOverlayOpacity(0.88); setIsSelected(false); }}
              style={{
                height: 48,
                padding: "0 18px",
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: 9999,
                color: "white",
                fontFamily: "var(--font-gilroy)",
                fontWeight: "var(--font-weight-medium)",
                fontSize: "var(--text-sm)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexShrink: 0,
              }}
            >
              ↺ Reset
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              style={{
                flex: 1,
                height: 48,
                background: shareSuccess ? "rgba(70,158,89,0.25)" : "rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
                border: `1px solid ${shareSuccess ? "rgba(70,158,89,0.5)" : "rgba(255,255,255,0.16)"}`,
                borderRadius: 9999,
                color: shareSuccess ? "#6FCF97" : "white",
                fontFamily: "var(--font-gilroy)",
                fontWeight: "var(--font-weight-medium)",
                fontSize: "var(--text-sm)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                transition: "all 0.3s",
              }}
            >
              {shareSuccess ? "✓ Link copied!" : "↗ Share"}
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              style={{
                flex: 2,
                height: 48,
                background: downloadSuccess ? "rgba(70,158,89,0.85)" : "var(--primary)",
                border: "none",
                borderRadius: 9999,
                color: "var(--primary-foreground)",
                fontFamily: "var(--font-gilroy)",
                fontWeight: "var(--font-weight-semibold)",
                fontSize: "var(--text-sm)",
                cursor: isDownloading ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: isDownloading ? 0.7 : 1,
                transition: "all 0.3s",
              }}
            >
              {isDownloading ? "⏳ Saving…" : downloadSuccess ? "✓ Downloaded!" : "⬇ Download"}
            </button>
          </div>
        </div>
      </div>

      {/* Hidden canvas for export */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <style>{`
        @keyframes fadeInOut {
          0%   { opacity: 0; transform: translateX(-50%) translateY(6px); }
          15%  { opacity: 1; transform: translateX(-50%) translateY(0); }
          70%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
