"use client";

import { useRef, useEffect, useState, useCallback } from "react";

// Front-camera selfie capture for clock in/out.
//
// Mirrors the compression approach already used by ModelRegistrationForm:
// draw the video frame to a canvas, then export a compressed JPEG data URL so
// the upload stays small enough for a serverless request body.

const MAX_DIMENSION = 640; // plenty to identify a face; keeps payload small
const JPEG_QUALITY = 0.75;

type Props = {
  /** Called with a compressed JPEG data URL once the user confirms. */
  onCapture: (dataUrl: string) => void;
  onCancel: () => void;
  /** Wording differs for clocking in vs out. */
  action: "in" | "out";
};

export function SelfieCapture({ onCapture, onCancel, action }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [preview, setPreview] = useState<string>("");

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("This device or browser does not support camera access.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setReady(true);
      } catch (err) {
        const name = (err as { name?: string }).name;
        setError(
          name === "NotAllowedError"
            ? "Camera permission was denied. Please allow camera access to clock in."
            : "Could not start the camera."
        );
      }
    })();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [stopCamera]);

  const snap = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    // Scale the longest edge down to MAX_DIMENSION, preserving aspect ratio.
    const scale = Math.min(1, MAX_DIMENSION / Math.max(video.videoWidth, video.videoHeight));
    const w = Math.round(video.videoWidth * scale);
    const h = Math.round(video.videoHeight * scale);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Un-mirror: the preview is mirrored for comfort, but the stored photo
    // should look like a normal photograph.
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w, h);

    setPreview(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
    stopCamera();
    setReady(false);
  };

  const retake = () => {
    setPreview("");
    window.location.reload(); // simplest reliable way to re-acquire the camera
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.92)" }}
    >
      <div className="w-full max-w-sm section-padding">
        <p className="text-[10px] text-[#FF0000] tracking-[0.3em] uppercase" style={{ marginBottom: "0.5rem" }}>
          {action === "in" ? "Clock In" : "Clock Out"} Photo
        </p>
        <p className="text-[#999] text-xs leading-relaxed" style={{ marginBottom: "var(--space-md)" }}>
          A photo is taken to confirm attendance.
        </p>

        <div
          className="relative w-full overflow-hidden border border-[#333]"
          style={{ aspectRatio: "1 / 1", background: "#000" }}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Captured selfie" className="w-full h-full object-cover" />
          ) : (
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }} // mirror preview only
            />
          )}
        </div>

        {error && (
          <p className="text-[#FF0000] text-sm" style={{ marginTop: "var(--space-md)" }}>
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3" style={{ marginTop: "var(--space-lg)" }}>
          {preview ? (
            <>
              <button
                onClick={() => onCapture(preview)}
                className="w-full text-sm tracking-[0.2em] uppercase font-bold py-4"
                style={{ background: "#FF0000", color: "#fff", border: "1px solid #FF0000" }}
                data-cursor-hover
              >
                Confirm &amp; {action === "in" ? "Clock In" : "Clock Out"}
              </button>
              <button
                onClick={retake}
                className="w-full text-xs tracking-[0.2em] uppercase py-3 border border-[#333] text-white hover:border-white transition-colors"
                data-cursor-hover
              >
                Retake
              </button>
            </>
          ) : (
            <button
              onClick={snap}
              disabled={!ready}
              className="w-full text-sm tracking-[0.2em] uppercase font-bold py-4 disabled:opacity-40"
              style={{ background: "#FF0000", color: "#fff", border: "1px solid #FF0000" }}
              data-cursor-hover
            >
              {ready ? "Take Photo" : "Starting camera…"}
            </button>
          )}

          <button
            onClick={() => {
              stopCamera();
              onCancel();
            }}
            className="w-full text-xs tracking-[0.25em] uppercase py-2 text-[#666] hover:text-white transition-colors"
            data-cursor-hover
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
