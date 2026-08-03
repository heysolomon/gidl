import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#010101",
      }}
    >
      <svg width="112" height="112" viewBox="0 0 256 256" fill="none">
        <path
          d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z"
          fill="#fafafa"
        />
      </svg>
    </div>,
    { ...size }
  );
}
