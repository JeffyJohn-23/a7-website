import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "A7 Entertainment — Event Management & Digital Marketing Agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#000000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Red radial glow */}
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,0,0,0.18) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        {/* Corner brackets */}
        <div style={{ position: "absolute", top: 40, left: 40, width: 30, height: 30, borderTop: "2px solid rgba(255,255,255,0.3)", borderLeft: "2px solid rgba(255,255,255,0.3)", display: "flex" }} />
        <div style={{ position: "absolute", top: 40, right: 40, width: 30, height: 30, borderTop: "2px solid rgba(255,255,255,0.3)", borderRight: "2px solid rgba(255,255,255,0.3)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: 40, left: 40, width: 30, height: 30, borderBottom: "2px solid rgba(255,255,255,0.3)", borderLeft: "2px solid rgba(255,255,255,0.3)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: 40, right: 40, width: 30, height: 30, borderBottom: "2px solid rgba(255,255,255,0.3)", borderRight: "2px solid rgba(255,255,255,0.3)", display: "flex" }} />
        {/* A7 logo */}
        <div
          style={{
            color: "#FF0000",
            fontSize: 110,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            display: "flex",
          }}
        >
          A7
        </div>
        {/* Company name */}
        <div
          style={{
            color: "#FFFFFF",
            fontSize: 36,
            fontWeight: 600,
            marginTop: 8,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          Entertainment
        </div>
        {/* Divider */}
        <div
          style={{
            width: 60,
            height: 1,
            background: "#FF0000",
            marginTop: 24,
            marginBottom: 24,
            display: "flex",
          }}
        />
        {/* Tagline */}
        <div
          style={{
            color: "#999999",
            fontSize: 20,
            fontWeight: 400,
            letterSpacing: "0.05em",
            display: "flex",
          }}
        >
          Event Management · Digital Marketing · Celebrity Management
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
