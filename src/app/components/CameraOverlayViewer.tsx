import { useState, useRef, useEffect } from "react";

interface CameraOverlayViewerProps {
  imageUrl: string;
  lookName: string;
  onClose: () => void;
}

export function CameraOverlayViewer({ imageUrl, lookName, onClose }: CameraOverlayViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayImageRef = useRef<HTMLImageElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Overlay controls
  const [overlayOpacity, setOverlayOpacity] = useState(0.6);
  const [overlayScale, setOverlayScale] = useState(1);
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPinching, setIsPinching] = useState(false);
  const [initialPinchDistance, setInitialPinchDistance] = useState(0);
  const [initialScale, setInitialScale] = useState(1);
  const [screenshotTaken, setScreenshotTaken] = useState(false);

  // Start camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: any) {
        console.error("Camera access error:", err);
        setCameraError(err.message || "Unable to access camera");
      }
    };
    startCamera();

    return () => {
      // Cleanup: stop all video tracks
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Touch handlers for drag
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - overlayPosition.x,
        y: e.touches[0].clientY - overlayPosition.y,
      });
    } else if (e.touches.length === 2) {
      // Pinch start
      setIsPinching(true);
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialPinchDistance(distance);
      setInitialScale(overlayScale);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isPinching && e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = (distance / initialPinchDistance) * initialScale;
      setOverlayScale(Math.max(0.3, Math.min(3, scale)));
    } else if (isDragging && e.touches.length === 1) {
      setOverlayPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsPinching(false);
  };

  // Mouse handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - overlayPosition.x,
      y: e.clientY - overlayPosition.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOverlayPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Take screenshot
  const takeScreenshot = () => {
    if (!videoRef.current || !overlayImageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const overlayImg = overlayImageRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Calculate overlay position and size relative to canvas
    const videoRect = video.getBoundingClientRect();
    const scaleX = canvas.width / videoRect.width;
    const scaleY = canvas.height / videoRect.height;

    // Draw overlay image
    ctx.globalAlpha = overlayOpacity;
    const overlayWidth = overlayImg.naturalWidth * overlayScale * scaleX;
    const overlayHeight = overlayImg.naturalHeight * overlayScale * scaleY;
    const overlayX = (overlayPosition.x + videoRect.width / 2) * scaleX - overlayWidth / 2;
    const overlayY = (overlayPosition.y + videoRect.height / 2) * scaleY - overlayHeight / 2;

    ctx.drawImage(overlayImg, overlayX, overlayY, overlayWidth, overlayHeight);
    ctx.globalAlpha = 1;

    // Download screenshot
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `lookbook-preview-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
        setScreenshotTaken(true);
        setTimeout(() => setScreenshotTaken(false), 2000);
      }
    });
  };

  // Reset position and scale
  const resetOverlay = () => {
    setOverlayPosition({ x: 0, y: 0 });
    setOverlayScale(1);
    setOverlayOpacity(0.6);
  };

  if (cameraError) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#1A1A1A", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: "white", borderRadius: 20, padding: 30, maxWidth: 400, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📷</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>Camera Access Required</div>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 20, lineHeight: 1.5 }}>
            We need camera access to preview the look in your space. Please allow camera permissions and try again.
          </div>
          <div style={{ fontSize: 12, color: "#999", marginBottom: 20, padding: 12, background: "#F5F5F5", borderRadius: 8 }}>
            Error: {cameraError}
          </div>
          <button
            onClick={onClose}
            style={{
              width: "100%",
              background: "#1A1A1A",
              color: "white",
              border: "none",
              borderRadius: 12,
              padding: "14px 24px",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 9999, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)", padding: "50px 20px 30px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={onClose}
            style={{
              width: 40,
              height: 40,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              border: "none",
              borderRadius: "50%",
              color: "white",
              fontSize: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
          <div style={{ flex: 1, textAlign: "center", color: "white", fontSize: 14, fontWeight: 600, padding: "0 10px" }}>
            Preview in Space
          </div>
          <div style={{ width: 40 }} />
        </div>
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 8 }}>
          {lookName}
        </div>
      </div>

      {/* Camera feed */}
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          touchAction: "none",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Overlay image */}
        {imageLoaded && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(calc(-50% + ${overlayPosition.x}px), calc(-50% + ${overlayPosition.y}px)) scale(${overlayScale})`,
              opacity: overlayOpacity,
              pointerEvents: "none",
              maxWidth: "90%",
              maxHeight: "90%",
            }}
          >
            <img
              ref={overlayImageRef}
              src={imageUrl}
              alt={lookName}
              onLoad={() => setImageLoaded(true)}
              style={{
                maxWidth: "80vw",
                maxHeight: "70vh",
                objectFit: "contain",
                borderRadius: 12,
                boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        )}

        {/* Hidden image for preloading */}
        {!imageLoaded && (
          <img
            ref={overlayImageRef}
            src={imageUrl}
            alt={lookName}
            onLoad={() => setImageLoaded(true)}
            style={{ display: "none" }}
          />
        )}

        {/* Loading indicator */}
        {!imageLoaded && (
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "white", fontSize: 14 }}>
            Loading image...
          </div>
        )}
      </div>

      {/* Controls panel */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)", padding: "40px 20px 30px" }}>
        {/* Opacity slider */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "white", fontSize: 12, fontWeight: 500 }}>Opacity</span>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>{Math.round(overlayOpacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={overlayOpacity * 100}
            onChange={(e) => setOverlayOpacity(Number(e.target.value) / 100)}
            style={{
              width: "100%",
              height: 4,
              borderRadius: 2,
              background: "rgba(255,255,255,0.3)",
              outline: "none",
              WebkitAppearance: "none",
            }}
          />
        </div>

        {/* Scale slider */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "white", fontSize: 12, fontWeight: 500 }}>Size</span>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>{Math.round(overlayScale * 100)}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="300"
            value={overlayScale * 100}
            onChange={(e) => setOverlayScale(Number(e.target.value) / 100)}
            style={{
              width: "100%",
              height: 4,
              borderRadius: 2,
              background: "rgba(255,255,255,0.3)",
              outline: "none",
              WebkitAppearance: "none",
            }}
          />
        </div>

        {/* Instruction text */}
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.7)", fontSize: 11, marginBottom: 16, lineHeight: 1.4 }}>
          📱 Drag to move • Pinch to resize • Adjust sliders for fine-tuning
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={resetOverlay}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 12,
              color: "white",
              padding: "14px 20px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <span>↻</span> Reset
          </button>
          <button
            onClick={takeScreenshot}
            style={{
              flex: 2,
              background: screenshotTaken ? "#4CAF50" : "white",
              border: "none",
              borderRadius: 12,
              color: screenshotTaken ? "white" : "#1A1A1A",
              padding: "14px 20px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all 0.3s",
            }}
          >
            {screenshotTaken ? (
              <>
                <span>✓</span> Saved!
              </>
            ) : (
              <>
                <span>📸</span> Take Screenshot
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hidden canvas for screenshot */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
