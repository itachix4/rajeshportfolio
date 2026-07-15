import { ImageResponse } from "next/og";

export const alt = "Parth Parwani — Crafted to move. Built to work.";
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
          background: "#163ee8",
          color: "#f2eddf",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        {[300, 600, 900].map((left) => (
          <div key={left} style={{ position: "absolute", top: 0, bottom: 0, left, display: "flex", width: 1, background: "rgba(242,237,223,.2)" }} />
        ))}
        <div style={{ position: "absolute", top: 315, right: 0, left: 0, display: "flex", height: 1, background: "rgba(242,237,223,.2)" }} />

        <div style={{ position: "absolute", top: 24, left: 30, display: "flex", gap: 10, fontSize: 14, fontWeight: 700 }}>
          PARTH.PARWANI <span style={{ opacity: 0.56 }}>©26</span>
        </div>
        <div style={{ position: "absolute", top: 24, left: 520, display: "flex", fontSize: 13, fontWeight: 700 }}>
          SELECTED WORK
        </div>
        <div style={{ position: "absolute", top: 24, right: 30, display: "flex", fontSize: 13, fontWeight: 700 }}>
          DESIGN / ENGINEERING
        </div>

        <div
          style={{
            position: "absolute",
            top: 85,
            left: 450,
            display: "flex",
            width: 300,
            height: 300,
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(242,237,223,.52)",
            borderRadius: 999,
            background: "radial-gradient(circle, rgba(7,12,43,.92) 0 34%, transparent 35% 49%, rgba(242,237,223,.22) 50% 50.5%, transparent 51% 65%, rgba(242,237,223,.14) 66% 66.5%, transparent 67%)",
            fontSize: 68,
            fontWeight: 800,
            letterSpacing: -8,
          }}
        >
          PP
        </div>

        <div style={{ position: "absolute", top: 92, left: 30, display: "flex", width: 340, flexDirection: "column", fontFamily: "monospace", fontSize: 13, lineHeight: 1.35, opacity: 0.78 }}>
          <span>CREATIVE DEVELOPER</span><span>UI ENGINEER</span><span>DIGITAL PRODUCT DESIGNER</span>
        </div>
        <div style={{ position: "absolute", top: 112, right: 38, display: "flex", width: 235, fontFamily: "monospace", fontSize: 12, lineHeight: 1.38, opacity: 0.72 }}>
          REAL PRODUCTS, DISTINCT SYSTEMS AND INTERACTIONS BUILT WITH INTENT.
        </div>

        <div style={{ position: "absolute", left: 30, bottom: 128, display: "flex", fontSize: 116, fontWeight: 900, letterSpacing: -10, lineHeight: 0.76 }}>
          CRAFTED TO MOVE.
        </div>
        <div style={{ position: "absolute", right: 30, bottom: 30, display: "flex", fontSize: 116, fontWeight: 900, letterSpacing: -10, lineHeight: 0.76 }}>
          BUILT TO WORK.
        </div>

        <div style={{ position: "absolute", top: 304, left: -34, display: "flex", width: 90, height: 22, transform: "rotate(-90deg)", alignItems: "center", justifyContent: "center", background: "#ff6a00", color: "#111", fontFamily: "monospace", fontSize: 9, fontWeight: 800 }}>
          BUILT IN CODE
        </div>
      </div>
    ),
    size,
  );
}
