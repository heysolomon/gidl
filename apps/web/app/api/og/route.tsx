import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getOgArt } from "@/lib/og-art";

// Not edge — the artwork and font push this route past Vercel's 1 MB Edge
// Function limit. Node's fetch also has no file:// support, so local assets are
// read via fs below instead of new URL(..., import.meta.url).

export const alt =
  "Animated components, recreated from inspiration and rebuilt for you to copy into your own project.";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/jpeg";

const DEFAULT_TITLE = "Animated components I recreate from inspiration";

// Flower mark — same path used for the site favicon/logo (see
// app/icon.tsx and components/logo.tsx), just at this asset's own viewBox.
const FLOWER_PATH =
  "M19 0C21.9213 0 24.3497 2.10974 24.845 4.88864C27.1602 3.27379 30.3694 3.49927 32.4351 5.56492C34.5007 7.63058 34.7261 10.8396 33.1114 13.1548C35.8903 13.6503 38 16.0787 38 19C38 21.9213 35.8903 24.3497 33.1112 24.845C34.7261 27.1602 34.5007 30.3694 32.4351 32.4351C30.3694 34.5007 27.1602 34.7261 24.845 33.1112C24.3497 35.8903 21.9213 38 19 38C16.0787 38 13.6502 35.8903 13.1548 33.1112C10.8396 34.7261 7.63058 34.5007 5.56492 32.4351C3.49927 30.3694 3.27379 27.1602 4.88864 24.845C2.10974 24.3497 0 21.9213 0 19C0 16.0787 2.10974 13.6503 4.88864 13.1548C3.27394 10.8396 3.49927 7.63058 5.56492 5.56492C7.63058 3.49927 10.8396 3.27379 13.1548 4.88864C13.6503 2.10974 16.0787 0 19 0Z";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || DEFAULT_TITLE;
  const art = getOgArt(searchParams.get("name"));

  const publicDir = path.join(process.cwd(), "public");
  const [urbanistMedium, image] = await Promise.all([
    readFile(path.join(publicDir, "og", "Urbanist-Medium.woff")),
    readFile(path.join(publicDir, "art", art.file)),
  ]);

  const imageSrc = `data:image/jpeg;base64,${image.toString("base64")}`;

  const card = new ImageResponse(
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        display: "flex",
        color: "white",
        fontFamily: "Urbanist",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt=""
        width={size.width}
        height={size.height}
        style={{ position: "absolute", left: 0, top: 0, objectFit: "cover" }}
      />

      {/* Keeps the logo and title legible on the lightest artwork. Needs
            explicit dimensions: the renderer ignores inset here. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: size.width,
          height: size.height,
          backgroundImage:
            "linear-gradient(to top, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.12) 62%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 56,
          top: 44,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 32,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 38 38" fill="none">
          <path d={FLOWER_PATH} fill="white" />
        </svg>
        gidl
      </div>

      <div
        style={{
          position: "absolute",
          left: 56,
          right: 56,
          bottom: 44,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            fontSize: title.length > 24 ? 60 : 84,
            lineHeight: 1.08,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 24, opacity: 0.8 }}>
          {art.caption}
        </div>
      </div>
    </div>,
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

  // The renderer only outputs PNG, which is heavy for a painting, and some apps
  // skip large preview images.
  const png = Buffer.from(await card.arrayBuffer());
  const jpeg = await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
