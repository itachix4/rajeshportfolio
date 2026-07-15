import { ImageResponse } from "next/og";

export const alt = "Parth Parwani — Creative Developer, UI Engineer and Founder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background: "#0b1830",
          color: "#f0eadb",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -260,
            left: -120,
            width: 620,
            height: 620,
            borderRadius: 999,
            background: "#d96448",
            filter: "blur(90px)",
            opacity: 0.68,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -240,
            bottom: -320,
            width: 720,
            height: 720,
            borderRadius: 999,
            background: "#4f78ad",
            filter: "blur(110px)",
            opacity: 0.58,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 118,
            left: 485,
            display: "flex",
            width: 360,
            height: 360,
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(240,234,219,.28)",
            borderRadius: 999,
            background: "radial-gradient(circle at 40% 50%, #df694b 0 9%, transparent 28%), radial-gradient(circle at 67% 40%, #5d82b6 0 14%, transparent 36%), #111b32",
            boxShadow: "0 40px 110px rgba(2,7,20,.45)",
            fontSize: 74,
            fontWeight: 700,
            letterSpacing: -9,
          }}
        >
          PP
        </div>
        <div
          style={{
            position: "absolute",
            top: 34,
            left: 42,
            display: "flex",
            alignItems: "center",
            gap: 13,
            fontSize: 19,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              display: "flex",
              width: 50,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #f0eadb",
              borderRadius: 999,
              fontSize: 13,
            }}
          >
            P/P
          </span>
          Parth Parwani
        </div>
        <div
          style={{
            position: "absolute",
            top: 92,
            left: 38,
            display: "flex",
            fontSize: 190,
            fontWeight: 800,
            letterSpacing: -17,
            lineHeight: 0.8,
          }}
        >
          PARTH
        </div>
        <div
          style={{
            position: "absolute",
            right: 38,
            bottom: 78,
            display: "flex",
            fontSize: 176,
            fontWeight: 800,
            letterSpacing: -16,
            lineHeight: 0.8,
          }}
        >
          PARWANI
        </div>
        <div
          style={{
            position: "absolute",
            right: 46,
            bottom: 29,
            display: "flex",
            fontSize: 16,
            letterSpacing: 2.4,
            textTransform: "uppercase",
            opacity: 0.76,
          }}
        >
          Creative Developer · UI Engineer · Founder
        </div>
      </div>
    ),
    size,
  );
}
