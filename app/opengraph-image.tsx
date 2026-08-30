import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Meet Chauhan — Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The card people see when the site is shared in Slack, WhatsApp, LinkedIn or
 * X. Rendered at build time rather than shipped as a binary, so it stays in
 * sync with the wording here instead of drifting from a stale exported PNG.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          // Satori (the renderer behind next/og) supports only a subset of
          // CSS — it cannot parse rgba() inside linear-gradient, so the grid
          // background this page uses is deliberately left out here.
          backgroundColor: "#F7F4EF",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 6,
            color: "#7C7468",
            marginBottom: 26,
          }}
        >
          FULL STACK DEVELOPER
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 118,
            fontWeight: 800,
            color: "#1C1C1C",
            lineHeight: 1.05,
            letterSpacing: -3,
          }}
        >
          Meet Chauhan
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "#57534E",
            marginTop: 28,
          }}
        >
          I think in systems · I build for humans
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 56,
            fontSize: 26,
            color: "#7C7468",
          }}
        >
          React · Next.js · TypeScript · Node.js
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 14,
            display: "flex",
            backgroundColor: "#1C1C1C",
          }}
        />
      </div>
    ),
    size
  );
}
