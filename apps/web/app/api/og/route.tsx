import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

// Not edge — the background photo + font push this route's bundle past
// Vercel's 1 MB Edge Function size limit. The Node.js serverless runtime
// (the default) has a much higher limit and works identically here.
// Note: this also means local assets must be read via fs (below), not
// fetch(new URL(..., import.meta.url)) — that pattern only works under the
// edge runtime's fetch polyfill; plain Node fetch has no file:// support.

export const alt = "Beautiful animation primitives for engineers and designers.";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Flower mark — same path used for the site favicon/logo (see
// app/icon.tsx and components/logo.tsx), just at this asset's own viewBox.
const FLOWER_PATH =
  "M19 0C21.9213 0 24.3497 2.10974 24.845 4.88864C27.1602 3.27379 30.3694 3.49927 32.4351 5.56492C34.5007 7.63058 34.7261 10.8396 33.1114 13.1548C35.8903 13.6503 38 16.0787 38 19C38 21.9213 35.8903 24.3497 33.1112 24.845C34.7261 27.1602 34.5007 30.3694 32.4351 32.4351C30.3694 34.5007 27.1602 34.7261 24.845 33.1112C24.3497 35.8903 21.9213 38 19 38C16.0787 38 13.6502 35.8903 13.1548 33.1112C10.8396 34.7261 7.63058 34.5007 5.56492 32.4351C3.49927 30.3694 3.27379 27.1602 4.88864 24.845C2.10974 24.3497 0 21.9213 0 19C0 16.0787 2.10974 13.6503 4.88864 13.1548C3.27394 10.8396 3.49927 7.63058 5.56492 5.56492C7.63058 3.49927 10.8396 3.27379 13.1548 4.88864C13.6503 2.10974 16.0787 0 19 0Z";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Motion Components";

  const ogDir = path.join(process.cwd(), "public", "og");
  const [urbanistMedium, background] = await Promise.all([
    readFile(path.join(ogDir, "Urbanist-Medium.woff")),
    readFile(path.join(ogDir, "background.jpg")),
  ]);

  const backgroundSrc = `data:image/jpeg;base64,${Buffer.from(background).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          display: "flex",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={backgroundSrc}
          alt=""
          width={1200}
          height={630}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Bottom scrim so the title stays legible regardless of title
            length or where it lands over the photo. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 78%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 58,
            top: 45,
            width: 41,
            height: 41,
            display: "flex",
          }}
        >
          <svg width="41" height="41" viewBox="0 0 38 38" fill="none">
            <path d={FLOWER_PATH} fill="white" />
          </svg>
        </div>

        <div
          style={{
            position: "absolute",
            left: 79,
            right: 80,
            bottom: 42,
            display: "flex",
            color: "white",
            fontSize: 62,
            fontFamily: "Urbanist",
            fontWeight: 500,
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Urbanist",
          data: urbanistMedium,
          weight: 500,
          style: "normal",
        },
      ],
    }
  );
}
